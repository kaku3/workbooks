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
const effect = (event, equals) => ({ event, equals, label: { shipping: '出荷指示件数', refund: '返金件数', cancelCompletedEmail: 'キャンセル完了メール件数' }[event] });
const p = (field, value, id = 'ORD-001') => path(`orders.${id}.${field}`, value);
function test(id, title, description, stock, orders, events, assertions) { return { id, title, description, initialState: { inventory: { 'ITEM-A': stock }, orders, effects: [] }, events, assertions: [path('inventory.ITEM-A', stock, '在庫'), ...assertions] }; }
export const tests = [
  test('TC-01', '通常注文', '在庫10・2個注文。引当→決済→出荷。', 10, { 'ORD-001': order() }, [{ type: 'order', orderId: 'ORD-001' }], [p('reservationStatus', 'reserved'), p('reservedQuantity', 2), p('paymentStatus', 'paid'), p('orderStatus', 'accepted'), effect('shipping', 1), effect('refund', 0), effect('cancelCompletedEmail', 0)]),
  test('TC-02', '在庫不足', '在庫1・2個注文。決済と出荷を行わない。', 1, { 'ORD-001': order() }, [{ type: 'order', orderId: 'ORD-001' }], [p('orderStatus', 'stock_shortage'), p('paymentStatus', 'pending'), p('reservedQuantity', 0), effect('shipping', 0), effect('refund', 0), effect('cancelCompletedEmail', 0)]),
  test('TC-03', '失敗後の誤メール', '在庫8・引当記録なし。解除失敗後に完了メールを送ってはいけない。', 8, { 'ORD-001': order() }, [{ type: 'cancel', orderId: 'ORD-001' }], [p('cancellationStatus', 'failed'), p('reservationStatus', 'none'), p('paymentStatus', 'pending'), effect('shipping', 0), effect('refund', 0), effect('cancelCompletedEmail', 0)]),
  test('TC-04', '正常キャンセル', '引当2・決済済み。在庫を戻し、返金してから完了通知。', 8, { 'ORD-001': order(reserved) }, [{ type: 'cancel', orderId: 'ORD-001' }], [p('reservationStatus', 'released'), p('reservedQuantity', 0), p('paymentStatus', 'refunded'), p('cancellationStatus', 'succeeded'), p('orderStatus', 'cancelled'), effect('shipping', 0), effect('refund', 1), effect('cancelCompletedEmail', 1)]),
  test('TC-05', 'キャンセル二重受信', '同じ注文に2回要求。在庫戻し・返金・通知は1回。', 8, { 'ORD-001': order(reserved) }, [{ type: 'cancel', orderId: 'ORD-001' }, { type: 'cancel', orderId: 'ORD-001' }], [p('cancellationStatus', 'succeeded'), p('reservedQuantity', 0), p('paymentStatus', 'refunded'), effect('shipping', 0), effect('refund', 1), effect('cancelCompletedEmail', 1)]),
  test('TC-06', '共有在庫', '在庫5に3個の注文を2件。注文AからFIFOで処理。', 5, { 'ORD-A': order({ quantity: 3 }), 'ORD-B': order({ quantity: 3 }) }, [{ type: 'order', orderId: 'ORD-A' }, { type: 'order', orderId: 'ORD-B' }], [p('reservedQuantity', 3, 'ORD-A'), p('paymentStatus', 'paid', 'ORD-A'), p('reservedQuantity', 0, 'ORD-B'), p('orderStatus', 'stock_shortage', 'ORD-B'), p('paymentStatus', 'pending', 'ORD-B'), p('shippingStatus', 'none', 'ORD-B'), effect('shipping', 1), effect('refund', 0), effect('cancelCompletedEmail', 0)]),
  test('TC-07', '出荷とキャンセル', '先に出荷指示を確定し、次にキャンセル要求。取消不可・完了通知なし。', 8, { 'ORD-001': order(reserved) }, [{ type: 'ship', orderId: 'ORD-001' }, { type: 'cancel', orderId: 'ORD-001' }], [p('shippingStatus', 'requested'), p('cancellationStatus', 'failed'), p('reservationStatus', 'reserved'), p('paymentStatus', 'paid'), effect('shipping', 1), effect('refund', 0), effect('cancelCompletedEmail', 0)]),
];
for (const [index, stock] of [[0, 8], [3, 10], [4, 10], [5, 2]]) tests[index].assertions[0].equals = stock;
const perspectives = [
  '引当・決済・出荷の依存関係と処理順序が正しく、在庫と引当数量が整合するか。',
  '在庫不足の失敗分岐が働き、決済・出荷・完了通知が発生しないか。',
  '引当解除の失敗が後続へ正しく伝わり、キャンセル失敗時の誤通知を防げるか。',
  '引当解除と返金が両方完了してから、キャンセル確定と通知を行うか。',
  '同じ要求を再受信しても、在庫戻し・返金・通知を重複して実行しないか。',
  '複数注文が共有在庫を使っても過剰引当せず、引当できない注文を先へ進めないか。',
  '出荷確定点以降のキャンセルを拒否し、出荷とキャンセル成功が両立しないか。',
];
tests.forEach((test, i) => { test.perspective = perspectives[i]; });
