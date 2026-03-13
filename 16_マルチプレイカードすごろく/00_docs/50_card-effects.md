# カード操作とエフェクト実装状況

> ソース調査日: 2026-03-13  
> 対象: `30_src/js/gameLogic.js` / `main.js` / `modal.js`

---

## 1. カード操作の全一覧

### 1-1. 入手（gainCard / gainCards / privateReveal でカード付き）

| # | 操作名 | 発生元 | 返り値キー | 受信者 | 現在のエフェクト | 状態 |
|---|---|---|---|---|---|---|
| 1 | **ドローフェーズ** | `doDrawPhase` | `drawnCard` | 本人のみ | `showDrawCardOverlay` | ✅ |
| 2 | **強奪** | action: `steal` | `gainCard` | 攻撃者 | `showDrawCardOverlay` | ✅ |
| 3 | **取引** | `resolveTradeChoice` | `gainCards[2]` | 両者それぞれ | `showDrawCardOverlay` | ✅ |
| 4 | **ジャンク屋** | loc: `junk` | `privateReveal(card)` | 本人のみ | `showDrawCardOverlay` | ✅ |
| 5 | **パーツ工場** | loc: `factory` | `gainCard` | 本人のみ | `showDrawCardOverlay` | ✅ |
| 6 | **カジノ（偶数）** | loc: `casino` | `gainCards[2]` | 本人のみ | `showDrawCardOverlay`（1枚目のみ） | ⚠️ 2枚目が見えない |
| 7 | **タワー** | loc: `tower` | `gainCard` | 本人のみ | `showDrawCardOverlay` | ✅ |
| 8 | **闇市** | loc: `black_mkt` | `gainCard` | 本人のみ | `showDrawCardOverlay` | ✅ |
| 9 | **裏路地** | loc: `alley` | `gainCard` | 本人のみ | `showDrawCardOverlay` | ✅ |
| 10 | **廃材置き場** | loc: `salvage` | `privateReveal(card)` | 本人のみ | `showDrawCardOverlay` | ✅ |
| 11 | **倉庫** | loc: `warehouse` | `privateReveal(card)` | 本人のみ | `showDrawCardOverlay` | ✅ |
| 12 | **放送局（ドロー分）** | loc: `broadcast` | なし ※ | 本人のみ | なし（publicRevealのToastのみ） | ❌ |
| 13 | **病院（引き直し5枚）** | loc: `hospital` | なし | 本人のみ | `showEffectOverlay`（テキストのみ） | ❌ |
| 14 | **酒場（交換で来る分）** | loc: `pub` | なし | 両者 | `showEffectOverlay`（テキストのみ） | ❌ |
| 15 | **スクランブル（来る分）** | loc: `crossing` | なし | 全員 | `showEffectOverlay`（テキストのみ） | ❌ |
| 16 | **ダッシュ（移動先効果）** | action: `dash` | なし | 本人のみ | なし | ❌ |

> ※ 放送局は `broadcast` の return に `publicReveal` しか含まれず、drawFromDeck で引いたカードは返り値に含まれていない。`gainCard` を追加する必要がある。

---

### 1-2. ロスト（lostCard）

| # | 操作名 | 発生元 | 返り値キー | 受信者 | 現在のエフェクト | 状態 |
|---|---|---|---|---|---|---|
| 1 | **ポイ捨て（被害者）** | action: `dump` | `lostCard` | 被害者 | `showDrawCardOverlay`（「捨てさせられた」タイトル） | ✅ |
| 2 | **煙幕（被害者）** | action: `smoke` | `lostCard` | 被害者 | `showDrawCardOverlay`（「移動カードを破棄された」）  | ✅ |
| 3 | **カジノ（奇数・没収）** | loc: `casino` | `lostCard` | 本人のみ | `showDrawCardOverlay`（「没収されました」タイトル） | ✅ |
| 4 | **交番（没収される側）** | loc: `police_box` | なし | 没収対象者 | なし | ❌ |
| 5 | **酒場（交換で去る分）** | loc: `pub` | なし | 両者 | `showEffectOverlay`（テキストのみ） | ❌ |
| 6 | **スクランブル（去る分）** | loc: `crossing` | なし | 全員 | `showEffectOverlay`（テキストのみ） | ❌ |

---

### 1-3. 参照のみ（privateReveal でカード内容を確認、自分の手札に入らない）

| # | 操作名 | 発生元 | 受信者 | 現在のエフェクト | 状態 |
|---|---|---|---|---|---|
| 1 | **尋問（peek）** | action: `peek` | 攻撃者 | `showEffectOverlay`（テキスト「こっそり確認した」のみ） | ❌ カード表示なし |
| 2 | **密談（whisper）** | action: `whisper` | 両者 | `showEffectOverlay`（テキストのみ） | ❌ カード表示なし |
| 3 | **探偵事務所** | loc: `detective` | 本人のみ | `showEffectOverlay`（「手札に○○がある」テキスト） | △ テキストは出る |
| 4 | **スキャン（scan）** | action: `scan` | 攻撃者 | `showEffectOverlay`（危険度ヒント） | ✅（役職情報のみでOK） |
| 5 | **探知機（detect）** | action: `detect` | 自分のみ | `showEffectOverlay`（精度・役職ラベル） | ✅ |
| 6 | **警察本部** | loc: `police_hq` | 本人のみ | `showEffectOverlay`（「○○は□□だ！」） | ✅ |
| 7 | **公開捜査（expose）** | action: `expose` | 全員 | `showToast`（全員公開メッセージ） | ✅（Toastで十分） |
| 8 | **放送局（公開分）** | loc: `broadcast` | 全員 | `showToast` | ✅（Toastで十分） |

---

## 2. 既存エフェクト一覧

### `showDrawCardOverlay(event)`  ← 入手演出

```
ソース: modal.js:461
HTML:   #draw-card-overlay
```

**アニメーション:**
1. 上から裏向きで落下・バウンス（`drcard-appear`）
2. 裏→表にフリップ（`drcard-flip`）
3. グロー放射 + 「タップして続ける」ヒント表示

**event オブジェクト:**
```js
{
  isDraw:    true,        // onMessage で showDrawCardOverlay に振り分けるフラグ
  card:      Card,        // カードオブジェクト（スプライト描画用）
  cardLabel: string,      // カード名
  cardDesc:  string,      // カード説明文
  cardType:  string,      // 'move' | 'action' | 'item'（色クラス切り替え）
  title:     string,      // オーバーレイ上部タイトル（今回追加済み: #drcard-title）
  body:      string,      // 未使用（desc と同内容になりやすい）
  icon:      string,      // タイトル横絵文字（未使用 → タイトルに含める運用でOK）
}
```

**補足:** `makeCardDrawEvent(card, title, body, icon)` でイベントを生成するヘルパー関数がある（`main.js:246`）。

---

### `showEffectOverlay(event)`  ← テキスト演出

```
ソース: modal.js:438
HTML:   #effect-overlay
```

**表示内容:** アイコン・タイトル・本文テキスト（`white-space: pre-wrap` で改行有効）  
**event オブジェクト:**
```js
{
  icon:  string,   // 絵文字アイコン
  title: string,
  body:  string,   // \n で改行可
}
```

---

### `showToast(msg, duration)` ← 右上一時通知

```
ソース: modal.js
```

全員公開（公開捜査・放送局）などの軽い通知に使用。

---

## 3. 新しく必要なエフェクト

### 3-1. `showLostCardOverlay(event)`  ← ロスト演出（未実装）

**要件:**  表向きのまま下から上に飛び去る  
**実装方針:**

```
#draw-card-overlay を流用 or 専用 #lost-card-overlay を追加
isDraw: false かつ isLost: true フラグで分岐
```

**アニメーション案:**
1. 表向きで中央に表示（`drcard-revealed` スタイル）
2. 0.6s で上方向にスライドアウト＋フェードアウト（新 `drcard-lost` CSS）
3. グロー放射はなし、赤みがかった演出

**`showLostCardOverlay` の event オブジェクト（既存と共通化可能）:**
```js
{
  isLost:    true,
  card:      Card,
  cardLabel: string,
  cardDesc:  string,
  cardType:  string,
  title:     string,   // 例: '😢 カジノ：没収…' / '🚔 交番：没収！'
}
```

---

### 3-2. 複数枚連続表示（キュー処理）

カジノ2枚ドロー・病院5枚引き直しなどのために、複数枚を順番に表示するキューが必要。

**実装方針:**
```js
// modal.js に追加
const overlayQueue = [];
let overlayPlaying = false;

export function enqueueCardOverlay(event) {
  overlayQueue.push(event);
  if (!overlayPlaying) flushOverlayQueue();
}

function flushOverlayQueue() {
  if (overlayQueue.length === 0) { overlayPlaying = false; return; }
  overlayPlaying = true;
  const ev = overlayQueue.shift();
  const show = ev.isLost ? showLostCardOverlay : showDrawCardOverlay;
  show(ev, flushOverlayQueue); // コールバックで次へ
}
```

`showDrawCardOverlay` / `showLostCardOverlay` に `onClose` コールバック引数を追加。

---

## 4. 各操作への推奨エフェクト対応表（To-Do）

### 🔴 優先度：高（カード内容が見えない問題）

| 操作 | 追加すべき処理 | 対象者 | 使うエフェクト |
|---|---|---|---|
| **交番（没収される側）** | `lostCard` を return に追加 + `events[target]` に設定 | 没収される側 | `showLostCardOverlay` |
| **放送局（ドロー分）** | `gainCard` を return に追加 + `events[fromId]` に設定 | 本人のみ | `showDrawCardOverlay` |
| **カジノ（偶数・2枚目）** | `enqueueCardOverlay` で2枚分キュー | 本人のみ | 連続 `showDrawCardOverlay` |

### 🟡 優先度：中（交換系でどちらが何を得たか見えない）

| 操作 | 追加すべき処理 | 対象者 | 使うエフェクト |
|---|---|---|---|
| **酒場** | `gainCard`/`lostCard` を return に追加 | 両者それぞれ | `showDrawCardOverlay` + `showLostCardOverlay` |
| **スクランブル交差点** | `gainCards` を return に追加（全員分） | 全員それぞれ | `showDrawCardOverlay` |
| **病院（引き直し）** | `gainCards` を return に追加（最大5枚） | 本人のみ | 連続 `showDrawCardOverlay` |

### 🟢 優先度：低（情報は伝わっているが演出を揃えたい）

| 操作 | 追加すべき処理 | 対象者 | 使うエフェクト |
|---|---|---|---|
| **尋問（peek）** | `privateReveal` を `showDrawCardOverlay` で表示 | 攻撃者 | `showDrawCardOverlay`（参照専用タイトル付き） |
| **密談（whisper）** | `privateReveal` を `showDrawCardOverlay` で表示（両者） | 両者 | `showDrawCardOverlay` |
| **探偵事務所** | 現在 effectOverlay → `showDrawCardOverlay` に変更 | 本人のみ | `showDrawCardOverlay` |

---

## 5. イベントオブジェクトのフラグ設計（統一案）

`onMessage` → エフェクト振り分けを現在の2分岐から3分岐に拡張する。

```js
// main.js: onMessage の STATE_UPDATE 内
if (msg.event) {
  if      (msg.event.isDraw) showDrawCardOverlay(msg.event);   // 既存：入手
  else if (msg.event.isLost) showLostCardOverlay(msg.event);   // NEW：ロスト
  else                       showEffectOverlay(msg.event);     // 既存：その他
}
```

`makeCardDrawEvent` に対応する `makeCardLostEvent(card, title, icon)` ヘルパーも追加するとよい。

```js
// main.js に追加
function makeCardLostEvent(card, title, icon) {
  return { isLost: true, card, cardLabel: card.label, cardDesc: card.desc, cardType: card.type, icon, title };
}
```
