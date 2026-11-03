export const operationChanges = {
  requireUnlocked: '状態は変えず、ユーザーが存在し未ロックか確認します。',
  checkPassword: 'この入力のパスワード確認を成功済みにします。',
  checkMfa: 'この入力の追加認証確認を成功済みにします。',
  recordLoginFailure: 'この入力で未加算なら連続失敗を1増やします。同じ入力では二重加算しません。',
  requireFailureLimit: '状態は変えず、連続失敗が3回以上か確認します。',
  lockUser: 'ユーザーをロック済みにします。',
  issueSession: '新しいセッションを発行して有効にし、発行を1件記録します。照合を飛ばすと不正発行として記録されます。',
  resetLoginFailures: 'この入力で正しく発行できた場合だけ失敗回数を0に戻します。',
  requireSession: '状態は変えず、セッションの本人一致・有効性・期限を確認します。',
  requireAdmin: '状態は変えず、実行者が管理者か確認します。',
  runAdminAction: '管理処理を1件記録します。セッション・権限が不足すると不正実行として記録されます。',
  revokeSession: '本人のセッションを無効にし、失効を1件記録します。失効済みなら変更しません。',
  recordSecurityAudit: 'この入力の種類・実行者・セッションの監査履歴を1件記録します。',
  reserve: '在庫を注文数量分減らし、引当数量を記録します。',
  pay: '決済状態を決済済みにします。',
  ship: '出荷状態を出荷指示済みにし、出荷指示を1件記録します。',
  shortage: '注文状態を在庫不足にします。',
  cancel: 'キャンセル要求中にします。成功済みなら変更せず終了します。',
  recordCancel: 'キャンセル要求中にします。成功済みでも上書きします。',
  release: '引当数量分の在庫を戻し、引当数量を0、引当状態を解除済みにします。',
  refund: '決済済みなら返金済みにし、返金を1件記録します。未決済・返金済みなら変更しません。',
  confirm: 'キャンセルを成功、注文をキャンセル済みにします。',
  fail: '成功済み以外のキャンセルを失敗にします。成功済みなら変更しません。',
  guard: '状態は変えず、キャンセル成功済みか確認します。',
  email: 'キャンセル完了通知を1件記録します。',
  waitPaid: '状態は変えず、決済済みになるまで待機します。',
  checkApprover: '状態は変えず、上長権限と本人申請でないことを確認します。',
  recordDecision: '入力された承認・却下・差戻しを記録します。承認なら現在の版を承認版に記録し、却下・差戻しなら承認版を解除します。経理確認・確認版は解除します。',
  requireApproved: '状態は変えず、承認済みで承認版と現在の版が一致するか確認します。',
  verifyReceipt: '経理確認を確認済みにし、現在の版を確認版に記録します。',
  transfer: '振込済みにし、現在の版を振込版に記録します。振込を1件記録します。',
  paymentCompleted: '状態は変えず、振込済みか確認します。',
  requireVerified: '状態は変えず、経理確認済みで確認版と現在の版が一致するか確認します。',
  sendPaid: '振込完了通知を1件記録します。',
  returnRequest: '差戻しにし、承認版・経理確認・確認版を解除します。',
  reviseRequest: '版を1つ進めて未承認にし、承認版・経理確認・確認版を解除します。',
  audit: '監査履歴を1件記録します。申請の状態は変更しません。',
};
export function inputLabel(event, graph) {
  const node = graph.nodes.find(node => node.id === graph.entries[event.type]);
  const decision = { approve: '承認', reject: '却下', return: '差戻し' }[event.decision];
  return `${node?.label || event.type}${event.type === 'approve' && decision ? `（${decision}）` : ''}`;
}
export function resultPhase(run) {
  return ['completed', 'stopped'].includes(run.status) ? 'final' : run.status === 'waiting' ? 'waiting' : run.step > 0 ? 'running' : 'ready';
}
const fields = { amount: '金額', revision: '版', approvalStatus: '承認状態', approvedRevision: '承認版', accountingStatus: '経理確認', verifiedRevision: '確認版', paymentStatus: '決済状態', paidRevision: '振込版', reservationStatus: '引当状態', reservedQuantity: '引当数量', orderStatus: '注文状態', cancellationStatus: 'キャンセル状態', shippingStatus: '出荷状態' };
const values = { pending: '未処理', approved: '承認済み', rejected: '却下', returned: '差戻し', verified: '確認済み', unpaid: '未振込', paid: '支払済み', refunded: '返金済み', none: 'なし', reserved: '引当済み', released: '解除済み', accepted: '受付済み', cancelled: 'キャンセル済み', stock_shortage: '在庫不足', requested: '要求済み', succeeded: '成功', failed: '失敗' };
const effectNames = { sessionIssued: 'セッション発行', adminAction: '管理処理', sessionRevoked: 'セッション失効', securityAudit: '監査履歴', transfer: '振込', paidEmail: '振込完了通知', audit: '監査履歴', decision: '上長判断履歴', shipping: '出荷指示', refund: '返金', cancelCompletedEmail: 'キャンセル完了通知' };
export function effectLines(log) {
  return log.diff.flatMap(change => {
    if (change.path === 'effects') {
      const before = Array.isArray(change.before) ? change.before.length : 0;
      return (change.after || []).slice(before).map(effect => `${effectNames[effect.type] || effect.type} +1`);
    }
    const parts = change.path.split('.'), field = parts.at(-1);
    const securityFields = { failedCount: '失敗回数', locked: 'ロック', role: '権限', userId: '利用者', active: 'セッション有効', expiresAt: '有効期限', authenticated: '本人確認', passwordChecked: 'パスワード確認', mfaChecked: '追加認証確認', failureRecorded: '失敗加算済み', sessionIssued: 'セッション発行済み' };
    const isRequest = parts[0] === 'requests';
    const label = parts[0] === 'inventory' ? '在庫' : isRequest && field === 'paymentStatus' ? '振込状態' : securityFields[field] || fields[field] || field;
    const display = value => {
      if (value == null) return 'なし';
      if (field === 'paymentStatus' && value === 'paid') return isRequest ? '振込済み' : '決済済み';
      if (value === 'pending') return field === 'approvalStatus' ? '未承認' : field === 'accountingStatus' ? '未確認' : field === 'paymentStatus' ? '未決済' : '未処理';
      return values[value] || String(value);
    };
    const delta = typeof change.before === 'number' && typeof change.after === 'number' ? ` (${change.after - change.before >= 0 ? '+' : ''}${change.after - change.before})` : '';
    return [`${label} ${display(change.before)} → ${display(change.after)}${delta}`];
  });
}
