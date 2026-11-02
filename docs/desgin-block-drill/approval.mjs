export const approvalOperations = {
  recordDecision: ['判断を記録', '未振込のみ。入力された承認・却下・差戻しを記録。権限確認は別操作'],
  checkApprover: ['承認者を確認', '上長権限があり、申請者本人ではないこと'],
  requireApproved: ['現版の承認を確認', '承認済みで、承認された版が現在の版と一致すること'],
  verifyReceipt: ['経理確認', '現版が承認済みで、領収書が正常であること'],
  transfer: ['振込を実行', '未振込のみ。承認・経理の確認は前の操作で行う'],
  paymentCompleted: ['振込済みを確認', '振込済みなら成功、未振込なら失敗'],
  requireVerified: ['現版の経理確認を検査', '現版の経理確認が完了していること'],
  sendPaid: ['振込完了通知', '条件確認なしで通知。必要な確認は前の操作で行う'],
  returnRequest: ['差戻しを記録', '未振込のみ。承認・経理確認を解除する'],
  reviseRequest: ['再申請', '差戻し済み・未振込のみ。版を更新し、承認・経理確認を解除'],
  audit: ['監査を記録', '申請・実行者・入力された判断を履歴に残す'],
};
export function executeApproval(state, requestId, operation, event = {}) {
  const next = structuredClone(state), r = next.requests[requestId];
  const result = (status, reason = '') => ({ status, reason, state: status === 'failure' ? state : next });
  if (!r) return result('failure', '申請がありません');
  const approved = () => r.approvalStatus === 'approved' && r.approvedRevision === r.revision;
  const verified = () => r.accountingStatus === 'verified' && r.verifiedRevision === r.revision;
  const clear = () => { r.approvedRevision = null; r.accountingStatus = 'pending'; r.verifiedRevision = null; };
  switch (operation) {
    case 'checkApprover':
      if (!next.users[event.actorId]?.roles.includes('manager') || event.actorId === r.applicantId) return result('failure', '承認権限なし・本人承認'); break;
    case 'recordDecision':
      if (r.paymentStatus === 'paid' || !['approve', 'reject', 'return'].includes(event.decision)) return result('failure', '判断を記録できません');
      clear(); r.approvalStatus = { approve: 'approved', reject: 'rejected', return: 'returned' }[event.decision];
      if (event.decision === 'approve') r.approvedRevision = r.revision;
      next.effects.push({ type: 'decision', orderId: requestId, revision: r.revision, actorId: event.actorId, authorized: next.users[event.actorId]?.roles.includes('manager') === true && event.actorId !== r.applicantId }); break;
    case 'requireApproved': if (!approved()) return result('failure', '現版の承認がありません'); break;
    case 'requireVerified': if (!verified()) return result('failure', '現版の経理確認がありません'); break;
    case 'verifyReceipt':
      if (!approved() || event.receiptValid !== true) return result('failure', '承認なし・領収書不備');
      r.accountingStatus = 'verified'; r.verifiedRevision = r.revision; break;
    case 'transfer':
      if (r.paymentStatus === 'paid') return result('failure', '振込済み');
      next.effects.push({ type: 'transfer', orderId: requestId, amount: r.amount, revision: r.revision, valid: approved() && verified() });
      r.paymentStatus = 'paid'; r.paidRevision = r.revision; break;
    case 'paymentCompleted': if (r.paymentStatus !== 'paid') return result('failure', '未振込'); break;
    case 'sendPaid': next.effects.push({ type: 'paidEmail', orderId: requestId, revision: r.revision, valid: r.paymentStatus === 'paid' }); break;
    case 'returnRequest':
      if (r.paymentStatus === 'paid') return result('failure', '振込済み');
      clear(); r.approvalStatus = 'returned'; break;
    case 'reviseRequest':
      if (r.paymentStatus === 'paid' || r.approvalStatus !== 'returned') return result('failure', '再申請できません');
      clear(); r.revision++; r.approvalStatus = 'pending'; break;
    case 'audit': next.effects.push({ type: 'audit', orderId: requestId, revision: r.revision, actorId: event.actorId, decision: event.decision || null }); break;
    default: return result('failure', 'この案件では使えない操作');
  }
  return result('success');
}
