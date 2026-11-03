import { securityOperations } from './security.mjs';
const clone = structuredClone;
const user = (role = 'member', extra = {}) => ({ role, failedCount: 0, locked: false, ...extra });
const login = (extra = {}) => ({ type: 'login', userId: 'U-01', passwordMatches: true, mfaMatches: true, now: 10, expiresAt: 100, ...extra });
const action = (extra = {}) => ({ type: 'adminAction', actorId: 'A-01', sessionId: 'S-A', now: 10, ...extra });
const logout = (extra = {}) => ({ type: 'logout', actorId: 'A-01', sessionId: 'S-A', now: 10, ...extra });
const session = (userId = 'A-01', extra = {}) => ({ userId, active: true, expiresAt: 100, authenticated: true, ...extra });
const fieldNames = { failedCount: '失敗回数', locked: 'ロック', role: '権限', userId: '利用者', active: '有効状態', expiresAt: '有効期限', authenticated: '本人確認', passwordChecked: 'パスワード確認', mfaChecked: '追加認証確認', failureRecorded: '失敗加算', sessionIssued: 'セッション発行' };
const p = (path, equals, inputIndex) => ({ path, equals, ...(inputIndex ? { inputIndex } : {}), label: `${inputIndex ? `入力${inputIndex}終了時 · ` : ''}${path.split('.')[1]} · ${fieldNames[path.split('.').at(-1)] || path}` });
const total = (event, equals, invalid = false) => ({ event, equals, ...(invalid ? { where: { valid: false } } : {}), label: `${invalid ? '不正な' : ''}${{ sessionIssued: 'セッション発行', adminAction: '管理処理', sessionRevoked: 'セッション失効' }[event]}の合計` });
function makeTest(id, title, description, events, assertions, { users = {}, sessions = {}, issued = 0, actions = 0, revoked = 0, perspective = '入力ごとの確認結果を使い、必要な確認が済んだ時だけ処理するか確認します。' } = {}) {
  events = events.map((event, i) => ({ sessionId: `S-${String(i + 1).padStart(2, '0')}`, ...event, inputId: `I-${i + 1}` }));
  return {
    id, title, description, perspective, events,
    initialState: { security: true, users: { 'U-01': user(), 'U-02': user(), 'A-01': user('admin'), ...users }, sessions, attempts: Object.fromEntries(events.map(e => [e.inputId, { passwordChecked: false, mfaChecked: false, failureRecorded: false, sessionIssued: false }])), effects: [] },
    assertions: [...assertions, total('sessionIssued', issued), total('adminAction', actions), total('sessionRevoked', revoked), total('sessionIssued', 0, true), total('adminAction', 0, true)],
  };
}
const SL = [
  makeTest('SL-01', 'ログイン時の本人確認', 'パスワード・追加認証とも一致する入力が1回届きます。U-01の有効なセッションを1件発行してください。', [login()], [p('sessions.S-01.userId', 'U-01'), p('sessions.S-01.active', true), p('sessions.S-01.expiresAt', 100)], { issued: 1, perspective: '「パスワード確認」「追加認証確認」の両方を通過してから「セッション発行」を実行するか確認します。' }),
  makeTest('SL-02', 'パスワードの照合', 'パスワード不一致・追加認証一致です。セッションを発行せず終了してください。', [login({ passwordMatches: false })], [], { perspective: '「パスワード確認」が失敗した入力を「セッション発行」へ進めないか確認します。' }),
  makeTest('SL-03', '追加認証の照合', 'パスワード一致・追加認証不一致です。セッションを発行せず終了してください。', [login({ mfaMatches: false })], [], { perspective: 'パスワードが合っていても「追加認証確認」が必要です。確認を飛ばした発行は不正な発行として記録されます。' }),
];
const userChecks = (count, locked, id = 'U-01', inputIndex) => [p(`users.${id}.failedCount`, count, inputIndex), p(`users.${id}.locked`, locked, inputIndex)];
const SK = [
  makeTest('SK-01', 'ログイン失敗の記録', '失敗0回から、パスワード不一致の入力が1回届きます。失敗1回・未ロックで終了してください。', [login({ passwordMatches: false })], userChecks(1, false), { perspective: '照合失敗を「失敗回数記録」へつなぎ、発行せず終了するか確認します。' }),
  makeTest('SK-02', '失敗回数とロック', '失敗2回から、追加認証不一致の入力が届きます。この入力中に失敗3回・ロック済みにしてください。', [login({ mfaMatches: false })], userChecks(3, true), { users: { 'U-01': user('member', { failedCount: 2 }) }, perspective: '「追加認証確認」の失敗も1回加算し、「ロック判定」で3回目の入力中にロックするか確認します。' }),
  makeTest('SK-03', 'ロック後のログイン', '失敗3回・ロック済みです。両照合が一致しても発行せず、回数とロックを維持してください。', [login()], userChecks(3, true), { users: { 'U-01': user('member', { failedCount: 3, locked: true }) }, perspective: '「ロック状態確認」で終了し、照合・回数加算・セッション発行へ進めないか確認します。' }),
  makeTest('SK-04', 'ログイン成功時の回数', '失敗2回・未ロックから両照合が一致します。有効なセッションを1件発行し、失敗回数を0へ戻してください。', [login()], [...userChecks(0, false), p('sessions.S-01.active', true)], { users: { 'U-01': user('member', { failedCount: 2 }) }, issued: 1, perspective: '「セッション発行」に成功した後だけ「成功後リセット」で連続失敗を0にするか確認します。' }),
  makeTest('SK-05', '複数入力の失敗回数', 'パスワード不一致→追加認証不一致→両方不一致→両方一致の4入力です。3入力目でロックし、4入力目は発行も加算もしないでください。', [login({ passwordMatches: false }), login({ mfaMatches: false }), login({ passwordMatches: false, mfaMatches: false }), login()], [...userChecks(3, true), ...[1, 2, 3, 4].flatMap((i) => userChecks(Math.min(i, 3), i >= 3, 'U-01', i))], { perspective: '失敗は1入力につき1回。「失敗回数記録」「ロック判定」「ロック状態確認」を通じて、入力ごとの回数とロック時点を確認します。' }),
];
const SS = [
  makeTest('SS-01', '管理機能の利用権限', '管理者A-01が本人の有効なS-Aで管理受付に入力します。管理処理を1回実行し、セッションは維持してください。', [action()], [p('sessions.S-A.active', true)], { sessions: { 'S-A': session() }, actions: 1, perspective: '「セッション確認」と「管理権限確認」の両方を経て「管理処理」を行うか確認します。' }),
  makeTest('SS-02', '一般会員の利用権限', '一般会員U-01が本人の有効なS-Uで管理受付に入力します。管理処理は実行せず、セッションは維持してください。', [action({ actorId: 'U-01', sessionId: 'S-U' })], [p('sessions.S-U.active', true)], { sessions: { 'S-U': session('U-01') }, perspective: '本人のセッションがあっても「管理権限確認」に失敗します。セッションを失効させて帳尻を合わせないかも確認します。' }),
  makeTest('SS-03', 'ログアウト後の利用', 'A-01がS-Aをログアウトした後、同じS-Aで管理受付に入力します。失効1回・管理処理0回にしてください。', [logout(), action()], [p('sessions.S-A.active', false), p('sessions.S-A.active', false, 1)], { sessions: { 'S-A': session() }, revoked: 1, perspective: '「セッション失効」で状態を変え、後の入力では「セッション確認」で拒否するか確認します。' }),
  makeTest('SS-04', 'セッションの有効期限', 'S-Aの期限は10、現在時刻も10です。管理者本人でも期限切れのため管理処理を実行しないでください。', [action()], [p('sessions.S-A.active', true)], { sessions: { 'S-A': session('A-01', { expiresAt: 10 }) }, perspective: '「セッション確認」では現在時刻が期限未満である必要があります。拒否するだけでactiveの変更は不要です。' }),
  makeTest('SS-05', 'セッションと本人の一致', '管理者A-01がU-02のセッションS-U2で管理受付に入力します。管理処理は実行せず、所有者・有効状態は維持してください。', [action({ sessionId: 'S-U2' })], [p('sessions.S-U2.userId', 'U-02'), p('sessions.S-U2.active', true)], { sessions: { 'S-U2': session('U-02') }, perspective: '管理者でも他人のセッションは使えません。「セッション確認」で本人との一致を確認します。' }),
];
const SX = [
  makeTest('SX-01', '別ユーザーの認証結果', 'U-01が正常ログイン→A-01が追加認証不一致→A-01がその未発行IDで管理受付に入力します。発行はU-01の1件だけ、A-01の失敗は1回、管理処理は0回です。', [login({ sessionId: 'S-U' }), login({ userId: 'A-01', mfaMatches: false, sessionId: 'S-A' }), action()], [...userChecks(0, false), ...userChecks(1, false, 'A-01'), p('sessions.S-U.active', true), ...userChecks(1, false, 'A-01', 2)], { issued: 1, perspective: '照合成功は入力ごとの記録です。別ユーザーや前の入力の確認結果を「セッション発行」に流用しないか確認します。' }),
  makeTest('SX-02', '再ログイン時のセッション', '失敗2回のA-01が正常ログイン→ログアウト→同じIDへ再発行を要求→管理受付に入力します。発行合計1・失効1・管理処理0、失敗0回・未ロックを維持してください。', [login({ userId: 'A-01', sessionId: 'S-OLD' }), logout({ sessionId: 'S-OLD' }), login({ userId: 'A-01', sessionId: 'S-OLD' }), action({ sessionId: 'S-OLD' })], [...userChecks(0, false, 'A-01'), p('sessions.S-OLD.active', false), p('sessions.S-OLD.active', false, 3), ...userChecks(0, false, 'A-01', 3)], { users: { 'A-01': user('admin', { failedCount: 2 }) }, issued: 1, revoked: 1, perspective: '失効済みでも同一セッションIDは再利用しません。発行失敗を照合失敗と混同して回数を増やさないか確認します。' }),
];
const node = (id, label, x, y, operations, success = 'END', failure = 'END') => ({ id, label, x, y, operations, success, failure });
export function securitySolution() {
  return { entries: { login: 'login', adminAction: 'admin', logout: 'logout' }, nodes: [
    node('login', 'ログイン受付', 40, 70, ['recordSecurityAudit'], 'unlocked'),
    node('unlocked', 'ロック状態確認', 280, 70, ['requireUnlocked'], 'password'),
    node('password', 'パスワード確認', 520, 70, ['checkPassword'], 'mfa', 'failure'),
    node('mfa', '追加認証確認', 760, 70, ['checkMfa'], 'issue', 'failure'),
    node('failure', '失敗回数記録', 40, 190, ['recordLoginFailure'], 'limit'),
    node('limit', 'ロック判定', 280, 190, ['requireFailureLimit', 'lockUser']),
    node('resetFailures', '成功後リセット', 520, 190, ['resetLoginFailures']),
    node('issue', 'セッション発行', 760, 190, ['issueSession'], 'resetFailures'),
    node('admin', '管理受付', 40, 310, ['recordSecurityAudit'], 'session'),
    node('session', 'セッション確認', 280, 310, ['requireSession'], 'role'),
    node('role', '管理権限確認', 520, 310, ['requireAdmin'], 'action'),
    node('action', '管理処理', 760, 310, ['runAdminAction']),
    node('logout', 'ログアウト受付', 40, 430, ['recordSecurityAudit'], 'revoke'),
    node('revoke', 'セッション失効', 280, 430, ['revokeSession']),
    node('audit', '監査記録', 520, 430, ['recordSecurityAudit']),
    node('loginCheck', 'ログイン照合', 760, 430, ['checkPassword', 'checkMfa']),
  ] };
}
function make(id, title, difficulty, summary, tests, ids, candidates, mutate, allowedOperations) {
  const full = securitySolution(), graph = clone(full);
  graph.nodes = graph.nodes.filter(n => ids.includes(n.id));
  graph.entries = Object.fromEntries(Object.entries(graph.entries).filter(([, id]) => ids.includes(id)));
  mutate(graph);
  return { id, title, difficulty, summary, chapter: 3, allowMove: true, allowPlace: true, initialGraph: graph, tests: clone(tests), availableBlocks: full.nodes.filter(n => candidates.includes(n.id)), allowedOperations };
}
const all = Object.keys(securityOperations), loginOps = all.filter(id => !['requireSession', 'requireAdmin', 'runAdminAction', 'revokeSession'].includes(id));
export const securityDrills = [
  make('security-login', '追加認証を通らないログイン', '初級', 'パスワードが合っていれば、追加認証が不一致でもログインできてしまいます。両方の照合を確認してからセッションを発行するように修正してください。この問題では失敗回数・ロックは扱いません。', SL, ['login', 'password', 'issue'], ['mfa'], g => { g.nodes.find(n => n.id === 'login').success = 'password'; g.nodes.find(n => n.id === 'password').success = 'issue'; g.nodes.find(n => n.id === 'password').failure = 'END'; g.nodes.find(n => n.id === 'issue').success = 'END'; }, ['recordSecurityAudit', 'checkPassword', 'checkMfa', 'issueSession']),
  make('security-lock', '止まらないログイン試行', '中級', '照合に失敗しても回数が記録されません。連続失敗3回でロックし、正しくログインできたときだけ失敗回数を0に戻してください。ロック済みの入力は加算も発行もしません。', SK, ['login', 'password', 'mfa', 'issue', 'failure', 'limit'], ['unlocked', 'resetFailures'], g => { g.nodes.find(n => n.id === 'login').success = 'password'; for (const id of ['password', 'mfa']) g.nodes.find(n => n.id === id).failure = 'END'; g.nodes.find(n => n.id === 'issue').success = 'END'; g.nodes.find(n => n.id === 'failure').success = 'END'; }, loginOps),
  make('security-session', 'ログインできたら管理者？', '上級', '管理受付に入力が届くと、そのまま管理処理が実行されてしまいます。有効な本人のセッションと管理権限を別々に確認し、ログアウトしたセッションも使えないようにしてください。', SS, ['admin', 'action', 'logout'], ['session', 'role', 'revoke', 'loginCheck'], g => { g.nodes.find(n => n.id === 'admin').success = 'action'; g.nodes.find(n => n.id === 'logout').success = 'END'; }, ['recordSecurityAudit', 'runAdminAction', 'requireSession', 'requireAdmin', 'revokeSession', 'checkPassword', 'checkMfa']),
  make('security-system', '認証・権限の総合点検', '総合', 'ログイン・失敗回数・管理機能・ログアウトの接続を点検してください。別ユーザー・別入力の認証結果を流用せず、セッションの失効とIDの取り違えにも対応してください。', [...SL, ...SK, ...SS, ...SX], ['login', 'password', 'mfa', 'issue', 'failure', 'limit', 'admin', 'role', 'action', 'logout'], ['unlocked', 'resetFailures', 'session', 'revoke', 'audit'], g => { g.nodes.find(n => n.id === 'login').success = 'password'; g.nodes.find(n => n.id === 'password').success = 'issue'; g.nodes.find(n => n.id === 'issue').success = 'END'; g.nodes.find(n => n.id === 'admin').success = 'role'; g.nodes.find(n => n.id === 'logout').success = 'END'; }, all),
];
