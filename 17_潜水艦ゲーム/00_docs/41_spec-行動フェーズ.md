# 行動フェーズ 設計仕様

## 0. 目的

コマンドフェーズで全員が確定したコマンドを、**全端末で同一のアニメーション**として再生する。  
アニメーションの再生に必要なすべての情報を「イベントキュー（`actionEvents`）」に凝縮し、  
ホストが各プレイヤー向けにサニタイズして配布する。

---

## 1. 行動フェーズの全体フロー

```
【ホスト】
  ① resolveActions(state)
      ─ チャフ先読み展開
      ─ タイムライン構築 (累積コスト = 完了時刻 t)
      ─ タイムライン昇順で実行 + ティック境界ごとに飛翔体前進・衝突判定
      ─ 最終ティック後: 残存飛翔体を射程が尽きるまで前進
      ─ 補給 / 在庫消費 / 前方警戒 / 脱落チェック
      ─ state.actionEvents にイベントを蓄積
  ② syncStateToAll()
      ─ sanitizeStateForPlayer(state, pid) で各プレイヤー向けにフィルタ
      ─ PeerJS で各端末へ STATE_UPDATE 送信

【全端末（ホスト含む）】
  ③ onLocalStateUpdate() → phase === 'action' かつ isNewPhase === true を検出
  ④ オーバーレイ表示 1800ms 経過後に startActionAnimation() を起動
      ─ move イベントの fromX/fromY でプレイヤーを行動前位置に巻き戻し
      ─ イベントキューを順番に再生（setTimeout でタイミング制御）
  ⑤ アニメーション完了 → ホストのみ advanceToNextTurn() → syncStateToAll()
```

---

## 2. ソート済みタイムライン実行モデル

各プレイヤーのコマンドキューを「累積コスト = 完了時刻 t」でタイムラインに展開し、  
`t` 昇順でソートしてから順次実行する。

```javascript
// タイムライン構築
const timeline = [];
for (const pid of alive) {
  let t = 0;
  for (const cmd of state.players[pid].commandQueue) {
    t += OPS[cmd.op]?.cost ?? 1;
    timeline.push({ t, pid, cmd });
  }
}
// t 昇順 → 同 t はプレイヤー順（決定論的）
timeline.sort((a, b) =>
  a.t - b.t || state.playerOrder.indexOf(a.pid) - state.playerOrder.indexOf(b.pid)
);
```

**実行例**:
```
P1 = [forward(cost=1), torpedo(cost=1)]    → t=1: 前進, t=2: 魚雷発射
P2 = [turn_right(cost=3), forward(cost=1)] → t=3: 旋回, t=4: 前進

タイムライン（ソート後）:
  {t=1, P1, forward}
  {t=2, P1, torpedo}
  {t=3, P2, turn_right}
  {t=4, P2, forward}
```

**ティック境界の処理**:  
`t` が前のエントリと変わったとき（`t !== prevT && prevT >= 0`）に  
`_advanceProjectiles` → `_tickEnterCheck` を呼ぶ。

```javascript
for (const { t, pid, cmd } of timeline) {
  if (t !== prevT && prevT >= 0) {
    _advanceProjectiles(state, projectiles);
    _tickEnterCheck(state);
  }
  prevT = t;
  // コマンド実行…
}
// 全コマンド完了後: 残存飛翔体を射程が尽きるまで前進させる
for (let extra = 0; extra < GRID_SIZE && projectiles.length > 0; extra++) {
  _advanceProjectiles(state, projectiles);
}
_tickEnterCheck(state);
```

---

## 3. ティック境界での衝突判定（`_tickEnterCheck`）

順序が重要: **離脱 → 突入 → 機雷トリガー**。  
離脱を先に処理することで「離脱直後に別ペアへ突入」が同一ティック内で正しく動作する。

### 1) ドッグファイト離脱チェック（先に判定）
チェビシェフ距離 > 4 のペアに `dogfight_end` イベントを生成。

`dogfight_end` は解除対象プレイヤーごとに 1 件ずつ発行し、
`pid`（自分）に加えて `otherId`（相手）を持つ。

```javascript
pushEvent(state, { type: 'dogfight_end', pid, otherId: partnerId, public: false, to: pid });
pushEvent(state, { type: 'dogfight_end', pid: partnerId, otherId: pid, public: false, to: partnerId });
```

### 2) ドッグファイト突入チェック（離脱後に判定）
チェビシェフ距離 ≤ 3 の未交戦ペアに `dogfight_start` イベントを生成。  
ターン1はスキップ（配置直後は突入しない）。

### 3) 機雷トリガー
プレイヤーが機雷マスに到達していれば `explosion` + ダメージを適用し機雷を除去。

---

## 4. 飛翔体（プロジェクタイル）システム

武器コマンドは「即時ダメージ」ではなく **飛翔体** として登録し、  
ティック境界ごとに **1ステップ = 1セル** 移動しながらヒット判定を行う。

```
t=2: torpedo_fire イベント（飛翔体を projectiles 配列に追加）
t=3境界: _advanceProjectiles → projectile_tick (sx+1, sy) → ヒット判定
t=4境界: _advanceProjectiles → projectile_tick (sx+2, sy) → ヒット判定
t=5境界: _advanceProjectiles → projectile_hit → explosion + damage イベント
```

これにより「弾を撃った後に移動して回避できる」インタラクションが実現する。

### 飛翔体の種類

| 種別 | 射程 | ダメージ | 特徴 |
|---|---|---|---|
| torpedo | 8 cells | 2 | 目標方向へ atan2 直線経路 |
| guided  | 12 cells | 1 | チャフで無効化可; `GUIDED_REROUTE_INTERVAL` ティックごとに角度修正 |
| shotgun | 1 cell | 1×3 | 前方扇形3方向に同時発射（3弾）|

### 飛翔体の持続表示

飛翔体はボード上に**オブジェクトとして存在し続ける**。  
`_animView.projectiles` にスポーンから `projectile_hit/miss` まで登録され続け、  
`applyPreviewLayer()` が `renderState` のたびに描画する（Layer 9 で重描画）。  
これにより、他の物が動いてキャンバスが再描画されても飛翔体は表示されたままになる。

### 経路計算（`_computeProjPath`）

`atan2` で発射元→目標の角度を求め、直線補間で各ステップの座標を決定する。  
各ステップは「スタート地点から i × cos/sin(angle) 進んだ位置を丸め」で求める。  
隣接ステップが同一セルになる場合は重複を除去する（斜め方向で自然に発生する）。  
目標セルに到達後も同じ角度で飛び続け、盤外 or maxSteps で経路終端。

```javascript
function _computeProjPath(sx, sy, tx, ty, maxSteps) {
  if (sx === tx && sy === ty) return [];
  const angle = Math.atan2(ty - sy, tx - sx);
  const cosA = Math.cos(angle), sinA = Math.sin(angle);
  const path = [];
  let prevX = sx, prevY = sy;
  for (let i = 1; i <= maxSteps; i++) {
    const nx = Math.round(sx + cosA * i);
    const ny = Math.round(sy + sinA * i);
    if (nx < 0 || nx >= GRID_SIZE || ny < 0 || ny >= GRID_SIZE) break;
    if (nx !== prevX || ny !== prevY) { path.push({ x: nx, y: ny }); prevX = nx; prevY = ny; }
  }
  return path;
}
```

### 追尾魚雷の誘導ロジック（`_rerouteGuided`）

`GUIDED_REROUTE_INTERVAL`（デフォルト 4）ティックに 1 回だけ実行（追尾強度の調整ポイント）:
1. 全生存敵との**ユークリッド距離**を計算し、最近傍敵を見つける
2. 最近傍敵に向けた新しい atan2 直線経路を計算し `proj.path` を置き換える
3. `proj.rerouteTick` をインクリメントし、`% GUIDED_REROUTE_INTERVAL !== 0` の場合はスキップ

チャフ有効な敵に命中した場合: 追尾魚雷のみ無効化（`chaff_block` イベント）。

```javascript
const GUIDED_REROUTE_INTERVAL = 4; // ← この値を変えて追尾強度を調整

function _rerouteGuided(proj, state) {
  proj.rerouteTick = (proj.rerouteTick ?? 0) + 1;
  if (proj.rerouteTick % GUIDED_REROUTE_INTERVAL !== 0) return; // まだ修正しない
  let nearest = null, bestDist = Infinity;
  alivePlayers(state).forEach(eid => {
    if (eid === proj.ownerId) return;
    const ep = state.players[eid];
    const d = Math.hypot(ep.x - proj.x, ep.y - proj.y);
    if (d < bestDist) { nearest = ep; bestDist = d; }
  });
  if (!nearest) return;
  const newPath = _computeProjPath(proj.x, proj.y, nearest.x, nearest.y, GUIDED_RANGE);
  if (newPath.length > 0) { proj.path = newPath; proj.pathIdx = 0; }
  proj.targetX = nearest.x; proj.targetY = nearest.y;
}
```

---

## 5. イベントの可視性（`public` / `to` フラグ）

`sanitizeStateForPlayer` はこのフラグで配布先をフィルタリングする。

| イベント種別 | public | to | 意味 |
|---|---|---|---|
| `move` | **true** | (なし) | **全員に配布** — 全端末で全プレイヤーのアニメを再生するため |
| `sonar` | false | pid | ソナー結果は自分だけ |
| `sonar_detected` | false | pid | 索敵された側への警告 |
| `torpedo_fire` | true | (全員) | 魚雷発射（発射元・方向は公開） |
| `guided_fire`  | true | (全員) | 追尾魚雷発射 |
| `shotgun_fire` | true | (全員) | 散弾発射 |
| `projectile_tick` | true | (全員) | 飛翔体移動 |
| `projectile_hit`  | true | (全員) | 命中（blocked=true でチャフ無効化） |
| `projectile_miss` | true | (全員) | 射程切れ・外れ |
| `explosion` | true | (全員) | 機雷爆発座標 |
| `mine_place` | false | pid | 機雷設置は自分だけ |
| `buff` (chaff) | false | pid | チャフ展開は自分だけ |
| `chaff_block` | false | pid | チャフ無効化通知は被弾者のみ |
| `dogfight_start` | false | pid | 当事者それぞれに個別送信 (`pids: [a,b]`) |
| `dogfight_end` | false | pid | 当事者それぞれに個別送信 (`pid`, `otherId`) |
| `damage` | true | (全員) | 被弾情報（撃沈は公開） |
| `eliminated` | true | (全員) | 死亡通知。`x`, `y`, `respawning` を含む |

> **`move` を `public: true` にする理由**:  
> 全端末が全プレイヤーの移動アニメーションを再生できるようにする。  
> コマンドフェーズへ戻ったとき `sanitizeStateForPlayer` が座標を再び隠すためステルスは維持される。

> **霧戦中の死亡者座標について**:  
> `sanitizeStateForPlayer` はターン終了時に `respawning=true` の死亡者の座標を全員に開示するが、  
> アニメーション開始時に `startActionAnimation` がその座標を消す（上記「alive 状態の巻き戻し」参照）。  
> `eliminated` イベントに埋め込まれた `x`, `y` を使ってはじめて死亡地点が全員に公開される。

---

## 6. アニメーション再生（`anim.js`）

### 起動条件とタイミング

`onLocalStateUpdate` で `phase === 'action'` かつ `isNewPhase === true` のとき、  
**常に 1800ms 待ってから** `startActionAnimation()` を起動する。

```javascript
const delay = 1800; // オーバーレイ表示（1800ms）を常に待ってからアニメ開始
_animStartTimeoutId = setTimeout(() => { startActionAnimation(…) }, delay);
```

> ネットワーク遅延によって state が遅く届いても遅延を短縮しない。  
> （`actionPhaseStartedAt` で `elapsed` を引く方式は overlay 表示中にアニメが始まるバグになるため廃止）

### プレイヤー初期位置・生死状態の復元

`actionEvents` 内の `move` イベントの `fromX/fromY/fromDir` を使い、  
全プレイヤーをアクション前の位置に巻き戻してから再生を開始する。

```javascript
// move イベントの最初の出現のみ使う（x != null のプレイヤーのみ）
for (const ev of actionEvents) {
  if (ev.type === 'move' && !rewound.has(ev.pid) && view.players[ev.pid]?.x != null) {
    view.players[ev.pid].x   = ev.fromX;
    view.players[ev.pid].y   = ev.fromY;
    view.players[ev.pid].dir = ev.fromDir;
    rewound.add(ev.pid);
  }
}
```

#### alive 状態の巻き戻し（今ターン死亡プレイヤー対応）

`sanitizeStateForPlayer` はターン終了時点の最終状態を配布するため、  
今ターン `eliminated` されたプレイヤーは `alive=false` / `respawning=true` になっている。  
このまま `_animView` にコピーすると、アニメ開始時点からキャラが見えない。

そのため `startActionAnimation` は **`eliminated` イベントがキューにあるプレイヤー** を  
`alive=true` / `respawning=false` に巻き戻し、`eliminated` イベント発火時に `alive=false` に変える。

```javascript
// キューに eliminated があるプレイヤーは alive=true に戻す
const eliminatedThisTurn = new Set(
  _actionQueue.filter(e => e.type === 'eliminated').map(e => e.pid)
);
Object.keys(_animView.players).forEach(pid => {
  const ap = _animView.players[pid];
  if (!ap.alive && eliminatedThisTurn.has(pid)) {
    ap.alive = true;
    ap.respawning = false;
    // move がなく、かつ元の view で座標非公開だった相手のみ隠す
    // （自分自身や視界内にいた相手は保持）
    if (!rewound.has(pid) && view.players[pid]?.x == null) {
      ap.x = undefined; ap.y = undefined; ap.dir = undefined;
    }
  }
});
```

#### 霧戦と死亡者座標の扱い

`sanitizeStateForPlayer` はターン終了時に `respawning=true` の死亡者の座標を全員へ開示する。  
しかしアニメ中は「そのプレイヤーの `move` イベントが届いたタイミング（= 視界内に入ったとき）」まで  
座標を見せたくない。上記の `!rewound.has(pid) && view.players[pid]?.x == null` による
座標クリアがこれを担保する。

### ドッグファイト状態のアニメ初期化

`startActionAnimation` では、アニメ開始時にドッグファイト状態をいったんリセットし、
イベントキューから必要な初期状態だけ復元する。

1. 自分向け `dogfight_start` がキューにある場合: イベントで開始を描画するため初期復元しない
2. `dogfight_start` がなく `dogfight_end` のみある場合:
   前ターンから継続していた交戦の解除を見せるため、`dogfight_end.otherId` で初期復元する

```javascript
function initializeAnimDogfightState(animView, actionQueue) {
  const meId = animView.myId;
  const me = animView.players[meId];
  if (!me) return;
  me.dogfightWith = null;

  const hasStartForMe = actionQueue.some(ev =>
    ev.type === 'dogfight_start' && Array.isArray(ev.pids) && ev.pids.includes(meId)
  );
  if (hasStartForMe) return;

  const endForMe = actionQueue.find(ev => ev.type === 'dogfight_end' && ev.pid === meId && ev.otherId);
  if (endForMe) me.dogfightWith = endForMe.otherId;
}
```

### イベント再生順序

イベントキューを `_nextActionStep()` で順番に処理:
1. `_applyEventToAnimView(ev)` — アニメ用ビューのプレイヤー状態を更新
2. `renderState(_animView)` — キャンバスを再描画
3. 注釈オーバーレイの描画（矢印・ラベル等）
4. `setTimeout(_nextActionStep, _eventDelay(ev))` — 次イベントへ

### イベント遅延（`_eventDelay`）

| イベント種別 | 遅延 |
|---|---|
| `tick_start` | 80ms |
| `move` | 400ms |
| `torpedo_fire`, `guided_fire`, `shotgun_fire` | 400ms |
| `projectile_tick` (torpedo/shotgun) | 200ms |
| `projectile_tick` (guided) | 400ms（追尾魚雷は遅め） |
| `projectile_hit` | 2200ms |
| `explosion` | 2800ms |
| その他 | 500ms |

### ドッグファイトバナー

`dogfight_start` イベント → `_updateAnimDogfightBanner(animView)` でバナー表示。  
`dogfight_end` イベント → バナー非表示。  
コマンドフェーズの `_updateDogfightBanner(view)` はアクションフェーズ中は呼ばれない（`view.phase === 'action'` で早期リターン）。

### アニメーション終了

全イベントを消化したら `_actionBaseView`（最終状態）でレンダリングし、  
`onDone` コールバックを呼ぶ。**ホストのみ** `advanceToNextTurn()` を実行する。

---

## 7. タイマー切れ時の処理

### 基本方針: 入力途中でも確定

**確定ボタンを押していなくても、それまでに積み上げたコマンドは確定される。**

- 移動だけして時間切れになった場合 → その移動コマンドが確定
- 魚雷発射先を入力中（盤面タップ待ち）に時間切れ → タップ待ちをキャンセルし、
  それ以前に積んだコマンドが確定（魚雷コマンド自体はキューに入っていないためスキップ）
- コマンドを何も積まずに時間切れ → 空のコマンドキューで確定（何もしない扱い）

### ホスト側（`main.js`）

```
① commandTimer が 'expired' に設定（再起動防止ガード）
② cancelBoardPick()                  ← 盤面ピック中の await を resolve(null) で中断
   ※ ソナー/魚雷のトグルモード中でも盤面ピックがキャンセルされる
③ getSelectedOps() で入力済みコマンドを取得
   ※ selectedOps に積まれていたコマンドがそのまま commandQueue になる
④ まだ未確定であれば handleConfirmLocal(opIds, targets) でホスト自身のコマンドを確定
⑤ forceConfirmAll(state) を呼ぶ
   - 未確定プレイヤー（ゲスト等）に空の commandQueue をセット
   - resolveActions(state) を実行
⑥ syncStateToAll()
```

ポイント: `cancelBoardPick()` を先に呼ぶことで、魚雷/ソナーのトグルモード中に
盤面選択待ちになっていても resolve(null) で中断され、
それまでに積んだコマンドが確定される。

### ゲスト側（`main.js` `onPublicEvent`）

```javascript
// timerTick === 0 受信時: 未確定なら入力済みコマンドを即時送信
if (!getIsHost() && msg.timerTick <= 0) {
  if (localView?.phase === 'command' && !localView.players[myId]?.commandConfirmed) {
    cancelBoardPick();
    const { opIds, targets } = getSelectedOps();
    handleConfirmLocal(opIds, targets);
  }
}
```

ゲストの送信はベストエフォート（ホストが `forceConfirmAll` を実行する前に届けば採用）。  
間に合わなかった場合は空キューになる（現行の挙動）。

### UI側のタイムアウト対応（`ui.js`）

`showActionEvents()` の冒頭で以下を実行:
```javascript
_deactivateSonarToggle();  // ソナートグル中でも解除
cancelBoardPick();          // 盤面ターゲット選択中でも強制キャンセル
```
これにより、コマンド入力途中でタイムアウトした場合でも盤面ハイライトが残らない。

---

## 8. 同期のタイミング図

```
Host                  Guest
 |                      |
 |─── resolveActions()  |
 |─── syncStateToAll() ─────────────────────→ STATE_UPDATE(sanitized)
 |                                              |
 |  [overlay 1800ms]            [overlay 1800ms]
 |─ startActionAnimation()   startActionAnimation()
 |  (onDone=advanceToNextTurn)   (onDone=null)
 |                                              |
 |─ [animation playing] ─────── [animation playing]
 |                                              |
 |─ onDone: advanceToNextTurn()                 |
 |─── syncStateToAll() ─────────────────────→ STATE_UPDATE(command phase)
```

> 両端末ともオーバーレイ後に固定 1800ms 待ってからアニメを開始するため、  
> ネットワーク遅延があっても両端末のアニメ開始タイミングはほぼ揃う。
