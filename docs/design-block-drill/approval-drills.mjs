import { approvalOperations } from './approval.mjs';
const copy = structuredClone;
const request = extra => ({ applicantId: 'E-01', amount: 1200, revision: 1, approvalStatus: 'pending', approvedRevision: null, accountingStatus: 'pending', verifiedRevision: null, paymentStatus: 'unpaid', paidRevision: null, ...extra });
const event = (type, extra = {}) => ({ type, requestId: 'R-01', actorId: type === 'approve' ? 'M-01' : 'A-01', decision: 'approve', receiptValid: true, ...extra });
const p = (field, equals) => ({ path: `requests.R-01.${field}`, equals });
const count = (type, equals, where) => ({ event: type, equals, where, label: `${{ transfer: '振込', paidEmail: '完了通知', decision: '権限違反の判断' }[type]}件数${where ? '（違反）' : ''}` });
function test(id, title, description, extra, events, expected, transfers, emails) {
  const perspectives = {
    'AP-01': '「上長判断」で承認を記録した後、「現版承認確認」と「経理確認」が現在の版を対象に行われ、振込・完了通知が各1回になるか確認します。',
    'AP-02': '「上長判断」は却下も記録します。「現版承認確認」では承認済みでないため失敗します。却下を差戻しに上書きせず、振込・完了通知を実行しないか確認します。',
    'AR-02': '「経理確認」が領収書不備で失敗したとき、「差戻し」で承認・経理確認を解除し、「振込」「完了通知」を実行しないか確認します。',
    'AR-03': '「上長判断」で差戻しを記録した後、未承認の申請を「振込」「完了通知」へ進めず終了するか確認します。',
    'AS-01': '「上長判断」の「承認者を確認」で上長権限を確認し、権限のない実行者による「判断を記録」を防げるか確認します。',
    'AS-02': '「上長判断」の「承認者を確認」で申請者本人による承認を拒否し、「判断を記録」や振込・完了通知を実行しないか確認します。',
  };
  return { id, title, description, perspective: perspectives[id] || '状態・版・権限と、振込・完了通知の実行回数・実行タイミングを確認します。', initialState: { requests: { 'R-01': request(extra) }, users: { 'E-01': { roles: ['employee', 'manager'] }, 'E-02': { roles: ['employee'] }, 'M-01': { roles: ['manager'] }, 'A-01': { roles: ['accountant'] } }, effects: [] }, events, assertions: [p('amount', 1200), ...Object.entries(expected).map(([key, value]) => p(key, value)), count('transfer', transfers), count('paidEmail', emails), count('transfer', 0, { valid: false }), count('paidEmail', 0, { valid: false }), count('decision', 0, { authorized: false })] };
}
const paid = { approvalStatus: 'approved', approvedRevision: 1, accountingStatus: 'verified', verifiedRevision: 1, paymentStatus: 'paid', paidRevision: 1 };
const returned = { approvalStatus: 'returned', approvedRevision: null, accountingStatus: 'pending', verifiedRevision: null, paymentStatus: 'unpaid' };
const approved = { approvalStatus: 'approved', approvedRevision: 1 };
const AP = [
  test('AP-01', '承認後の経理確認・振込', '未承認・未振込の申請に「上長判断（承認）」の入力が届きます。領収書は正常です。現在の版への承認・経理確認を記録し、振込・完了通知を各1回実行してください。', {}, [event('approve')], paid, 1, 1),
  test('AP-02', '上長却下時の処理', '「上長判断（却下）」の入力が届きます。却下を記録し、その状態を保って終了してください。振込・完了通知は0回です。', {}, [event('approve', { decision: 'reject' })], { ...returned, approvalStatus: 'rejected' }, 0, 0),
];
const AR = [
  { ...copy(AP[0]), id: 'AR-01' },
  test('AR-02', '領収書不備時の差戻し', '「上長判断（承認）」の入力が届きますが、領収書に不備があります。差戻しを記録して承認・経理確認を解除し、振込・完了通知は行わないでください。', {}, [event('approve', { receiptValid: false })], returned, 0, 0),
  test('AR-03', '上長差戻し時の処理', '「上長判断（差戻し）」の入力が届きます。差戻しを記録し、その状態を保って終了してください。振込・完了通知は0回です。', {}, [event('approve', { decision: 'return' })], returned, 0, 0),
  { ...copy(AP[1]), id: 'AR-04' },
];
const AT = [
  test('AT-01', '経理受付と振込', '版1が承認済み・未振込の申請に「経理受付」の入力が1回届きます。領収書は正常です。経理確認を記録し、振込・完了通知を各1回実行してください。', approved, [event('pay')], paid, 1, 1),
  test('AT-02', '経理受付の再実行', '同じ申請に「経理受付」の入力が2回届きます。2回目はすでに振込済みです。振込・完了通知の合計は各1回にしてください。', approved, [event('pay'), event('pay')], paid, 1, 1),
  test('AT-03', '再申請時の上長判断', '差戻し済みの版1に「再申請」→「経理受付」の順で入力が届きます。再申請で版2になりますが、版2への上長判断はまだありません。振込・完了通知は0回にしてください。', returned, [event('revise'), event('pay')], { ...returned, revision: 2, approvalStatus: 'pending' }, 0, 0),
  test('AT-04', '再申請後の承認・振込', '差戻し済みの版1に「再申請」→「上長判断（承認）」→「経理受付」の順で入力が届きます。版2への承認・経理確認を記録し、版2の振込・完了通知を各1回実行してください。', returned, [event('revise'), event('approve'), event('pay')], { ...paid, revision: 2, approvedRevision: 2, verifiedRevision: 2, paidRevision: 2 }, 1, 1),
  test('AT-05', '承認版の整合性', '連携データの不整合により、現在は版2なのに承認・経理確認は版1のままです。「経理受付」の入力が届いても、振込・完了通知は0回にしてください。', { ...approved, revision: 2, accountingStatus: 'verified', verifiedRevision: 1 }, [event('pay')], { paymentStatus: 'unpaid', paidRevision: null }, 0, 0),
].map((t, i) => ({ ...t, perspective: [
  '「現版承認確認」は現在の版への承認を確認し、「経理確認」は領収書を確認して現在の版に確認済みを記録します。「経理受付」だけでは、これらの確認は行いません。',
  '「振込済み確認」は振込済みなら成功、未振込なら失敗です。「振込」が二重実行を拒否しても、その後に「完了通知」を実行すると通知が重複します。',
  '「再申請」は版を1つ進め、承認・経理確認を解除します。「現版承認確認」では新しい版への承認が必要です。',
  '「上長判断」は入力された承認を記録します。「現版承認確認」と「経理確認」の対象が、再申請後の版2になっているか確認します。',
  '「現版承認確認」は承認済みという状態だけでなく、承認版と現在の版の一致も確認します。旧版の経理確認も現在の版には使えません。',
][i] }));
const AS = ['E-02', 'E-01'].map((actorId, i) => test(`AS-0${i + 1}`, i ? '申請者本人の承認権限' : '一般社員の承認権限', i ? '申請者本人E-01から「上長判断（承認）」の入力が届きます。上長権限はありますが、本人の申請は承認できません。未承認のまま終了し、振込・完了通知は行わないでください。' : '上長権限のない一般社員E-02から「上長判断（承認）」の入力が届きます。判断を記録せず未承認のまま終了し、振込・完了通知は行わないでください。', {}, [event('approve', { actorId })], { approvalStatus: 'pending', approvedRevision: null, paymentStatus: 'unpaid' }, 0, 0));
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
  return { id, title, difficulty, chapter: 2, allowMove: true, allowPlace: true, allowedOperations: operations, summary: id === 'approval-return' ? '上長が却下した申請にも、振込完了メールが届いています。また、領収書に不備がある申請が差戻しになっていません。承認されていない申請は処理を終了し、領収書に不備がある申請は差し戻すように修正してください。' : id === 'approval-retry' ? '「経理受付」に同じ申請が繰り返し届いたり、「再申請」で申請の版が変わったりします。入力は「経理受付」「再申請」「上長判断」から始まります。「経理受付」は履歴を記録するだけで、承認・経理確認は行いません。現在の版に必要な確認を行い、振込・完了通知が重複しないように修正してください。' : '承認・経理確認・振込の依存関係を修正し、全ケースを通してください。', rules: '本人承認は禁止。上長権限・現版承認・現版経理確認を経て振り込みます。差戻し・却下・旧版承認では振込禁止。再実行しても振込・通知は1回です。', initialGraph: graph, tests: copy(tests), availableBlocks: full.nodes.filter(n => candidates.includes(n.id)) };
}
export const approvalDrills = [
  make('approval-basics', '承認を通らない振込', '初級', AP, ['decision', 'receipt', 'transfer', 'notify'], ['approved'], g => { g.nodes.find(n => n.id === 'decision').success = 'receipt'; const r = g.nodes.find(n => n.id === 'receipt'); r.operations = ['audit']; r.failure = 'END'; }, ['checkApprover', 'recordDecision', 'verifyReceipt', 'transfer', 'sendPaid', 'audit', 'requireApproved']),
  make('approval-return', '差戻しなのに完了メール', '中級', AR.filter(t => t.id !== 'AR-03'), ['decision', 'approved', 'receipt', 'transfer', 'notify'], ['returned'], g => { g.nodes.find(n => n.id === 'decision').success = 'approved'; g.nodes.filter(n => ['approved', 'receipt'].includes(n.id)).forEach(n => n.failure = 'notify'); }, Object.keys(approvalOperations).filter(id => !['reviseRequest', 'paymentCompleted'].includes(id))),
  make('approval-retry', '再申請と二重振込', '上級', AT, ['decision', 'payEntry', 'transfer', 'notify', 'revise'], ['paid', 'approved', 'receipt'], g => { g.nodes.find(n => n.id === 'decision').success = 'END'; g.nodes.find(n => n.id === 'payEntry').success = 'transfer'; g.nodes.find(n => n.id === 'transfer').failure = 'notify'; }),
  make('approval-system', '権限・承認・振込の整合性', '総合', [...AP, ...AR, ...AT, ...AS], ['decision', 'payEntry', 'approved', 'receipt', 'transfer', 'notify', 'revise'], ['paid', 'returned'], g => { const d = g.nodes.find(n => n.id === 'decision'); d.operations = ['recordDecision']; d.success = 'approved'; g.nodes.find(n => n.id === 'payEntry').success = 'approved'; g.nodes.find(n => n.id === 'approved').failure = 'notify'; g.nodes.find(n => n.id === 'receipt').failure = 'END'; g.nodes.find(n => n.id === 'transfer').failure = 'notify'; }),
];
