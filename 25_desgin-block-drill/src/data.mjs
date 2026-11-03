const order = (extra = {}) => ({ itemId: 'ITEM-A', quantity: 2, orderStatus: 'accepted', reservationStatus: 'none', reservedQuantity: 0, paymentStatus: 'pending', shippingStatus: 'none', cancellationStatus: 'none', ...extra });
const reserved = { reservationStatus: 'reserved', reservedQuantity: 2, paymentStatus: 'paid' };
const node = (id, label, x, y, operations, success = 'END', failure = '') => ({ id, label, x, y, operations, success, failure });
export const initialGraph = {
  entries: { order: 'stock', cancel: 'request', ship: 'shipping' },
  nodes: [
    node('stock', '在庫を確保', 40, 70, ['reserve'], 'payment', 'shortage'),
    node('payment', '決済する', 330, 70, ['pay'], 'shipping'),
    node('shipping', '出荷する', 620, 70, ['ship']),
    node('shortage', '在庫不足', 40, 190, ['shortage']),
    node('request', 'キャンセル受付', 40, 320, ['cancel'], 'cleanup', 'failed'),
    node('cleanup', 'キャンセル後処理', 330, 320, ['release', 'refund', 'confirm'], 'notify', 'failed'),
    node('notify', '完了を知らせる', 620, 320, ['email']),
    node('failed', 'キャンセル失敗', 330, 460, ['fail'], 'notify'),
  ],
};
const path = (path, equals, label) => ({ path, equals, label });
const effect = (event, equals) => ({ event, equals, label: { shipping: '出荷指示の合計', refund: '返金の合計', cancelCompletedEmail: 'キャンセル完了通知の合計' }[event] });
const p = (field, value, id = 'ORD-001') => path(`orders.${id}.${field}`, value);
function test(id, title, description, stock, orders, events, assertions) { return { id, title, description, initialState: { inventory: { 'ITEM-A': stock }, orders, effects: [] }, events, assertions: [path('inventory.ITEM-A', stock, '在庫'), ...assertions] }; }
export const tests = [
  test('TC-01', '注文時の決済・出荷', '在庫10個に対して2個の注文が届きます。在庫を確保し、決済後に出荷指示を1回記録してください。', 10, { 'ORD-001': order() }, [{ type: 'order', orderId: 'ORD-001' }], [p('reservationStatus', 'reserved'), p('reservedQuantity', 2), p('paymentStatus', 'paid'), p('orderStatus', 'accepted'), effect('shipping', 1), effect('refund', 0), effect('cancelCompletedEmail', 0)]),
  test('TC-02', '在庫不足時の処理', '在庫1個に対して2個の注文が届きます。在庫不足を記録し、決済・出荷は行わないでください。', 1, { 'ORD-001': order() }, [{ type: 'order', orderId: 'ORD-001' }], [p('orderStatus', 'stock_shortage'), p('paymentStatus', 'pending'), p('reservedQuantity', 0), effect('shipping', 0), effect('refund', 0), effect('cancelCompletedEmail', 0)]),
  test('TC-03', '後処理失敗時の通知', '在庫8個、在庫の引当記録がない注文にキャンセル要求が届きます。引当解除は失敗します。キャンセル失敗を記録し、返金・完了通知は行わないでください。', 8, { 'ORD-001': order() }, [{ type: 'cancel', orderId: 'ORD-001' }], [p('cancellationStatus', 'failed'), p('reservationStatus', 'none'), p('paymentStatus', 'pending'), effect('shipping', 0), effect('refund', 0), effect('cancelCompletedEmail', 0)]),
  test('TC-04', 'キャンセル時の後処理', '在庫を2個引当済み・決済済みの注文にキャンセル要求が届きます。在庫を戻して返金し、キャンセルを確定して完了通知を1回送ってください。', 8, { 'ORD-001': order(reserved) }, [{ type: 'cancel', orderId: 'ORD-001' }], [p('reservationStatus', 'released'), p('reservedQuantity', 0), p('paymentStatus', 'refunded'), p('cancellationStatus', 'succeeded'), p('orderStatus', 'cancelled'), effect('shipping', 0), effect('refund', 1), effect('cancelCompletedEmail', 1)]),
  test('TC-05', 'キャンセルの再受付', '同じ注文にキャンセル要求が2回届きます。在庫戻し・返金・完了通知は、それぞれ合計1回にしてください。', 8, { 'ORD-001': order(reserved) }, [{ type: 'cancel', orderId: 'ORD-001' }, { type: 'cancel', orderId: 'ORD-001' }], [p('cancellationStatus', 'succeeded'), p('reservedQuantity', 0), p('paymentStatus', 'refunded'), effect('shipping', 0), effect('refund', 1), effect('cancelCompletedEmail', 1)]),
  test('TC-06', '複数注文の在庫確保', '在庫5個に対して3個ずつの注文A・Bが順に届きます。注文Aを先に処理し、注文Bは在庫不足にしてください。出荷指示は合計1回です。', 5, { 'ORD-A': order({ quantity: 3 }), 'ORD-B': order({ quantity: 3 }) }, [{ type: 'order', orderId: 'ORD-A' }, { type: 'order', orderId: 'ORD-B' }], [p('reservedQuantity', 3, 'ORD-A'), p('paymentStatus', 'paid', 'ORD-A'), p('reservedQuantity', 0, 'ORD-B'), p('orderStatus', 'stock_shortage', 'ORD-B'), p('paymentStatus', 'pending', 'ORD-B'), p('shippingStatus', 'none', 'ORD-B'), effect('shipping', 1), effect('refund', 0), effect('cancelCompletedEmail', 0)]),
  test('TC-07', '出荷後のキャンセル', '出荷指示の入力後にキャンセル要求が届きます。出荷確定後なのでキャンセル失敗を記録し、在庫戻し・返金・完了通知は行わないでください。', 8, { 'ORD-001': order(reserved) }, [{ type: 'ship', orderId: 'ORD-001' }, { type: 'cancel', orderId: 'ORD-001' }], [p('shippingStatus', 'requested'), p('cancellationStatus', 'failed'), p('reservationStatus', 'reserved'), p('paymentStatus', 'paid'), effect('shipping', 1), effect('refund', 0), effect('cancelCompletedEmail', 0)]),
];
for (const [index, stock] of [[0, 8], [3, 10], [4, 10], [5, 2]]) tests[index].assertions[0].equals = stock;
const perspectives = [
  '「在庫を確保」で引当を記録し、「決済する」「出荷する」が必要な状態を満たして実行されるか確認します。',
  '「在庫を確保」が失敗した場合に「在庫不足」を記録し、「決済する」「出荷する」を実行しないか確認します。',
  '「キャンセル後処理」で引当解除が失敗したとき、「キャンセル失敗」を記録し、「完了を知らせる」を実行しないか確認します。',
  '「キャンセル後処理」の引当解除・返金が完了してからキャンセルを確定し、「完了を知らせる」を実行するか確認します。',
  '「キャンセル受付」に同じ要求が届いても、成功済みのキャンセルを再処理せず、引当解除・返金・完了通知を重複させないか確認します。',
  '複数注文が共有在庫を使っても過剰引当せず、引当できない注文を先へ進めないか。',
  '出荷確定点以降のキャンセルを拒否し、出荷とキャンセル成功が両立しないか。',
];
tests.forEach((test, i) => { test.perspective = perspectives[i]; });
