export const operations = {
  reserve: ['在庫引当', '在庫が注文数量以上なら減算し、引当を記録'],
  pay: ['決済', '有効な引当が必要'],
  ship: ['出荷指示', '有効な注文・引当・決済が必要。ここが出荷確定点'],
  shortage: ['在庫不足を記録', '注文を在庫不足状態にする'],
  cancel: ['キャンセル要求', '出荷確定前のみ受付。処理済みなら no_op で終了'],
  recordCancel: ['キャンセル要求を記録', '出荷確定前のみ受付。処理済みか確認せず要求中に更新する。二重要求の除外は行わない'],
  release: ['引当解除', '当該注文の引当記録が必要'],
  refund: ['返金', '決済済みのみ返金。未決済・返金済みは no_op'],
  confirm: ['キャンセル確定', '引当解除済み・未決済または返金済み・未出荷が必要'],
  fail: ['キャンセル失敗を記録', '要求中のキャンセルを失敗にする'],
  guard: ['キャンセル成功を確認', '成功済みでなければ failure'],
  email: ['完了メール送信', '条件確認なしで送信する。必要な確認は前のカードで行う'],
  waitPaid: ['決済を待つ', '決済済みになるまで wait'],
};
export const clone = value => structuredClone(value);
export function execute(state, orderId, operation) {
  const next = clone(state), o = next.orders[orderId];
  const result = (status, reason = '') => ({ status, reason, state: status === 'failure' || status === 'wait' ? state : next });
  if (!o) return result('failure', '注文がありません');
  switch (operation) {
    case 'reserve':
      if (o.orderStatus !== 'accepted' || o.reservationStatus !== 'none') return result('failure', '引当できる注文状態ではありません');
      if (next.inventory[o.itemId] < o.quantity) return result('failure', '在庫不足');
      next.inventory[o.itemId] -= o.quantity; o.reservationStatus = 'reserved'; o.reservedQuantity = o.quantity; break;
    case 'pay':
      if (o.reservationStatus !== 'reserved' || o.orderStatus !== 'accepted') return result('failure', '有効な引当がありません');
      if (o.paymentStatus === 'paid') return result('no_op', '決済済み');
      if (o.paymentStatus !== 'pending') return result('failure', '決済できない状態');
      if (o.paymentSucceeds === false) return result('failure', '決済拒否');
      o.paymentStatus = 'paid'; break;
    case 'ship':
      if (o.orderStatus !== 'accepted' || o.reservationStatus !== 'reserved' || o.paymentStatus !== 'paid' || o.cancellationStatus === 'succeeded') return result('failure', '出荷条件が不足');
      if (o.shippingStatus !== 'none') return result('no_op', '出荷指示済み');
      o.shippingStatus = 'requested'; next.effects.push({ type: 'shipping', orderId }); break;
    case 'shortage': o.orderStatus = 'stock_shortage'; break;
    case 'cancel':
    case 'recordCancel':
      if (operation === 'cancel' && o.cancellationStatus === 'succeeded') return result('no_op', 'キャンセル済み');
      if (o.shippingStatus !== 'none') return result('failure', '出荷確定済み');
      o.cancellationStatus = 'requested'; break;
    case 'release':
      if (o.shippingStatus !== 'none' || o.reservationStatus !== 'reserved') return result('failure', '解除できる引当記録がありません');
      next.inventory[o.itemId] += o.reservedQuantity; o.reservedQuantity = 0; o.reservationStatus = 'released'; break;
    case 'refund':
      if (['pending', 'refunded'].includes(o.paymentStatus)) return result('no_op', '返金不要');
      if (o.paymentStatus !== 'paid' || o.shippingStatus !== 'none') return result('failure', '返金できません');
      o.paymentStatus = 'refunded'; next.effects.push({ type: 'refund', orderId }); break;
    case 'confirm':
      if (o.reservationStatus !== 'released' || !['pending', 'refunded'].includes(o.paymentStatus) || o.shippingStatus !== 'none' || o.cancellationStatus !== 'requested') return result('failure', 'キャンセル後処理が未完了');
      o.cancellationStatus = 'succeeded'; o.orderStatus = 'cancelled'; break;
    case 'fail': if (o.cancellationStatus !== 'succeeded') o.cancellationStatus = 'failed'; break;
    case 'guard': if (o.cancellationStatus !== 'succeeded') return result('failure', 'キャンセル成功が未確定'); break;
    case 'email': next.effects.push({ type: 'cancelCompletedEmail', orderId }); break;
    case 'waitPaid': if (o.paymentStatus !== 'paid') return result('wait', '決済待ち'); break;
    default: return result('failure', '未定義の操作');
  }
  return result('success');
}
export function differences(before, after, prefix = '') {
  return Object.keys(after).flatMap(key => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (after[key] && typeof after[key] === 'object' && !Array.isArray(after[key])) return differences(before?.[key] || {}, after[key], path);
    return JSON.stringify(before?.[key]) === JSON.stringify(after[key]) ? [] : [{ path, before: before?.[key], after: after[key] }];
  });
}
export function createRun(graph, test) {
  return { graph: clone(graph), test, state: clone(test.initialState), tokens: test.events.map((e, i) => ({ id: `荷物${i + 1}`, orderId: e.orderId, node: graph.entries[e.type], index: 0, status: 'queued' })), logs: [], step: 0, status: 'ready' };
}
export function step(run) {
  if (['completed', 'stopped'].includes(run.status)) return null;
  if (run.step >= 200) {
    run.tokens.filter(t => !['completed', 'stopped'].includes(t.status)).forEach(t => { t.status = 'stopped'; t.reason = '最大200ステップ到達'; });
    run.status = 'stopped'; run.logs.push({ step: run.step, operation: '上限停止', status: 'failure', reason: '最大200ステップ到達', diff: [] }); return null;
  }
  // 入力イベントをFIFOで完了まで処理。先頭の待機は後続も止める。
  const token = run.tokens.find(t => !['completed', 'stopped'].includes(t.status));
  if (!token) { run.status = 'completed'; return null; }
  const node = run.graph.nodes.find(n => n.id === token.node);
  const operation = node?.operations[token.index];
  const before = run.state;
  const outcome = operation ? execute(before, token.orderId, operation) : { state: before, status: 'failure', reason: 'ブロックまたは操作が未設定' };
  run.state = outcome.state; run.step++;
  const from = token.node;
  if (outcome.status === 'wait') { token.status = 'waiting'; run.status = 'waiting'; }
  else {
    token.status = 'active'; run.status = 'running';
    // 重複キャンセルの no_op はイベント全体を正常終了する。
    if (operation === 'cancel' && outcome.status === 'no_op') token.status = 'completed';
    else if (outcome.status !== 'failure' && token.index + 1 < node.operations.length) token.index++;
    else {
      const target = node?.[outcome.status === 'failure' ? 'failure' : 'success'];
      if (target === 'END') token.status = 'completed';
      else if (!target || !run.graph.nodes.some(n => n.id === target)) { token.status = 'stopped'; token.reason = '遷移先が未接続'; }
      else { token.node = target; token.index = 0; }
    }
    if (run.tokens.every(t => ['completed', 'stopped'].includes(t.status))) run.status = run.tokens.some(t => t.status === 'stopped') ? 'stopped' : 'completed';
  }
  const log = { step: run.step, tokenId: token.id, orderId: token.orderId, node: from, operation: operations[operation]?.[0] || '未設定', status: outcome.status, reason: outcome.reason || token.reason || '', diff: differences(before, run.state), to: token.status === 'completed' ? 'END' : token.node };
  token.last = log; run.logs.push(log); return log;
}
export function finish(run) { while (!['completed', 'stopped', 'waiting'].includes(run.status)) step(run); return judge(run); }
export function judge(run) {
  const checks = run.test.assertions.map(a => {
    const actual = a.event ? run.state.effects.filter(e => e.type === a.event && (!a.orderId || a.orderId === e.orderId)).length : a.path.split('.').reduce((v, k) => v?.[k], run.state);
    return { label: a.label || a.path || a.event, expected: a.equals, actual, pass: actual === a.equals, events: run.logs.filter(l => !a.orderId || l.orderId === a.orderId).map(l => l.step) };
  });
  checks.push({ label: '全荷物が正常終了', expected: true, actual: run.tokens.every(t => t.status === 'completed'), pass: run.tokens.every(t => t.status === 'completed') });
  return { pass: checks.every(c => c.pass), checks };
}
