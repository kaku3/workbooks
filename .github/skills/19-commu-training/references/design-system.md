# デザインシステム リファレンス

既存サイト（commu-checker）のデザイントークンとコンポーネントをインライン再実装するための仕様。

---

## デザイン原則（Circleboom参考）

Circleboom（https://circleboom.com/twitter-management-tool）のデザイン言語を参考にした以下の原則を採用する。

1. **Keep it simple** — 使われる機能だけ作る。不要な装飾は排除。
2. **Intuitive Design** — 説明なしで操作できる直感的UI。アイコンで意味を補完。
3. **Clean Cards** — 白背景＋細いボーダー＋角丸カードでコンテンツを構造化。
4. **Bold CTA** — CTAボタンは solid + 高コントラストで埋没させない。
5. **Numbered Steps** — ステップ番号（01, 02, 03）で手順の流れを視覚化。
6. **Sticky Nav** — ヘッダーは sticky で常に見える状態を維持。

---

## アイコン — Material Icons

絵文字の代わりに **Google Material Icons** を使う。

```html
<!-- <head> に追加 -->
<link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" rel="stylesheet">
```

使い方:
```html
<span class="material-icons-round">navigation</span>
<span class="material-icons-round" style="font-size:20px;color:var(--green)">check_circle</span>
```

### アイコン対応表（絵文字 → Material Icons）

| 用途 | 絵文字（旧） | Material Icons（新） | コード |
|------|-------------|---------------------|--------|
| サイトロゴ | 🧭 | `navigation` | `<span class="material-icons-round">navigation</span>` |
| 診断（nav） | — | `quiz` | `<span class="material-icons-round">quiz</span>` |
| タイプ一覧（nav） | — | `grid_view` | `<span class="material-icons-round">grid_view</span>` |
| トレーニング（nav） | — | `fitness_center` | `<span class="material-icons-round">fitness_center</span>` |
| 履歴（nav） | — | `history` | `<span class="material-icons-round">history</span>` |
| チェック完了 | ✓ | `check` | `<span class="material-icons-round">check</span>` |
| 共有ボタン | 📤 | `share` | `<span class="material-icons-round">share</span>` |
| 週矢印（展開） | ▾ | `expand_more` | `<span class="material-icons-round">expand_more</span>` |
| ヒートマップ | 📅 | `calendar_month` | `<span class="material-icons-round">calendar_month</span>` |
| Tip | 💡 | `lightbulb` | `<span class="material-icons-round">lightbulb</span>` |
| メンター向け | 🧭 | `support_agent` | `<span class="material-icons-round">support_agent</span>` |
| ゴール | — | `flag` | `<span class="material-icons-round">flag</span>` |
| Insightタイトル | 📐 | `analytics` | `<span class="material-icons-round">analytics</span>` |
| フェーズ完了 | ✅ | `task_alt` | `<span class="material-icons-round">task_alt</span>` |
| 卒業バナー | 🎉 | `celebration` | `<span class="material-icons-round">celebration</span>` |
| D1/D2グループ | 🔌 | `power` | `<span class="material-icons-round">power</span>` |
| M1/M2グループ | — | `rocket_launch` | `<span class="material-icons-round">rocket_launch</span>` |
| R1/R2/R3グループ | — | `hearing` | `<span class="material-icons-round">hearing</span>` |
| S1/S2/S3グループ | — | `sort` | `<span class="material-icons-round">sort</span>` |

CSS（サイズ統一用）:
```css
.material-icons-round {
  font-size: inherit;
  line-height: 1;
  vertical-align: middle;
}
.icon-sm { font-size: 16px; }
.icon-md { font-size: 20px; }
.icon-lg { font-size: 28px; }
```

---

## CSS変数・フォント

```css
@import url('https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;500;700;800&display=swap');

:root {
  --green: #1D9E75;
  --green-dark: #0e7a58;
  --green-light: #E1F5EE;
  --amber: #E97B2A;
  --amber-light: #FEF3E2;
  --blue: #378ADD;
  --blue-light: #E6F1FB;
  --red: #E24B4A;
  --bg: #F7F7F4;
  --white: #FFFFFF;
  --text: #1a1a1a;
  --text-sub: #555;
  --text-muted: #999;
  --border: #E5E5E2;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 20px;
  --shadow-sm: 0 1px 4px rgba(0,0,0,.07);
  --shadow-md: 0 4px 16px rgba(0,0,0,.1);

  /* タイプグループカラー */
  --tone-d-bg: #eaf6fb;       /* 組み立てグループ（D1,D2） */
  --tone-d-border: #d0e7f2;
  --tone-d-text: #0C447C;
  --tone-m-bg: #fdf2ea;       /* 動機グループ（M1,M2） */
  --tone-m-border: #f1d8c6;
  --tone-m-text: #6B2A0F;
  --tone-s-bg: #f8ecff;       /* 整理グループ（S1,S2,S3） */
  --tone-s-border: #e8cffd;
  --tone-s-text: #3C3489;
  --tone-r-bg: #e8f1ff;       /* 受信グループ（R1,R2,R3） */
  --tone-r-border: #ccddfb;
  --tone-r-text: #163080;
  --tone-z-bg: #eff9f5;       /* 良好（Z） */
}

body {
  font-family: 'M PLUS Rounded 1c', -apple-system, BlinkMacSystemFont,
               'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Yu Gothic', sans-serif;
  background: var(--bg);
  color: var(--text);
  line-height: 1.6;
}
```

## タイプ別カラーの選び方

| タイプID | グループ | --tone-X-bg | --tone-X-border | --tone-X-text |
|---------|---------|-------------|----------------|--------------|
| D1, D2 | 組み立て | tone-d-bg | tone-d-border | tone-d-text |
| M1, M2 | 動機 | tone-m-bg | tone-m-border | tone-m-text |
| S1, S2, S3 | 整理 | tone-s-bg | tone-s-border | tone-s-text |
| R1, R2, R3 | 受信 | tone-r-bg | tone-r-border | tone-r-text |
| Z | 良好 | tone-z-bg | green-light | green-dark |

フェーズカラー（week-blockの左ボーダー）:
- PHASE 1: `#378ADD`（青）
- PHASE 2: `#E97B2A`（アンバー）
- PHASE 3: `#1D9E75`（グリーン）
- PHASE 4: `#9B59B6`（パープル）

---

## コンポーネント仕様

### サイトヘッダー

```html
<header class="site-header">
  <a class="site-logo" href="../index.html">
    <span class="material-icons-round icon-md">navigation</span> コミュ力診断
  </a>
  <nav class="site-nav">
    <a class="nav-link" href="../check.html">
      <span class="material-icons-round icon-sm">quiz</span> 診断
    </a>
    <a class="nav-link" href="../types.html">
      <span class="material-icons-round icon-sm">grid_view</span> タイプ一覧
    </a>
  </nav>
</header>
```

hrefは必ず `../` から始める（trainings/サブフォルダ想定）。

trainings/index.html 用（同階層のリンク）:
```html
<header class="site-header">
  <a class="site-logo" href="../index.html">
    <span class="material-icons-round icon-md">navigation</span> コミュ力診断
  </a>
  <nav class="site-nav">
    <a class="nav-link" href="../check.html">
      <span class="material-icons-round icon-sm">quiz</span> 診断
    </a>
    <a class="nav-link" href="../types.html">
      <span class="material-icons-round icon-sm">grid_view</span> タイプ一覧
    </a>
    <a class="nav-link active" href="index.html">
      <span class="material-icons-round icon-sm">fitness_center</span> トレーニング
    </a>
  </nav>
</header>
```

### タイプヒーロー

タイプの概要・説明を表示する冒頭セクション。

```html
<div class="type-hero">
  <!-- 右上に大きなアイコンを薄く（::before疑似要素では Material Icons は使えないため span で実装） -->
  <span class="type-hero-bg-icon material-icons-round" aria-hidden="true">【material_icon_name】</span>
  <div class="type-eyebrow">
    <span class="material-icons-round icon-sm">【material_icon_name】</span>
    【タイプID】 — 【グループ名】
  </div>
  <div class="type-hero-title">【タイプ名】型</div>
  <div class="type-hero-sub">
    【特徴の説明。2〜3文。最後に「このトレーニングでは〜を目指します」で締める】
  </div>
</div>
```

CSS:
```css
.type-hero {
  background: var(--tone-X-bg);  /* タイプに合わせる */
  border: 1.5px solid var(--tone-X-border);
  border-radius: var(--radius-lg);
  padding: 28px 24px 24px;
  margin-bottom: 28px;
  position: relative; overflow: hidden;
}
/* 背景アイコン: ::before ではなく .type-hero-bg-icon span で実装 */
.type-hero-bg-icon {
  position: absolute; right: 16px; top: 16px;
  font-size: 72px; opacity: .08; line-height: 1;
  pointer-events: none; user-select: none;
  color: var(--tone-X-text);
}
.type-eyebrow {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 11px; font-weight: 700; letter-spacing: .07em;
  background: var(--tone-X-border); color: var(--tone-X-text);
  padding: 3px 10px; border-radius: 20px; margin-bottom: 10px;
}
.type-hero-title { font-size: 22px; font-weight: 800; margin-bottom: 6px; }
/* max-width は付けない — 横幅を制限しない */
.type-hero-sub { font-size: 14px; color: var(--text-sub); line-height: 1.75; }
```

### Insightボックス

「今起きていること」を視覚化するボックス。タイプごとに図の内容を変える。

```html
<div class="insight-box">
  <div class="insight-title">
    <span class="material-icons-round icon-sm">analytics</span> 今起きていること
  </div>
  <!-- ここにタイプ固有のSVG or CSS図 -->
  <div class="insight-desc">
    【タイプの問題の本質を1〜2文で。「悪意ではなく〜」「ゴールは〜」で締める】
  </div>
</div>
```

### フェーズチップ（進捗概観）

```html
<div class="progress-overview">
  <div class="phase-chip active" id="chip-1" onclick="scrollToPhase(1)">
    <div class="phase-chip-label">PHASE 1</div>
    <div class="phase-chip-week">1〜3週</div>
    <div class="phase-chip-name">【フェーズ名】</div>
    <div class="phase-done-mark">✅</div>
  </div>
  <!-- PHASE 2〜4も同様 -->
</div>
```

### 週ブロック（展開式）

```html
<div class="week-block phase-1" id="week-1">
  <div class="week-head" onclick="toggleWeek('week-1')">
    <div class="week-num">WK 1</div>
    <div class="week-title-wrap">
      <div class="week-title">【週タイトル：行動動詞で短く】</div>
      <div class="week-sub">【なぜこれをやるかを一言で】</div>
    </div>
    <div class="week-check-count" id="cnt-week-1">0/3</div>
    <div class="week-arrow">
      <span class="material-icons-round">expand_more</span>
    </div>
  </div>
  <div class="week-body">
    <div class="week-goal">
      <span class="material-icons-round icon-sm" style="color:var(--green)">flag</span>
      <strong>今週のゴール：</strong>【評価基準が明確な1文】
    </div>
    <div class="check-list" id="checks-week-1">
      <div class="check-item" onclick="toggleCheck(this,'week-1',0)">
        <div class="check-box">
          <span class="material-icons-round">check</span>
        </div>
        <div class="check-text">【チェック項目】</div>
      </div>
      <!-- 2〜4個 -->
    </div>
    <!-- tip-box または mentor-note を1つ以上 -->
    <div class="tip-box">
      <div class="tip-label">
        <span class="material-icons-round icon-sm">lightbulb</span> 【タイトル】
      </div>
      【説明。2〜3文。】
    </div>
    <div class="mentor-note">
      <div class="mentor-label">
        <span class="material-icons-round icon-sm">support_agent</span> メンター向け
      </div>
      【メンターが1on1で使えるヒント。具体的な問いかけを含める。】
    </div>
  </div>
</div>
```

`phase-1`〜`phase-4`クラスで左ボーダーカラーが変わる。

### フェーズ完了バナー

各フェーズの最後に配置。JSで`.visible`クラスをつけてフェードイン。

```html
<div class="phase-banner" id="banner-1">
  <div class="phase-banner-icon">
    <span class="material-icons-round">celebration</span>
  </div>
  <div class="phase-banner-text">
    <div class="phase-banner-title">PHASE 1 完了！</div>
    <div class="phase-banner-sub">【次フェーズへの橋渡し一文】</div>
  </div>
</div>
```

### 卒業セクション

全チェック完了時のみ表示（JSで`display:none`→`display:block`）。

```html
<div class="grad-section" id="grad-section" style="display:none">
  <div class="grad-icon">
    <span class="material-icons-round" style="font-size:48px">workspace_premium</span>
  </div>
  <div class="grad-title">90日間、お疲れさまでした！</div>
  <div class="grad-sub">【このタイプ向けの締めのメッセージ】</div>
</div>
```

### シェアボタン

```html
<div class="share-wrap">
  <button class="share-btn" id="share-btn" onclick="shareProgress()">
    <span class="material-icons-round icon-sm">share</span> メンターに共有
  </button>
</div>
```

### Sticky進捗バー

bodyの末尾に固定配置。

```html
<div class="sticky-bar">
  <div class="sticky-left">
    <div class="sticky-label" id="sticky-label">進捗 0 / 【TOTAL】 完了</div>
    <div class="sticky-track">
      <div class="sticky-fill" id="sticky-fill" style="width:0%"></div>
    </div>
  </div>
  <div class="sticky-count" id="sticky-pct">0%</div>
</div>
```

---

## JavaScript構造

```javascript
const TOTAL_CHECKS = 【全チェック項目数・必ず正確に】;

// 各週のチェック数。HTMLのcheck-itemと必ず一致させる
const WEEK_TOTALS = {
  'week-1': 3, 'week-2': 3, 'week-3': 3,
  'week-4': 3, 'week-5': 3, 'week-6': 3, 'week-7': 2,
  'week-8': 3, 'week-10': 3,
  'week-12': 3
};

// フェーズに属する週IDの配列
const PHASE_WEEKS = {
  1: ['week-1','week-2','week-3'],
  2: ['week-4','week-5','week-6','week-7'],
  3: ['week-8','week-10'],
  4: ['week-12']
};

// localStorageキーはタイプIDを含める
function getState() {
  try { return JSON.parse(localStorage.getItem('【type-id】-training') || '{}'); }
  catch { return {}; }
}
function saveState(s) {
  try { localStorage.setItem('【type-id】-training', JSON.stringify(s)); }
  catch {}
}
```

### チェックキー形式

`${weekId}-${index}` 形式で保存。例: `'week-1-0'`, `'week-1-1'`

### バーストアニメ（チェック時）

チェックを入れた要素の位置からカラフルな粒をアニメで飛ばす。  
14個のdivをconfetti-wrapに追加し、Web Animations APIでアニメ後に削除する。

```javascript
function burst(el) {
  const wrap = document.getElementById('confetti-wrap');
  const rect = el.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const colors = ['#1D9E75','#378ADD','#E97B2A','#E24B4A','#9B59B6'];
  for (let i = 0; i < 14; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-piece';
    p.style.cssText = `left:${cx}px;top:${cy}px;background:${colors[i%colors.length]};
      border-radius:${Math.random()>.5?'50%':'2px'};position:absolute;
      width:8px;height:8px;opacity:0;`;
    wrap.appendChild(p);
    const angle = (i / 14) * 360;
    const dist = 60 + Math.random() * 60;
    const dx = Math.cos(angle * Math.PI / 180) * dist;
    const dy = Math.sin(angle * Math.PI / 180) * dist - 20;
    p.animate([
      {transform:'translate(-50%,-50%) scale(1)',opacity:1},
      {transform:`translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px)) scale(0) rotate(${Math.random()*360}deg)`,opacity:0}
    ], {duration:600,easing:'cubic-bezier(0,.9,.57,1)',fill:'forwards'})
      .onfinish = () => p.remove();
  }
}
```

---

## CSSキークラス一覧

| クラス | 用途 |
|-------|------|
| `.type-hero` | タイプ説明ヒーロー |
| `.type-eyebrow` | タイプIDバッジ |
| `.insight-box` | 診断図ボックス |
| `.progress-overview` | フェーズチップグリッド |
| `.phase-chip` | フェーズ概観チップ（`.active` `.done`） |
| `.section-heading` | セクション見出し |
| `.week-block` | 週展開ブロック（`.phase-1`〜`.phase-4` `.open`） |
| `.week-head` | クリックで展開するヘッダー |
| `.week-body` | 展開コンテンツ（`.open`時display:block） |
| `.week-goal` | 今週のゴール |
| `.check-list` | チェック項目コンテナ |
| `.check-item` | 個別チェック（`.checked` `.checking`） |
| `.check-box` | チェックマークボックス |
| `.tip-box` | 青いTipボックス |
| `.mentor-note` | アンバーのメンター向けメモ |
| `.phase-banner` | フェーズ完了バナー（`.visible`でフェードイン） |
| `.grad-section` | 卒業セクション |
| `.sticky-bar` | 下固定進捗バー |
| `.confetti-wrap` | confettiアニメ用固定レイヤー |
