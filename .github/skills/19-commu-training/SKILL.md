---
name: 19-commu-training
description: >
  コミュニケーション診断ツール（commu-checker）の各タイプ向け、90日トレーニングコンテンツを生成するスキル。
  ユーザーが「D1型のトレーニングを作って」「〇〇型の90日プランを作りたい」「training-data.jsに追加したい」
  「コミュ診断のトレーニングページ」などと言ったときに必ず使う。
  タイプ定義・観察メモを受け取り、既存サイト（M PLUS Rounded 1c・グリーン基調・Material Icons）に合わせた
  インタラクティブなチェックリスト用HTMLコンテンツを training-data.js の TRAINING_PAGES オブジェクトに追加する形で出力する。
  トレーニングは trainings/index.html + trainings/training-app.js + trainings/training-data.js の3ファイル構成。
  個別の <type>.html は存在せず、URL の ?type=d1 などのパラメータで表示タイプを切り替える。
---

# commu-training スキル

コミュニケーション診断ツールの各タイプ向け **90日トレーニングコンテンツ** を生成する。

## このスキルが生成するもの

- **対象**: `trainings/training-data.js` の `TRAINING_PAGES` オブジェクトに追加するエントリ
- **ファイル構成**（変更不要・既存を参照する）:
  - `trainings/index.html` — 全タイプ共通のシェル HTML（変更不要）
  - `trainings/training-app.js` — 共通ロジック（変更不要）
  - `trainings/training-data.js` — **ここにタイプ別コンテンツを追加する**
- **デザイン**: 既存サイト（style.css）と共通のデザイントークン + **Material Icons Round**
- **機能**: 4フェーズ×週単位チェックリスト / チェック時アニメ / 進捗バー / フェーズ完了バナー / localStorageによる状態保存（チェック日時記録・90日分保持・自動クリーンアップ） / 提出用URL生成（`?check=xxxxxxxx`）

参照: `references/design-system.md`（デザイントークン・コンポーネント詳細）  
参照: `references/content-guide.md`（フェーズ設計・コンテンツ作成ガイド）

---

## ワークフロー

### Step 1 — 入力を収集する

以下を確認する。不足していたら質問する。

| 必須 | 内容 |
|------|------|
| ✅ | タイプID（例: D1, R3, S2）とタイプ名 |
| ✅ | タイプの特徴・概要（1〜3文） |
| ✅ | 有効なアプローチ（3つ以上）|
| ✅ | 効きにくいアプローチ（2つ以上）|
| 任意 | 観察メモ（実際の行動パターン・具体的なシーン） |

観察メモがあれば **Week 1〜3の具体的なタスク** に反映する。なければdata.jsの内容から推定する。

### Step 2 — Insightダイアグラムを設計する

タイプの「今起きていること」を視覚化する図を設計する。

- D1型の例: 報告の射程が広がりすぎる図（概要→詳細→脱線）
- R3型なら: 情報が時間で消えていく図
- S1型なら: 情報が整理されずに積み上がる図

タイプの特徴を一目で「自分のことだ」と思えるビジュアルにする。  
SVG・CSSポジションを使った図でよい。複雑にしすぎない。

### Step 3 — 4フェーズの内容を設計する

`references/content-guide.md` のフェーズ設計ガイドを読んでから設計する。

**骨格（週数はタイプにより調整可）**:

| フェーズ | 週数 | テーマ | メンター関与 |
|---------|------|--------|------------|
| PHASE 1 | 1〜3週 | 「知る・体験する」 | 高（毎週確認）|
| PHASE 2 | 4〜7週 | 「一人で試す」 | 中（週1振り返り）|
| PHASE 3 | 8〜11週 | 「定着させる」 | 低（2週に1回）|
| PHASE 4 | 12〜13週 | 「手離れ確認」 | 最小（卒業判定のみ）|

**各週に必要な要素**:
- 週タイトル（短く・行動動詞で）
- 週サブタイトル（なぜこれをやるか）
- 今週のゴール（1文・評価基準が明確）
- チェック項目（2〜4個・YesかNoで判断できる粒度）
- TipまたはMentor note（どちらか1つ以上）

**チェック項目の書き方（日次アクション）**:

チェック項目は「**その日に1回実行すれば✓できる**」粒度の日次アクションで書く。  
「週に〇回やった」ではなく「今日〇〇した」という記録として機能させる。

- ✅ 「今日、文章を書く前に読み手の名前を書き出した」— 今日やったか/やっていないか
- ✅ 「今日の指示をその場で3点メモした（何を・いつ・どこまで）」— 1回の行動
- ✅ 「今日、提出前にセルフチェックリストを使った」— 1アクション
- ❌ 「今週3回〇〇した」— 週次集計は日次チェックに合わない
- ❌ 「対策を1つ追加した」「1つ増やした」— 無限に増やせる設問はNG
- ❌ 「意識を高める」— 観察できない・YesNoで判断できない
- ❌ 「うまくできるようになる」— 達成基準が曖昧

**ゴール文の書き方**:  
週ゴールは「今週を通じて達成したい状態」を1文で書く。チェック項目は毎日そこに近づくための行動。

**文体ルール（M系は特に厳守）**:
- 小学生でも読める平易な日本語を優先する
- 長い専門語を避ける（必要なら短い言い換えを使う）
- 1文は短く、1チェック1動詞を基本にする

**デザインルール（再発防止）**:
- `.type-hero-sub` に `max-width` を付けない（横幅制限しない）
- `.check-text` は折り返し崩れ防止のため以下を必須とする
  `flex: 1 0 auto; min-width: 0; overflow-wrap: break-word; word-break: normal; text-wrap: pretty;`

### Step 4 — コンテンツを生成する

`references/design-system.md` のコンポーネント仕様に従って `mainHtml` を生成する。

**`training-data.js` への追記形式**:

```js
// TRAINING_PAGES オブジェクトに以下エントリを追加
TRAINING_PAGES['<type-id>'] = {
  label: '【タイプID大文字】',
  title: '【タイプID】型 10週間トレーニング｜コミュ力診断',
  tone: { bg: '【--tone-X-bg の値】', border: '【--tone-X-border の値】', text: '【--tone-X-text の値】' },
  bgIcon: '【material_icon_name】',   // type-hero-bg-icon に使うMaterial Icon名
  eyebrowIcon: '【material_icon_name】',  // type-eyebrow に使うMaterial Icon名
  mainHtml: `
    <!-- TYPE HERO -->
    <div class="type-hero">
      <span class="type-hero-bg-icon material-icons-round" aria-hidden="true">【material_icon_name】</span>
      <div class="type-eyebrow">
        <span class="material-icons-round icon-sm">【material_icon_name】</span>
        【タイプID】 — 【グループ名】
      </div>
      <div class="type-hero-title">【タイプ名】型</div>
      <div class="type-hero-sub">
        【特徴の説明。2〜3文。】
      </div>
    </div>
    <!-- INSIGHT BOX -->
    <!-- PROGRESS OVERVIEW -->
    <!-- HEATMAP -->
    <!-- SHARE BUTTON -->
    <!-- PHASE 1〜4 週ブロック -->
    <!-- 卒業セクション -->
  `,
};
```

**必須チェック**:
- [ ] `TOTAL_CHECKS` の値が実際のチェック項目数と一致している（training-app.js が参照するため `mainHtml` 内の check-item 数を数える）
- [ ] `WEEK_TOTALS` オブジェクトの各週の数値が正確
- [ ] `PHASE_WEEKS` が正しい週IDを参照している
- [ ] `WEEK_ORDER` が全週IDを順番通りに列挙している
- [ ] `autoOpenNext()` が `toggleCheck()` 内で呼び出されている
- [ ] localStorageキーが型ごとに一意（例: `commu-checker-d1-history`）
- [ ] アイコンは絵文字ではなく **Material Icons Round** を使う（`<span class="material-icons-round">icon_name</span>`）
- [ ] insightダイアグラムがタイプの特徴を正確に表している
- [ ] Tip / Mentor note に他タイプの固有文言が混入していない
- [ ] type-eyebrow / title / insight / tip が対象タイプと一貫している

---

## データ設計 / 提出URL仕様

### localStorageのデータ形式

チェック状態はチェックIDをキー、チェック日（ISO 8601 `YYYY-MM-DD`）を値とするオブジェクトで保存する。

保存キー命名規約は `commu-checker-<type-id-lowercase>-history`（例: `commu-checker-d1-history`）。
型ごとに必ずキーを分離し、衝突を防ぐ。

```js
// キー例: "commu-checker-d1-history"
// 値（JSON）:
{
  "week-1-0": "2026-05-16",  // 最後にチェックした日付
  "week-1-1": "2026-05-15",  // 昨日チェック → 今日は「剥がれた状態」
  "week-2-0": "2026-05-16"
}
```

**チェック状態の3段階**:
- **未チェック**: 白い空ボックス（キーなし or 過去日 → 今日まだ触っていない）
- **今日チェック済み**: 緑ボックス（`state[key] === today()`）
- **剥がれた状態（past-checked）**: 薄いグレー枠・グレー ✓・テキストも薄く — 前日以前にチェックしたが今日はまだ

チェックは「**今日やった習慣の記録**」。毎日アプリを開くと全チェックが剥がれた状態で始まる。  
**進捗バー = 今日チェックした数 / 全項目数**。  
**卒業 = 全項目を同じ日にチェック完了**（最終日に上から下まで全部チェック）。

**90日クリーンアップ**: ページ読み込み時に、保存日が今日から90日以上前のエントリを削除する。

```js
function cleanOldChecks(data) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 90);
  const cutoffStr = cutoff.toISOString().slice(0, 10); // "YYYY-MM-DD"
  return Object.fromEntries(
    Object.entries(data).filter(([, date]) => date >= cutoffStr)
  );
}
```

### ヒートマップ（`#heatmap-grid`）

GitHub風のチェック記録カレンダー。進捗バーの上、共有ボタンの直前に配置する。

**表示仕様**:
- 13列 × 7行のグリッド（= 91日分、左が古く右が今日）
- 各セルの色: チェックなし→`#EBEBEB` / 1件→淡緑 / 2件→中緑 / 3件→メイングリーン / 4件以上→濃緑
- 未来日はセルを透明にする
- ホバーで `YYYY-MM-DD: N件チェック` のtooltipを表示

**ストリーク**: 今日から遡って連続チェック日数を集計し `🔥 N日連続` バッジで表示（0日なら非表示）

**アクティブ集計**: チェックした日数と総チェック数を `N日間・計Nチェック` で表示

**描画関数の骨格**:

```js
function renderHeatmap() {
  const state = isViewer ? viewerData : getState();
  // 日付ごとのチェック数を集計
  const dateCounts = {};
  Object.values(state).forEach(date => {
    if (date) dateCounts[date] = (dateCounts[date] || 0) + 1;
  });
  // 起点: 今日から90日前の直前の日曜
  const todayD = new Date(); todayD.setHours(0,0,0,0);
  const start = new Date(todayD);
  start.setDate(start.getDate() - 90 - start.getDay());
  // 13週 × 7日のセルを生成
  const cursor = new Date(start);
  for (let w = 0; w < 13; w++) {
    const col = document.createElement('div');
    col.className = 'heatmap-col';
    for (let d = 0; d < 7; d++) {
      const ds = cursor.toISOString().slice(0, 10);
      const cell = document.createElement('div');
      const isFuture = cursor > todayD;
      cell.className = isFuture ? 'heatmap-cell future'
        : `heatmap-cell level-${Math.min(dateCounts[ds] || 0, 4)}`;
      if (!isFuture) cell.title = `${ds}：${dateCounts[ds] || 0}件`;
      col.appendChild(cell);
      cursor.setDate(cursor.getDate() + 1);
    }
    grid.appendChild(col);
  }
  // ストリーク計算（今日から遡る）
  let streak = 0, d2 = new Date(todayD);
  while (dateCounts[d2.toISOString().slice(0,10)]) {
    streak++; d2.setDate(d2.getDate() - 1);
  }
}
```

`renderHeatmap()` は `renderAll()` の末尾で必ず呼び出す。

### 週の自動展開（`WEEK_ORDER` / `autoOpenNext`）

週ブロックの全チェックを「今日」完了した瞬間、**次の週ブロックを自動で展開してスクロール**する。

```js
const WEEK_ORDER = ['week-1','week-2','week-3','week-4','week-5','week-6','week-7','week-8','week-10','week-12'];

function autoOpenNext(weekId) {
  const state = getState();
  const todayStr = today();
  const total = WEEK_TOTALS[weekId];
  let doneToday = 0;
  for (let i = 0; i < total; i++) {
    if (state[checkKey(weekId, i)] === todayStr) doneToday++;
  }
  if (doneToday >= total) {
    const idx = WEEK_ORDER.indexOf(weekId);
    if (idx >= 0 && idx < WEEK_ORDER.length - 1) {
      const nextId = WEEK_ORDER[idx + 1];
      const nextBlock = document.getElementById(nextId);
      if (nextBlock && !nextBlock.classList.contains('open')) {
        setTimeout(() => {
          nextBlock.classList.add('open');
          nextBlock.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 350);
      }
    }
  }
}
```

`autoOpenNext(weekId)` は `toggleCheck()` の末尾で、チェックを **付けた時のみ** 呼び出す（外した時はスキップ）。

```js
function toggleCheck(el, weekId, idx) {
  // ...既存コード...
  saveState(state);
  renderAll();
  // チェック完了時に次週を自動展開
  if (state[key] === today()) autoOpenNext(weekId);
}
```

### 提出用URL（`?check=xxxxxxxx`）

チェック状態＋チェック日をまとめてエンコードし、URLクエリパラメータとして付与する。  
メンターはURLを開くだけで **何をいつチェックしたか（進捗ペース）** を確認できる。

**エンコード手順**:

```js
function buildShareURL(data) {
  // data = { "w1-c0": "2026-05-16", ... }
  // "チェックID:日付" を "|" で連結 → UTF-8 → Base64url
  const payload = Object.entries(data)
    .map(([id, date]) => `${id}:${date}`)
    .join('|');
  const encoded = btoa(unescape(encodeURIComponent(payload)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, ''); // Base64url
  return `${location.origin}${location.pathname}?check=${encoded}`;
}
```

**デコード手順（参考：メンター確認ページ側）**:

```js
function parseShareURL(encoded) {
  const raw = decodeURIComponent(escape(atob(
    encoded.replace(/-/g, '+').replace(/_/g, '/')
  )));
  return Object.fromEntries(raw.split('|').map(e => e.split(':')));
}
```

**「メンターに共有」ボタンのUI要件**:
- ボタンラベル: 「メンターに共有」
- クリック時: `buildShareURL()` でURL生成 → `navigator.clipboard.writeText()` でコピー
- コピー成功時: ボタンラベルを「コピーしました！」に一時変更（2秒後に戻す）
- 配置: 進捗バーの近く（ページ上部 or 各フェーズ末尾）
- `?check=` パラメータがURLに存在する場合はページ読み込み時にデコードして **閲覧専用モード** で表示する（チェック操作は無効化）

### Step 5 — 出力する

`training-data.js` の `TRAINING_PAGES` オブジェクトに追記するコードブロックを出力し、
`present_files` で渡す。ファイルパスは `trainings/training-data.js`。

追加後のアクセス URL: `trainings/index.html?type=<type-id>`（例: `trainings/index.html?type=d1`）

---

## よくあるミスと対処

| ミス | 対処 |
|------|------|
| TOTAL_CHECKSが実際の数と合わない | Step 4生成後に全checkリストを数えて検算する |
| フェーズバナーが出ない | PHASE_WEEKSの週IDとHTMLのidが一致しているか確認 |
| チェックが保存されない | localStorageキーのタイポ確認 |
| デザインが既存サイトと乖離する | design-system.mdのCSS変数・フォント設定を再確認 |
| チェック項目が抽象的すぎる | 「いつ・何回・誰に」を明示する粒度に書き直す |
| localStorageに日付が保存されない | チェック時に `new Date().toISOString().slice(0,10)` を値として保存しているか確認 |
| 90日クリーンアップが動かない | `cleanOldChecks()` を `DOMContentLoaded` 内で呼び出し、結果を再保存しているか確認 |
| 共有URLが長すぎる | チェック項目数が多い場合は正常。Base64urlなので改行・空白は入らない |
| `?check=` パラメータがあるのに閲覧専用にならない | `URLSearchParams` でパラメータ取得後、チェックboxを `disabled` にする処理を確認 |
| 次の週が自動展開しない | `WEEK_ORDER` に該当週IDが含まれているか・`autoOpenNext()` 呼び出しがチェック付与の後かを確認 |
| チェック項目が週次の表現になっている | 「今日〇〇した」という日次アクションに書き直す。「今週〇回」は使わない |
| D2ページにD1のヒント文が残る | 最終確認で `tip-label` と `tip-box` をタイプ視点で全文読みし、他タイプ名・比喩（例: 回路）を除去する |
| 設問が難しくて実行できない | M系は平易な語彙へ置換し、短文化する。抽象語（裁量/評価軸/最適化）は具体語に言い換える |
| 設問が無限に増やせる | 「追加する/増やす」系の文言を禁止し、「確認した/実施した/報告した」に置換する |
| hero-sub が狭く見える | `.type-hero-sub` の `max-width` を削除する |
| check-text の改行位置が不自然 | `.check-text` に `flex:1 0 auto; min-width:0; text-wrap:pretty` を設定する |
