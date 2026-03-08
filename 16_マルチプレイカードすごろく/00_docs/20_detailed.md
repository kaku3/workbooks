# 爆弾魔 vs 解除班 詳細設計書

## 1. ファイル構成

```
30_src/
├── index.html              シングルページ（ロビー＋ゲーム画面を div で切り替え）
├── css/
│   ├── base.css            リセット・変数・ベーススタイル・ボタン共通
│   ├── lobby.css           ロビー画面
│   ├── game.css            ゲーム画面レイアウト（ヘッダー・グリッド）
│   ├── board.css           すごろく盤・コマ
│   ├── card.css            カードコンポーネント
│   └── overlay.css         モーダル・ゲームオーバー・トースト
└── js/
    ├── constants.js        定数・カード・ロケーション定義
    ├── gameLogic.js        ゲーム状態管理・全ルール（ホストのみ実行）
    ├── peer.js             PeerJS P2P通信レイヤー
    ├── lobby.js            ロビー画面UI
    ├── render.js           ゲーム画面描画（DOM操作）
    ├── modal.js            モーダル・ターゲット選択・ロケーション効果UI
    └── main.js             ゲーム画面 エントリーポイント（メッセージ受信・ロジック呼び出し）
```

---

## 2. モジュール詳細

### 2.1 constants.js

ゲームで使う全定数を定義。他ファイルは必ずここから `import` する。

```
ROLES           { BOMBER, DEFUSER }
CARD_TYPES      { MOVE, ACTION, ITEM }
ITEM_SUBTYPES   { BOMB_PART, DEFUSE_KIT, DUMMY }
CARD_DEFINITIONS  Card オブジェクトの配列（山札の全カード）
BOMB_PART_IDS     爆弾パーツ3種のID配列（勝利判定用）
DEFUSE_KIT_IDS    解除キット3種のID配列（勝利判定用）
LOCATIONS         Location オブジェクトの配列（14マス）
TOTAL_LOCATIONS   14
```

#### Card オブジェクト型

| フィールド | 型       | 説明                                          |
|-----------|----------|----------------------------------------------|
| id        | string   | 一意ID（例: `m1a`, `act_trade_a`）              |
| type      | CARD_TYPES | `move` / `action` / `item`                 |
| value     | number?  | 移動カードのみ: 移動マス数                       |
| action    | string?  | アクションカードのみ: アクション種別              |
| subtype   | ITEM_SUBTYPES? | アイテムカードのみ: パーツ種別              |
| label     | string   | 表示名                                        |
| desc      | string   | 説明文                                        |

#### Location オブジェクト型

| フィールド | 型     | 説明                       |
|-----------|--------|---------------------------|
| id        | number | インデックス（0-13）         |
| name      | string | 場所名                     |
| type      | string | 効果種別（例: `junk`）      |
| emoji     | string | 絵文字アイコン              |
| desc      | string | 効果説明                   |

### 2.2 gameLogic.js

ホストのブラウザのみで実行される、ゲームの核心ロジック。
**副作用あり（state を直接変異させる）**。

#### GameState オブジェクト型

| フィールド        | 型             | 説明                                          |
|------------------|----------------|----------------------------------------------|
| players          | Player[]       | 4プレイヤー（座席順）                          |
| deck             | Card[]         | 山札（末尾が次に引かれるカード）                |
| discard          | Card[]         | 捨て札                                        |
| blockedLocation  | number\|null   | 通行止め中のロケーションindex                  |
| blockedUntilTurn | number         | 通行止め解除ターン                              |
| currentTurnIndex | number         | 手番プレイヤーのindex（0-3）                   |
| turnCount        | number         | 経過ターン数                                   |
| phase            | string         | `draw` / `main` / `location` / `end`         |
| pendingAction    | object\|null   | ロケーション効果など未解決アクションの一時データ |
| log              | LogEntry[]     | ゲームログ（最大100件）                         |
| winner           | string\|null   | `bomber` / `defuser` / `null`                |

#### Player オブジェクト型

| フィールド | 型       | 説明                          |
|-----------|----------|------------------------------|
| id        | string   | PeerJS ID                    |
| name      | string   | 表示名（ロビー入力値）           |
| role      | ROLES    | `bomber` / `defuser`         |
| position  | number   | 現在位置（0-13）               |
| skipped   | boolean  | 足止め中フラグ                 |
| hand      | Card[]   | 手札                          |

#### export 関数一覧

| 関数 | 引数 | 返り値 | 説明 |
|------|------|--------|------|
| `createInitialState(playerIds, playerNames)` | string[], string[] | GameState | ゲーム初期状態生成。役割・山札・初期手札を配布 |
| `getCurrentPlayer(state)` | GameState | Player | 現在の手番プレイヤーを返す |
| `pName(state, id)` | GameState, string | string | 表示吉1取得ヘルパー（未知の場合は ID 先頭 6 文字） |
| `doDrawPhase(state)` | GameState | `{state, drawnCard}` | ドローフェーズ: 1枚引いてphaseを`main`へ |
| `playCard(state, cardId, targetId?, chosenCardId?, targetLoc?)` | ... | `{state, error?, needsInput?}` | カードをプレイ。移動→phase=`location`、アクション→効果解決→nextTurn |
| `resolveLocationSync(state, locType, chosenCardId?)` | ... | GameState | 移動後のロケーション効果を解決。nextTurnも呼ぶ |
| `declareArrest(state, declarerId)` | ... | `{state, error?}` | 解除班の確保宣言。条件チェック後 winner='defuser' |
| `sanitizeStateForPlayer(state, viewerId)` | ... | GameState | 他プレイヤーの手札・役職を隠した視点別state生成 |

#### フェーズ遷移

```
draw
 └─[doDrawPhase]──→ main
                     ├─[playCard: MOVE]──→ location ──[resolveLocationSync]──→ draw(次ターン)
                     ├─[playCard: ACTION]────────────────────────────────────→ draw(次ターン)
                     └─[playCard: ITEM]──→ エラー返却（手札に戻す）
```

#### ロケーション効果一覧

| type         | 効果 | 追加入力 |
|--------------|------|---------|
| `start`      | なし | なし |
| `junk`       | 山札から1枚ドロー。引いたカードは privateReveal で本人に通知 | なし |
| `pub`        | ランダムな相手と手札1枚交換 | なし |
| `detective`  | 相手指名→手札1枚をこっそり見る | `pendingAction.locEffect='detective'` |
| `factory`    | 山札からアイテムカード優先1枚引く | なし |
| `casino`     | ダイス偶数→2枚ドロー / 奇数→1枚没収 | なし |
| `tower`      | 山札を全て見て1枚選ぶ（サーチ）。爆弾魔はパーツ揃いで起爆可 | `pendingAction.deck` を渡す |
| `crossing`   | 全員手札1枚を左隣へ | なし |
| `police_box` | 相手指名→手札1枚をランダムに捨てる | `pendingAction.locEffect='police_box'` |
| `black_mkt`  | 捨て札から1枚選んで拾う | `pendingAction.discard` を渡す |
| `broadcast`  | 自分の手札1枚を全員公開→1枚ドロー | なし |
| `construct`  | 1回休み | なし |
| `hospital`   | 手札全捨て→5枚引き直し | なし |
| `police_hq`  | 相手指名→役職をこっそり知る | `pendingAction.locEffect='police_hq'` |

### 2.3 peer.js

P2P通信（PeerJS公式クラウドサーバー）。
ホスト1名 ↔ ゲスト3名 のスター型トポロジー。
全ゲームメッセージはホストを経由する。

#### アーキテクチャ

```
ゲスト A ──┐
ゲスト B ──┤── ホスト（ゲームロジック実行）
ゲスト C ──┘
```

#### メッセージ種別 (MSG)

| 定数 | 方向 | 内容 |
|------|------|------|
| `join`           | Guest→Host | ゲスト参加申請（name含む）|
| `play_card`      | Guest→Host | カードプレイ要求 |
| `resolve_loc`    | Guest→Host | ロケーション効果解決 |
| `declare_arrest` | Guest→Host | 確保宣言 |
| `choose_card`    | Guest→Host | 闇市/タワーでカード選択 |
| `state_update`   | Host→All   | ゲーム状態配信（視点別サニタイズ済み）|
| `private_reveal` | Host→1人   | プライベート情報（おのぞき見・スキャン結果）|
| `public_reveal`  | Host→All   | 全員への公開情報 |
| `game_over`      | Host→All   | ゲーム終了通知 |
| `player_list`    | Host→All   | ロビー参加者一覧 |
| `game_start`     | Host→All   | ゲーム開始通知 |
| `error`          | Host→1人   | エラー通知 |

#### export 関数一覧

| 関数 | 説明 |
|------|------|
| `initPeer()` | PeerJS初期化。PeerID取得（Promise） |
| `getMyId()` | 自分のPeerID |
| `getIsHost()` | ホストかどうか |
| `createRoom(onMessage)` | ホスト: 接続待受開始 |
| `joinRoom(hostId, name, onMessage)` | ゲスト: ホストに接続、JOIN メッセージに name を含める |
| `setMessageHandler(callback)` | メッセージハンドラを差し替え（ロビー→ゲーム切替時） |
| `broadcastState(state, events)` | 全員へゲーム状態配信（各自視点でサニタイズ）。events[pid] または events.all のイベントを同時送信 |
| `sendPrivate(toId, payload)` | 特定1人へ送信 |
| `broadcastPublic(payload)` | 全員へ公開情報送信 |
| `broadcastGameOver(winner)` | ゲーム終了通知 |
| `broadcastPlayerList(players)` | ロビー参加者一覧配信 |
| `broadcastGameStart(playerIds)` | ゲーム開始通知 |
| `sendPlayCard(...)` | カードプレイ送信（ホストは自ハンドラへ直送） |
| `sendResolveLoc(...)` | ロケーション解決送信 |
| `sendDeclareArrest()` | 確保宣言送信 |
| `getGuestIds()` | 接続中ゲストのPeerID配列 |

### 2.4 lobby.js

ロビー画面の UI 処理。`peer.js` と `main.js` の橋渡し役。

#### 処理フロー

```
initPeer()
  └─[ホスト] createRoom(onHostMessage)
      → JOIN 受信 → players[] に追加 → broadcastPlayerList()
      → btn-start 押下 → broadcastGameStart(playerIds)
          → onHostMessage: GAME_START → initGameScreen()

  └─[ゲスト] joinRoom(hostId, onGuestMessage)
      → sendToHost({ type: JOIN, name })
      → PLAYER_LIST 受信 → renderPlayerList()
      → GAME_START 受信 → initGameScreen()
```

### 2.5 render.js  （main.js から分離）

ゲーム画面のDOM描画のみを担当。副作用は DOM 操作のみ。
`myId` を引数として受け取る純粋な描画関数群。

| 関数 | 説明 |
|------|------|
| `renderGame(state, myId)` | 全UI更新のエントリポイント |
| `renderBoard(state, myId)` | すごろく盤（ロケーション＋コマ）描画 |
| `renderMyHand(state, myId, isMyturn)` | 自分の手札描画 |
| `renderOtherPlayers(state, myId)` | 他プレイヤーパネル描画 |
| `renderLog(state)` | ゲームログ描画 |
| `renderPhaseControls(state, myId)` | フェーズ表示・ドローボタン |
| `createCardElement(card, playable, onClickCb)` | カードDOM生成 |

### 2.6 modal.js  （main.js から分離）

モーダルUI・ターゲット選択・ロケーション効果UIを担当。

| 関数 | 説明 |
|------|------|
| `showTargetSelector(card, localState, myId, nameMap)` | プレイヤー/ロケーション選択モーダル表示 |
| `showMyCardSelector(card, targetId, hand, onSelect)` | 渡すカード選択モーダル |
| `showLocationPrompt(loc, state, myId, nameMap)` | ロケーション効果解決UI |
| `showEffectOverlay(event)` | 全画面エフェクトオーバーレイ表示（アクション・ロケーション・ドロー結果） |
| `showPrivateReveal(msg)` | プライベート情報トースト表示 |
| `showPublicReveal(msg)` | 公開情報トースト表示 |
| `showGameOver(winner)` | ゲームオーバーオーバーレイ表示 |
| `showToast(message, duration?)` | 汎用トースト通知 |
| `showError(message)` | エラートースト |

### 2.7 main.js

ゲーム画面のエントリポイント。`render.js` と `modal.js` を呼び出す。

#### export 関数

| 関数 | 説明 |
|------|------|
| `initGameScreen(playerIds, myId, isHost)` | lobby.js から呼ばれる。ハンドラ設定・初期state配信 |

#### 内部処理

```
onMessage(msg)
  STATE_UPDATE  → render.renderGame(msg.state, myId)
  PLAY_CARD     → [ホスト] handlePlayCard()
  RESOLVE_LOC   → [ホスト] handleResolveLoc()
  DECLARE_ARREST→ [ホスト] handleDeclareArrest()
  PRIVATE_REVEAL→ modal.showPrivateReveal()
  PUBLIC_REVEAL → modal.showPublicReveal()
  GAME_OVER     → modal.showGameOver()
```

---

## 3. データフロー（シーケンス）

### 3.1 カードプレイ（移動カード）

```
[プレイヤー] カードをクリック
  → render.onCardClick(card)
  → peer.sendPlayCard(cardId)
    → [ホスト] MSG.PLAY_CARD 受信
    → handlePlayCard()
      → [phase=draw] doDrawPhase() → broadcastState()
      → playCard(state, cardId)    → phase='location'
      → broadcastState()
    → [全員] MSG.STATE_UPDATE 受信
    → renderGame()
      → renderPhaseControls() → showLocationPrompt() 表示
  → [プレイヤー] ロケーション効果ボタンを押す
  → peer.sendResolveLoc(locType, chosenId?)
    → [ホスト] MSG.RESOLVE_LOC 受信
    → handleResolveLoc() → resolveLocationSync() → nextTurn()
    → broadcastState()
```

### 3.2 確保宣言（解除班勝利）

```
[解除班プレイヤー] 確保宣言ボタンを押す
  → peer.sendDeclareArrest()
    → [ホスト] MSG.DECLARE_ARREST 受信
    → declareArrest(state, fromId)
      → 解除キット全揃い & 同マスに爆弾魔 → winner='defuser'
    → broadcastState() + broadcastGameOver('defuser')
    → [全員] showGameOver()
```

---

## 4. セキュリティ方針

- **隠匿情報の保護**: ゲーム状態の配信は `sanitizeStateForPlayer()` により視点別に変換される。他プレイヤーの手札は `{hidden: true}` に置換し、役職 (`role`) フィールドは削除される。
- **手番外操作の拒否**: ホスト側の `handlePlayCard` / `handleResolveLoc` では `getCurrentPlayer(state).id !== fromId` の場合即時 return する。
- **XSS対策**: DOM操作では `innerHTML` に直接外部入力を渡さず、プレイヤー名等は `textContent` を使用する（`render.js` 分離後に徹底する）。

---

## 5. 既知の課題・TODO

| # | 優先度 | 内容 |
|---|--------|------|
| 1 | 中 | `横流し (pass)` がランダム実装になっている。本来は各プレイヤーが渡すカードを選ぶ仕様。pendingAction を使って全員の選択を集約するフローが必要 |
| 2 | 中 | `block` カードで `loc.id`（number）を `targetLocation` に渡しているが、`LOCATIONS` の `id` は index と同じ number なので問題ないが、型を統一すべき |
| 3 | 低 | ゲームオーバー後にロビーに戻っても「参加者一覧が前のまま残る」問題。ロビー初期化関数を追加する |
