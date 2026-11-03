export const securityOperations = {
  requireUnlocked: ['ロック状態を確認', 'ユーザーが存在し、ロックされていないこと'],
  checkPassword: ['パスワードを確認', 'ログイン入力・未ロック・パスワード一致。この入力の照合成功を記録'],
  checkMfa: ['追加認証を確認', 'ログイン入力・未ロック・追加認証一致。この入力の照合成功を記録'],
  recordLoginFailure: ['失敗回数を記録', '未ロックで照合不一致の入力だけ、1入力につき1回加算（最大3）'],
  requireFailureLimit: ['失敗回数を確認', '連続失敗回数が3以上なら成功、3未満なら失敗'],
  lockUser: ['アカウントをロック', '連続失敗3回以上のユーザーをロック'],
  issueSession: ['セッションを発行', '未ロック・未使用ID・未来の有効期限。照合確認は前の処理で行う'],
  resetLoginFailures: ['失敗回数をリセット', 'この入力で正しくセッションを発行したときだけ失敗回数を0にする'],
  requireSession: ['セッションを確認', '本人の有効なセッションで、未失効かつ期限内であること'],
  requireAdmin: ['管理権限を確認', '実行者に管理権限があること。セッション確認は別処理'],
  runAdminAction: ['管理処理を実行', '管理入力を実行して1件記録。セッション・管理権限は前の処理で確認'],
  revokeSession: ['セッションを失効', '本人のセッションを失効。失効済みなら変更なし'],
  recordSecurityAudit: ['監査を記録', '入力・実行者・種類を履歴に記録。認証状態は変えない'],
};
export function executeSecurity(state, operation, event = {}) {
  const next = structuredClone(state), userId = event.userId || event.actorId;
  const user = next.users[userId], attempt = next.attempts[event.inputId], session = next.sessions[event.sessionId];
  const fail = reason => ({ state, status: 'failure', reason });
  const ok = (status = 'success', reason = '') => ({ state: next, status, reason });
  const login = event.type === 'login' && user && attempt;
  const unlocked = login && !user.locked;
  const sessionValid = !!(session && session.active && session.authenticated !== false && session.userId === event.actorId && Number.isFinite(event.now) && event.now < session.expiresAt);
  const record = (type, extra = {}) => next.effects.push({ type, inputId: event.inputId, orderId: userId, sessionId: event.sessionId, ...extra });
  switch (operation) {
    case 'requireUnlocked': if (!user || user.locked) return fail('不明ユーザー・ロック済み'); break;
    case 'checkPassword':
      if (!unlocked || event.passwordMatches !== true) return fail(user?.locked ? 'ロック済み' : 'パスワード不一致');
      attempt.passwordChecked = true; break;
    case 'checkMfa':
      if (!unlocked || event.mfaMatches !== true) return fail(user?.locked ? 'ロック済み' : '追加認証不一致');
      attempt.mfaChecked = true; break;
    case 'recordLoginFailure':
      if (!unlocked || (event.passwordMatches === true && event.mfaMatches === true)) return fail('照合失敗の入力ではありません');
      if (attempt.failureRecorded) return ok('no_op', 'この入力の失敗は記録済み');
      user.failedCount = Math.min(3, user.failedCount + 1); attempt.failureRecorded = true; break;
    case 'requireFailureLimit': if (!user || user.failedCount < 3) return fail('連続失敗は3回未満'); break;
    case 'lockUser':
      if (!user || user.failedCount < 3) return fail('連続失敗は3回未満');
      user.locked = true; break;
    case 'issueSession': {
      if (!unlocked || !event.sessionId || Object.hasOwn(next.sessions, event.sessionId) || !Number.isFinite(event.now) || !Number.isFinite(event.expiresAt) || event.expiresAt <= event.now) return fail('ロック済み・ID使用済み・期限不正');
      const valid = attempt.passwordChecked && attempt.mfaChecked && event.passwordMatches === true && event.mfaMatches === true;
      next.sessions[event.sessionId] = { userId, active: true, expiresAt: event.expiresAt, authenticated: valid };
      attempt.sessionIssued = true;
      record('sessionIssued', { valid, locked: user.locked, passwordChecked: attempt.passwordChecked, mfaChecked: attempt.mfaChecked, now: event.now }); break;
    }
    case 'resetLoginFailures':
      if (!login || !attempt.sessionIssued || !next.effects.some(e => e.type === 'sessionIssued' && e.inputId === event.inputId && e.valid)) return fail('この入力での正しい発行がありません');
      user.failedCount = 0; break;
    case 'requireSession': if (!user || !sessionValid) return fail('セッション不存在・失効・期限切れ・本人不一致'); break;
    case 'requireAdmin': if (!user || user.role !== 'admin') return fail('管理権限がありません'); break;
    case 'runAdminAction':
      if (event.type !== 'adminAction' || !user) return fail('管理入力ではありません');
      record('adminAction', { valid: sessionValid && user.role === 'admin', sessionValid, role: user.role, now: event.now }); break;
    case 'revokeSession':
      if (event.type !== 'logout' || !session || session.userId !== event.actorId) return fail('本人のログアウト入力ではありません');
      if (!session.active) return ok('no_op', '失効済み');
      session.active = false; record('sessionRevoked'); break;
    case 'recordSecurityAudit':
      if (!event.inputId) return fail('入力がありません');
      record('securityAudit', { inputType: event.type }); break;
    default: return fail('この案件では使えない処理');
  }
  return ok();
}
