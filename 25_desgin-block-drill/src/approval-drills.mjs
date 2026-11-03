import { approvalOperations } from './approval.mjs';
const copy = structuredClone;
const request = extra => ({ applicantId: 'E-01', amount: 1200, revision: 1, approvalStatus: 'pending', approvedRevision: null, accountingStatus: 'pending', verifiedRevision: null, paymentStatus: 'unpaid', paidRevision: null, ...extra });
const event = (type, extra = {}) => ({ type, requestId: 'R-01', actorId: type === 'approve' ? 'M-01' : 'A-01', decision: 'approve', receiptValid: true, ...extra });
const p = (field, equals) => ({ path: `requests.R-01.${field}`, equals });
const count = (type, equals, where) => ({ event: type, equals, where, label: `${{ transfer: '振込', paidEmail: '完了通知', decision: '権限違反の判断' }[type]}件数${where ? '（違反）' : ''}` });
function test(id, title, description, extra, events, expected, transfers, emails) {
  return { id, title, description, perspective: '状態・版・権限と、振込・完了通知の実行回数・実行タイミングを確認します。', initialState: { requests: { 'R-01': request(extra) }, users: { 'E-01': { roles: ['employee', 'manager'] }, 'E-02': { roles: ['employee'] }, 'M-01': { roles: ['manager'] }, 'A-01': { roles: ['accountant'] } }, effects: [] }, events, assertions: [p('amount', 1200), ...Object.entries(expected).map(([key, value]) => p(key, value)), count('transfer', transfers), count('paidEmail', emails), count('transfer', 0, { valid: false }), count('paidEmail', 0, { valid: false }), count('decision', 0, { authorized: false })] };
}
const paid = { approvalStatus: 'approved', approvedRevision: 1, accountingStatus: 'verified', verifiedRevision: 1, paymentStatus: 'paid', paidRevision: 1 };
const returned = { approvalStatus: 'returned', approvedRevision: null, accountingStatus: 'pending', verifiedRevision: null, paymentStatus: 'unpaid' };
const approved = { approvalStatus: 'approved', approvedRevision: 1 };
const AP = [
  test('AP-01', '承認された申請', '上長承認・領収書正常。現版の経理確認後だけ振り込む。', {}, [event('approve')], paid, 1, 1),
  test('AP-02', '却下された申請', '上長が却下。振込・完了通知を行わない。', {}, [event('approve', { decision: 'reject' })], { ...returned, approvalStatus: 'rejected' }, 0, 0),
];
const AR = [
  { ...copy(AP[0]), id: 'AR-01' },
  test('AR-02', '領収書不備', '承認後に領収書不備。差戻しにして承認・経理確認を解除する。', {}, [event('approve', { receiptValid: false })], returned, 0, 0),
  test('AR-03', '上長が差戻し', '上長判断で差戻しが記録される。承認されていないため処理を終了し、振込・完了通知を行わない。', {}, [event('approve', { decision: 'return' })], returned, 0, 0),
  { ...copy(AP[1]), id: 'AR-04' },
];
const AT = [
  test('AT-01', '経理処理', '現版承認済み・未振込の申請を経理確認して振り込む。', approved, [event('pay')], paid, 1, 1),
  test('AT-02', '経理の二重実行', '同じ申請にpayを2回。振込・通知は各1件。', approved, [event('pay'), event('pay')], paid, 1, 1),
  test('AT-03', '再承認前の再申請', '差戻し→再申請→経理処理。新しい版は未承認なので振込不可。', returned, [event('revise'), event('pay')], { ...returned, revision: 2, approvalStatus: 'pending' }, 0, 0),
  test('AT-04', '再申請後の再承認', '差戻し→再申請→上長承認→経理処理。版2で振込。', returned, [event('revise'), event('approve'), event('pay')], { ...paid, revision: 2, approvedRevision: 2, verifiedRevision: 2, paidRevision: 2 }, 1, 1),
  test('AT-05', '旧版の承認を拒否', '連携データの不整合：版2に版1の承認・経理確認が残っている。', { ...approved, revision: 2, accountingStatus: 'verified', verifiedRevision: 1 }, [event('pay')], { paymentStatus: 'unpaid', paidRevision: null }, 0, 0),
];
const AS = ['E-02', 'E-01'].map((actorId, i) => test(`AS-0${i + 1}`, i ? '本人承認を拒否' : '一般社員の承認を拒否', i ? '上長権限があっても自分の申請は承認不可。' : '上長権限のない実行者を判断記録前に拒否する。', {}, [event('approve', { actorId })], { approvalStatus: 'pending', approvedRevision: null, paymentStatus: 'unpaid' }, 0, 0));
const node = (id, label, x, y, operations, success = 'END', failure = 'END') => ({ id, label, x, y, operations, success, failure });
export function approvalSolution() {
  return { entries: { approve: 'decision', pay: 'payEntry', revise: 'revise' }, nodes: [
    node('decision', '上長判断', 40, 70, ['checkApprover', 'recordDecision'], 'paid'),
    node('paid', '振込済み確認', 330, 70, ['paymentCompleted'], 'END', 'approved'),
    node('approved', '現版承認確認', 620, 70, ['requireApproved'], 'receipt'),
    node('receipt', '経理確認', 620, 220, ['verifyReceipt'], 'transfer', 'returned'),
    node('transfer', '振込', 330, 220, ['transfer'], 'notify'),
    node('notify', '完了通知', 40, 220, ['sendPaid']),
    node('returned', '差戻し', 620, 400, ['returnRequest']),
    node('payEntry', '経理受付', 330, 400, ['audit'], 'paid'),
    node('revise', '再申請', 40, 400, ['reviseRequest']),
  ] };
}
function make(id, title, difficulty, tests, ids, candidates, mutate, operations = Object.keys(approvalOperations)) {
  const full = approvalSolution(), graph = copy(full); graph.nodes = graph.nodes.filter(n => ids.includes(n.id));
  graph.entries = Object.fromEntries(Object.entries(graph.entries).filter(([, id]) => ids.includes(id))); mutate(graph);
  return { id, title, difficulty, chapter: 2, allowMove: true, allowPlace: true, allowedOperations: operations, summary: id === 'approval-return' ? '上長が却下した申請にも、振込完了メールが届いています。また、領収書に不備がある申請が差戻しになっていません。承認されていない申請は処理を終了し、領収書に不備がある申請は差し戻すように修正してください。' : '承認・経理確認・振込の依存関係を修正し、全ケースを通してください。', rules: '本人承認は禁止。上長権限・現版承認・現版経理確認を経て振り込みます。差戻し・却下・旧版承認では振込禁止。再実行しても振込・通知は1回です。', initialGraph: graph, tests: copy(tests), availableBlocks: full.nodes.filter(n => candidates.includes(n.id)) };
}
export const approvalDrills = [
  make('approval-basics', '承認を通らない振込', '初級', AP, ['decision', 'receipt', 'transfer', 'notify'], ['approved'], g => { g.nodes.find(n => n.id === 'decision').success = 'receipt'; const r = g.nodes.find(n => n.id === 'receipt'); r.operations = ['audit']; r.failure = 'END'; }, ['checkApprover', 'recordDecision', 'verifyReceipt', 'transfer', 'sendPaid', 'audit', 'requireApproved']),
  make('approval-return', '差戻しなのに完了メール', '中級', AR.filter(t => t.id !== 'AR-03'), ['decision', 'approved', 'receipt', 'transfer', 'notify'], ['returned'], g => { g.nodes.find(n => n.id === 'decision').success = 'approved'; g.nodes.filter(n => ['approved', 'receipt'].includes(n.id)).forEach(n => n.failure = 'notify'); }, Object.keys(approvalOperations).filter(id => !['reviseRequest', 'paymentCompleted'].includes(id))),
  make('approval-retry', '再申請と二重振込', '上級', AT, ['decision', 'payEntry', 'transfer', 'notify', 'revise'], ['paid', 'approved', 'receipt'], g => { g.nodes.find(n => n.id === 'decision').success = 'END'; g.nodes.find(n => n.id === 'payEntry').success = 'transfer'; g.nodes.find(n => n.id === 'transfer').failure = 'notify'; }),
  make('approval-system', '権限・承認・振込の整合性', '総合', [...AP, ...AR, ...AT, ...AS], ['decision', 'payEntry', 'approved', 'receipt', 'transfer', 'notify', 'revise'], ['paid', 'returned'], g => { const d = g.nodes.find(n => n.id === 'decision'); d.operations = ['recordDecision']; d.success = 'approved'; g.nodes.find(n => n.id === 'payEntry').success = 'approved'; g.nodes.find(n => n.id === 'approved').failure = 'notify'; g.nodes.find(n => n.id === 'receipt').failure = 'END'; g.nodes.find(n => n.id === 'transfer').failure = 'notify'; }),
];
