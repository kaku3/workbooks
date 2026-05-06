# 深海潜水艦バトル — 詳細実装仕様 v5.0

## 1. システム概要

| 項目 | 内容 |
|------|------|
| タイトル | 深海潜水艦バトル (SUBMARINE BATTLE) |
| プレイ人数 | 3〜6人 |
| 通信方式 | PeerJS を使用した P2P（ホスト1名 + ゲスト最大5名） |
| エントリポイント | `index.html` → `js/lobby.js` → `js/main.js` |

### ファイル構成

```
30_src/
  index.html          ロビー画面 + ゲーム画面 HTML
  css/
    base.css          CSS変数・リセット・共通スタイル
    lobby.css         ロビー画面
    game.css          ゲーム画面レイアウト
    board.css         盤面キャンバス周辺
    panel.css         操作パネル・キュー・プレイヤーリスト
    overlay.css       モーダル・オーバーレイ・通知
  js/
    constants.js      ゲーム定数・操作定義・補給定義
    gameLogic.js      ゲームロジック（サーバー役：ホストのみ実行）
    main.js           ゲームコントローラー（メッセージルーティング）
    peer.js           PeerJS P2P通信レイヤー
    lobby.js          ロビー画面制御
    ui.js             UIコンポーネント制御
    render.js         Canvas ボード描画
    anim.js           コマンドプレビュー & アクションアニメーション
    modal.js          操作ターゲット選択モーダル
```

---

## 2. ゲーム定数 (`constants.js`)

| 定数 | 値 | 説明 |
|------|----|------|
| `GRID_SIZE` | 10 | 盤面サイズ（10×10） |
| `INITIAL_HP` | 4 | 初期HP |
| `BASE_TIME` | 10 | 1ターンの単位時間 |
| `COMMAND_TIME_LIMIT` | 30 | コマンド入力制限時間（秒） |
| `WIN_KILLS` | 3 | 勝利に必要なキル数 |

### 方向定義

```
N: (dx:0, dy:-1)   上
S: (dx:0, dy:+1)   下
E: (dx:+1, dy:0)   右
W: (dx:-1, dy:0)   左
```

---

## 3. 操作定義 (`OPS`)

各操作は `{ id, name, cost, cat, invKey? }` を持つ。

| ID | 名前 | 単位時間コスト | カテゴリ | 在庫キー |
|----|------|--------------|----------|----------|
| `forward` | 前進 | 1 | move | — |
| `turn_left` | ←旋回 | 3 | move | — |
| `turn_right` | 旋回→ | 3 | move | — |
| `strafe_l` | ←横移 | 2 | move | — |
| `strafe_r` | 横移→ | 2 | move | — |
| `sonar` | ソナー | 1 | recon | — |
| `torpedo` | 魚雷 | 1 | weapon | torpedo |
| `guided` | 追尾魚雷 | 2 | weapon | guided |
| `shotgun` | 散弾 | 1 | weapon | shotgun |
| `decoy` | デコイ | 1 | place | decoy |
| `mine` | 機雷 | 1 | place | mine |
| `chaff` | チャフ | 1 | defense | chaff |
| `armor` | 装甲板 | 2 | defense | armor |

### 初期在庫 (`INITIAL_INVENTORY`)

| 種別 | 初期数 |
|------|--------|
| torpedo（魚雷） | 6 |
| guided（追尾魚雷） | 3 |
| shotgun（散弾） | 3 |
| decoy（デコイ） | 3 |
| mine（機雷） | 3 |
| chaff（チャフ） | 3 |
| armor（装甲板） | 3 |

---

## 4. 補給ポイント (`SUPPLY_FIXED`)

盤面上に固定配置される補給ポイント（`supplyPoints` に格納）。

| 座標 | タイプ | 効果 |
|------|--------|------|
| (3, 3) | ammo | 在庫を全種`INITIAL_INVENTORY`に全回復 |
| (6, 6) | repair | HP +1（maxHpを超えない） |
| (2, 7) | ammo | 在庫を全種`INITIAL_INVENTORY`に全回復 |

補給は移動後、アクションフェーズ末尾の `resolveSupply()` で判定される。

---

## 5. 収縮ゾーン (SHRINK_TABLE)

コードに実装はあるが**現在は無効化**（`resolveActions` 内でコメントアウト）。  
Canvas 描画の `drawShrinkZone()` も無効化されている。

| ターン数 | 安全領域サイズ | margin |
|---------|--------------|--------|
| 1〜3 | 10×10（全域安全） | 0 |
| 4〜6 | 8×8 | 1 |
| 7〜9 | 6×6 | 2 |
| 10〜 | 4×4 | 3 |

---

## 6. 初期配置

`START_POS` 6箇所からプレイヤー数分をシャッフルして割り当て。

```
{ x:0, y:4, dir:'E' }   左辺中央→東向き
{ x:9, y:5, dir:'W' }   右辺中央→西向き
{ x:4, y:0, dir:'S' }   上辺中央→南向き
{ x:5, y:9, dir:'N' }   下辺中央→北向き
{ x:0, y:0, dir:'S' }   左上角→南向き
{ x:9, y:9, dir:'N' }   右下角→北向き
```

---

## 7. ゲームフロー

```
ロビー画面
  └─ ホスト: ルーム作成 → ルームID発行
     ゲスト: ルームID入力 → 参加
     ホスト: ゲーム開始ボタン押下

ゲーム画面（ターン繰り返し）
  ├─ コマンドフェーズ（command）
  │    ・全プレイヤーが操作をキューに積み、確定ボタン押下
  │    ・30秒タイムリミット（超過時は入力済みをそのまま確定）
  │    ・全員確定 → アクションフェーズへ
  └─ アクションフェーズ（action）
       ・ホストがゲームロジックを解決
       ・各プレイヤーに個別サニタイズしたビューを配信
       ・各クライアントがアニメーション再生
       ・アニメーション完了 → ホストが次ターンへ遷移
```

---

## 8. コマンドフェーズ詳細

### プレイヤー状態フィールド

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `x`, `y` | number | 盤面座標 (0〜9) |
| `dir` | 'N'\|'S'\|'E'\|'W' | 向き |
| `hp` | number | 現在HP |
| `maxHp` | number | 最大HP（常に4） |
| `time` | number | 残り単位時間（ターン開始時に `BASE_TIME=10` にリセット） |
| `inventory` | object | 各アイテムの残数 |
| `commandQueue` | array | 積まれた操作リスト `[{op, target}]` |
| `commandConfirmed` | boolean | 確定済みフラグ |
| `kills` | number | キル数 |
| `alive` | boolean | 生存フラグ |
| `respawning` | boolean | 次ターン復活待ちフラグ |
| `buffs` | object | `{ chaffActive, armorActive }` |
| `sonarResults` | array | ソナー検知結果 |
| `dogfightWith` | string\|null | ドッグファイト相手のプレイヤーID |
| `forwardWarning` | 'critical'\|'near'\|'far'\|null | 前方警戒レベル |

### 単位時間コスト計算

```javascript
calcTimeCost(opIds) => opIds.reduce((sum, id) => sum + OPS[id].cost, 0)
```

コスト合計が `p.time` を超える操作はキューに追加できない（UI側でボタンをdisableする）。

---

## 9. アクションフェーズ解決順序 (`resolveActions`)

1. **防御バフ処理** (chaff / armor) — 在庫消費を伴う
2. **ラウンドロビン処理** — コマンドインデックス `i=0,1,2,...` の順で全プレイヤー同時実行
   - move: `forward`, `turn_left`, `turn_right`, `strafe_l`, `strafe_r`
   - recon: `sonar`
   - weapon: `torpedo`, `guided`, `shotgun`
   - place: `decoy`, `mine`
3. **機雷チェック** (`checkMines`) — 全移動完了後
4. **補給処理** (`resolveSupply`) — 全移動完了後
5. **在庫消費** (weapon/place 系、chaff/armor 以外)
6. **ドッグファイト判定** (`resolveDogfight`)
7. **前方警戒更新** (`resolveForwardWarning`)
8. **デコイ寿命マイナス** — `turnsLeft--`、0以下を削除
9. **脱落チェック** (`checkEliminations`) → `hp <= 0` で `alive=false`、`respawning=true`

### 勝利判定

`applyDamage` 内で `kills` がカウントされる（ゲームロジック上は kills を `WIN_KILLS` と比較する別途処理が必要だが、現実装ではゲーム終了チェックは `checkEliminations` の後段で `state.winner` が設定される想定）。

---

## 10. 操作リゾルバー詳細

### 移動系

| 操作 | 処理 |
|------|------|
| `forward` | `dir` 方向に1マス前進（盤面外はclamp） |
| `turn_left` | 方向を左回りに90°転換 |
| `turn_right` | 方向を右回りに90°転換 |
| `strafe_l` | 左方向（自艦向きの-90°）に1マス平行移動 |
| `strafe_r` | 右方向（自艦向きの+90°）に1マス平行移動 |

### ソナー (`sonar`)

- ターゲット座標（`cmd.target.x/y`）を中心とした Chebyshev距離 1（3×3セル）を走査
- 各マスにいる敵プレイヤーを検知
- 検知した座標にデコイが存在する場合は検知をスキップ（デコイのオーナー確認）
- 検知結果は `p.sonarResults` に追記、`sonar` イベントを発射者プレイヤーへ（`to: pid`、非公開）
- **検知された側に `sonar_detected` イベントを送信**（`to: 被検知プレイヤーID`、非公開）

### 魚雷 (`torpedo`)

- 発射条件: ターゲット座標が自艦からの前方45°扇形内
  - `fwdDot = dtx*td.dx + dty*td.dy > 0`
  - `crossMag = |dtx*td.dy - dty*td.dx| <= fwdDot`
- ターゲット座標方向に直線発射（Bresenham近似）、GRID_SIZE×2ステップまで継続
- 最初に当たった生存敵に **ダメージ2**
- `torpedo_fire` イベント（発射者のみ）+ `attack_leak` イベント（全員公開）を発行

### 追尾魚雷 (`guided`)

- 発射条件: ターゲット座標が前方45°扇形内（魚雷と同じバリデーション）
- ターゲット座標から Chebyshev距離2以内の最近傍の生存敵に命中
- チャフ展開中の敵に命中 → チャフ消耗、ダメージ無効
- チャフなしの場合 → **ダメージ1**
- `guided_fire` イベント（発射者のみ）を発行

### 散弾 (`shotgun`)

- 自艦の向き方向の直前マス + 左直交マス + 右直交マス の3セル（各1マス先）
- 3セルにいる全生存敵に適用
- 装甲板展開中の敵に命中 → 装甲板消耗、ダメージ無効
- 装甲板なしの場合 → **ダメージ1**
- `attack_leak` イベント（全員公開、`fan:true`）を発行

### デコイ (`decoy`)

- ターゲット座標に設置（前方5マス×左右2マスの範囲から選択）
- `turnsLeft: 2` のデコイを `state.decoys` に追加
- デコイが存在するマスにいる艦はソナーで検知されない

### 機雷 (`mine`)

- ターゲット座標に設置（前方2マス×左右2マスの近傍）
- `state.mines` に追加（期限なし）
- 移動後にオーナー以外の艦が踏んだら爆発 → **ダメージ1**、機雷は消滅

### チャフ (`chaff`)

- 発動時に在庫を消費し `buffs.chaffActive = true` にする
- 次に `guided` の着弾を受けたとき無効化（`chaffActive = false`）

### 装甲板 (`armor`)

- 発動時に在庫を消費し `buffs.armorActive = true` にする
- 次に `shotgun` の着弾を受けたとき無効化（`armorActive = false`）

---

## 11. ドッグファイトモード

### 突入条件

アクションフェーズ末尾 (`resolveDogfight`)：  
2プレイヤーが互いに `dogfightWith == null` で Chebyshev距離 ≤ 3 のとき突入。  
（ターン1は突入しない）

### 解除条件

Chebyshev距離 > 4 になったターンに解除。

### 効果

- コマンドフェーズ中、ドッグファイト相手の座標・向き・コマンドキューが公開される
- プレイヤーリストのプレイヤーチップに相手のコマンドが表示される
- 画面上部に「ドッグファイトモード」バナーが表示される

---

## 12. 前方警戒 (`forwardWarning`)

アクションフェーズ末尾 (`resolveForwardWarning`)：

| 前方マス距離 | `forwardWarning` 値 |
|------------|---------------------|
| 1マス先に敵 | `'critical'` |
| 2マス先に敵 | `'near'` |
| 3マス先に敵 | `'far'` |
| 敵なし | `null` |

Canvas上で該当セルに色分け表示（critical: 赤橙、near: 橙半透明、far: 黄半透明）。

---

## 13. 霧戦争（状態サニタイズ）

`sanitizeStateForPlayer(state, playerId)` が各プレイヤー向けに状態をフィルタリング。

### 非公開情報（自分以外の艦）

- 座標・向き（`x, y, dir` が `undefined`）
- インベントリ（送信されない）

### ドッグファイト中は公開

- 相手の `x, y, dir, commandQueue`

### 追加提供フィールド

| フィールド | 内容 |
|-----------|------|
| `myMines` | 自分が設置した機雷一覧 |
| `myDecoys` | 自分が設置したデコイ一覧 |
| `nearbyMines` | 自艦から Chebyshev≤3 の敵機雷 |
| `nearbyDecoys` | 自艦から Chebyshev≤3 の敵デコイ |
| `nearbyEnemies` | 自艦から Chebyshev≤3 の生存敵（座標公開） |

---

## 14. P2P通信 (`peer.js`)

### 役割分担

- **ホスト**: ゲーム状態 (`gameState`) を保持し、全ロジックを実行
- **ゲスト**: コマンドを送信し、サニタイズ済みビューを受信して表示

### メッセージタイプ (`MSG`)

| 種別 | 方向 | 内容 |
|------|------|------|
| `JOIN` | ゲスト→ホスト | 参加要求 |
| `PLAYER_LIST` | ホスト→全員 | プレイヤーリスト |
| `GAME_START` | ホスト→全員 | ゲーム開始 |
| `COMMAND_CONFIRM` | ゲスト→ホスト | コマンド確定 |
| `DISCARD_CHOICE` | ゲスト→ホスト | 捨て札選択（旧カードゲーム仕様の残存） |
| `STATE_UPDATE` | ホスト→個人 | 状態同期（サニタイズ済み） |
| `PRIVATE_EVENT` | ホスト→個人 | ソナー結果等の個人宛イベント |
| `PUBLIC_EVENT` | ホスト→全員 | タイマーtick等の全員向けイベント |
| `GAME_OVER` | ホスト→全員 | ゲーム終了 |

---

## 15. アニメーションシステム (`anim.js`)

### コマンドプレビュー

操作ボタン押下時に `setCommandPreview(steps)` で Canvas Layer 9 にプレビューを描画。  
ステップ種別：`path`, `sonar`, `attack`, `turn`, `guided_preview`, `decoy_preview`, `mine_preview`, `chaff_preview`, `armor_preview`

### アクションアニメーション

`startActionAnimation(events, view, onDone, onEachEvent)` でイベントキューを順再生。

- 各イベントを `_eventDelay(ev)` ms 間表示後に次へ進む
- 移動イベントは `fromX/Y/dir` を使って巻き戻してから再生
- 追尾魚雷・魚雷は rAF による移動アニメーション

### イベント表示時間

| イベントタイプ | 表示時間 |
|--------------|---------|
| `eliminated` | 4000 ms |
| `damage` | 3000 ms |
| `torpedo_fire` | 3000 ms |
| `guided_fire` | 2500 ms |
| `attack_leak`（torpedo/shotgun） | 400 ms |
| `explosion` | 2800 ms |
| `sonar` | 3000 ms |
| `sonar_detected` | 2000 ms |
| `buff` | 1500 ms |
| その他 | 1500 ms |

---

## 16. Canvas 描画レイヤー (`render.js`)

| レイヤー | 内容 |
|---------|------|
| 0 | 背景グラデーション |
| 1 | 収縮ゾーン（現在無効化） |
| 2 | グリッド線 |
| 3 | 補給ポイント（⛽ 🔧 アイコン） |
| 4 | 機雷・デコイ・ブイマーカー |
| 4b | 近辺可視（敵機雷・敵デコイ・近接敵） |
| 5 | 前方警戒セルハイライト |
| 6 | 潜水艦（三角形＋向き矢印） |
| 7 | ソナー検知結果 |
| 8 | 座標ラベル |
| 9 | コマンドプレビュー（anim.js） |

---

## 17. ソナー検知警告エフェクト

`sonar_detected` イベントを受信したプレイヤーに全画面エフェクトを表示する。

### フロー

1. `gameLogic.js` の `resolveSonar()` で敵を検知した際、被検知プレイヤーに `sonar_detected` イベントを `to: ep.id` で push
2. `anim.js` の `_eventDelay()` で 2000ms の表示時間を割り当て
3. `ui.js` の `showCurrentAction()` で `ev.type === 'sonar_detected'` を検出
4. `#sonar-alert-overlay` を表示（CSS アニメーションで自動フェードアウト）

### DOM構造

```html
<div id="sonar-alert-overlay" class="hidden">
  <div class="sonar-alert-inner">
    <div class="sonar-alert-icon">📡</div>
    <div class="sonar-alert-title">SONAR DETECTED</div>
    <div class="sonar-alert-sub">敵ソナーに捕捉されました</div>
  </div>
</div>
```

### CSS アニメーション

`sonar-alert-show` クラスで全画面フラッシュ＋2秒後に自動非表示。

---

## 18. 復活システム

- HP ≤ 0 → `alive=false`、`respawning=true`、`dogfightWith` をリセット
- 次ターン開始時 `prepareNextTurn()` で辺上のランダム空きマスに復活
  - HP が `INITIAL_HP(4)` に回復
  - インベントリが `INITIAL_INVENTORY` に全回復
  - バフリセット
- `respawn` イベント（全員公開）を発行
