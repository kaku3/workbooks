// 称号データ（モデル点数との差によって決まる）
const titles = [
  { 
    min: -100, max: -40, 
    name: "まだまだな", 
    description: "現状の職種よりも低い評価です。基礎スキルの底上げが必要です。", 
    salaryMultiplier: 0.8,  // 年収マイナス20%
    advice: "基礎スキルの習得と実務経験の積み重ねが必要です。オンライン学習や社内勉強会への参加から始めましょう。"
  },
  { 
    min: -39, max: -20, 
    name: "発展途上の", 
    description: "現状の職種としては物足りない部分が多いです。", 
    salaryMultiplier: 0.9,  // 年収マイナス10%
    advice: "弱点となるスキルを重点的に伸ばしましょう。実務での応用を意識した学習がおすすめです。"
  },
  { 
    min: -19, max: -10, 
    name: "駆け出しの", 
    description: "現状の職種としては少し足りない部分があります。", 
    salaryMultiplier: 0.95,  // 年収マイナス5%
    advice: "あと一歩で標準レベルに達します。実務での応用機会を増やし、フィードバックを得ることが効果的です。"
  },
  { 
    min: -9, max: 9, 
    name: "平均的な", 
    description: "現状の職種としてちょうど良いバランスです。", 
    salaryMultiplier: 1.0,  // 標準
    advice: "バランスの取れたスキルセットを持っています。次のステップに進むためには、得意分野をさらに伸ばすことが有効です。"
  },
  { 
    min: 10, max: 19, 
    name: "優秀な", 
    description: "現状の職種として期待以上の実力があります。", 
    salaryMultiplier: 1.1,  // 年収プラス10%
    advice: "すでに高いスキルを持っています。専門性をさらに高めるか、新しい領域に挑戦するチャンスです。"
  },
  { 
    min: 20, max: 39, 
    name: "卓越した", 
    description: "現状の職種の中でもトップクラスの実力です。", 
    salaryMultiplier: 1.2,  // 年収プラス20%
    advice: "他者への知識共有やメンタリングも効果的です。社内外での発信やリーダーシップを発揮してみましょう。"
  },
  { 
    min: 40, max: 100, 
    name: "天才的な", 
    description: "現状の職種を超えた才能を持っています。更なるキャリアアップが期待できます。", 
    salaryMultiplier: 1.3,  // 年収プラス30%
    advice: "次のキャリアステップに進む準備ができています。上位職種へのステップアップや、専門領域でのエキスパート化を検討してみましょう。"
  },
  {
    name: '未経験レベル',
    min: -Infinity,
    max: -100, // 実際にはgenerateEvaluationで直接判定するのでここは参考値
    description: '現時点ではエンジニア職としてのスキルが十分ではありません。',
    advice: 'これからエンジニアを目指す方は、基礎的なITスキルやプログラミングの学習から始めましょう。オンライン教材や入門書、スクールなどを活用し、まずは小さなアプリやWebサイトを作ってみるのがおすすめです。焦らず一歩ずつスキルアップを目指しましょう。',
    salaryMultiplier: 0
  }
];

// 職種ごとの年収推定範囲（万円）
const salaryRanges = {
  'tester': { min: 350, max: 500, nextRole: 'tester-adv', nextRoleLabel: '上級テスター' },
  'tester-adv': { min: 450, max: 600, nextRole: 'se', nextRoleLabel: 'システムエンジニア' },
  'pg': { min: 400, max: 600, nextRole: 'se', nextRoleLabel: 'システムエンジニア' },
  'se': { min: 500, max: 700, nextRole: 'plpm', nextRoleLabel: 'プロジェクトリーダー/マネージャー' },
  'plpm': { min: 600, max: 900, nextRole: 'consultant', nextRoleLabel: 'ITコンサルタント' },
  'consultant': { min: 800, max: 1200, nextRole: '', nextRoleLabel: '' },
  'none': { min: 0, max: 0, nextRole: null, nextRoleLabel: null }
};

// 職種の日本語名称
const roleNames = {
  'tester': 'テスター',
  'tester-adv': '上級テスター',
  'pg': 'プログラマー',
  'se': 'システムエンジニア',
  'plpm': 'プロジェクトリーダー/マネージャー',
  'consultant': 'ITコンサルタント',
  'none': '該当なし'
};

// 強みと弱みの分析カテゴリ
const skillCategories = {
  'ヒューマン': 'ヒューマンスキル',
  '業務': '業務スキル',
  '技術': '技術スキル',
  'マネジメント': 'マネジメントスキル'
};

// 入力値の短縮キー定義例（必要に応じて拡張）
const inputKeyMap = {
  // 例: 'role': 'r', 'skill1': 's1', ...
  // 実際のフォーム項目に合わせて設定
  role: 'r',
  scores: 's', // スキル点数配列など
  // ...他の入力項目...
};
window.inputKeyMap = inputKeyMap;

// 入力値を短縮キーでまとめてLZ-string圧縮＋URIエンコード
function encodeInputToQuery(inputObj) {
  const shortObj = {};
  for (const k in inputObj) {
    if (inputKeyMap[k]) {
      shortObj[inputKeyMap[k]] = inputObj[k];
    }
  }
  // LZ-string圧縮
  return LZString.compressToEncodedURIComponent(JSON.stringify(shortObj));
}
window.encodeInputToQuery = encodeInputToQuery;

// クエリストリングから入力値をLZ-string展開
function decodeInputFromQuery(queryStr) {
  try {
    const json = LZString.decompressFromEncodedURIComponent(queryStr);
    if (!json) return null;
    const shortObj = JSON.parse(json);
    const inputObj = {};
    for (const k in inputKeyMap) {
      const shortKey = inputKeyMap[k];
      if (shortObj.hasOwnProperty(shortKey)) {
        inputObj[k] = shortObj[shortKey];
      }
    }
    return inputObj;
  } catch (e) {
    return null;
  }
}
window.decodeInputFromQuery = decodeInputFromQuery;

/**
 * 現在の入力値から共有用URLを生成
 * @param {object} inputObj - 入力値オブジェクト
 * @returns {string} 共有用URL
 */
function generateShareUrl(inputObj) {
  const baseUrl = window.location.origin + window.location.pathname;
  const query = encodeInputToQuery(inputObj);
  return `${baseUrl}?q=${query}`;
}
window.generateShareUrl = generateShareUrl;

const shareText = '#IT年収チェッカー';
/**
 * X（旧Twitter）共有ボタンのHTMLを生成
 * @param {string} shareUrl - 共有用URL
 * @returns {string} ボタンHTML
 */
function createXShareButtonHtml(shareUrl) {
  const url = encodeURIComponent(shareUrl);
  // ハッシュタグとコピー文言を追加
  const text = encodeURIComponent(shareText);
  const xUrl = `https://x.com/intent/tweet?url=${url}&text=${text}`;
  // 黒丸＋白XのSVG
  const xIcon = `<svg viewBox="0 0 24 24" width="28" height="28" style="vertical-align:middle;">
    <circle cx="12" cy="12" r="12" fill="#000"/>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
      fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
  return `<a href="${xUrl}" target="_blank" rel="noopener noreferrer" id="x-share-btn" style="margin-left:8px;display:inline-flex;align-items:center;text-decoration:none;">
    ${xIcon}
  </a>`;
}
window.createXShareButtonHtml = createXShareButtonHtml;

/**
 * Facebook共有ボタンのHTMLを生成
 * @param {string} shareUrl - 共有用URL
 * @returns {string} ボタンHTML
 */
function createFacebookShareButtonHtml(shareUrl) {
  // ハッシュタグとコピー文言を追加
  const url = encodeURIComponent(shareUrl);
  const quote = encodeURIComponent(shareText);
  const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${quote}`;
  // Facebook公式カラーのSVGアイコン
  const fbIcon = `<svg width="28" height="28" viewBox="0 0 32 32" style="vertical-align:middle;" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="16" fill="#1877F3"/>
    <path d="M21.5 16h-3v8h-3v-8h-2v-3h2v-2c0-2.2 1.3-3.5 3.3-3.5.9 0 1.7.1 1.7.1v2h-1.2c-1 0-1.3.6-1.3 1.2v2.2h2.5l-.4 3z" fill="#fff"/>
  </svg>`;
  return `<a href="${fbUrl}" target="_blank" rel="noopener noreferrer" id="fb-share-btn" style="margin-left:8px;display:inline-flex;align-items:center;text-decoration:none;">
    ${fbIcon}
  </a>`;
}
window.createFacebookShareButtonHtml = createFacebookShareButtonHtml;

/**
 * コピー共有ボタンのHTMLを生成
 * @returns {string} ボタンHTML
 */
function createCopyShareButtonHtml() {
  // シンプルな共有アイコン（Material Design風）
  const shareIcon = `<svg width="28" height="28" viewBox="0 0 24 24" style="vertical-align:middle;" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="#1976D2"/>
    <path d="M18 8.59l-1.41-1.42L13 10.76V3h-2v7.76l-3.59-3.59L6 8.59l6 6z" fill="#fff"/>
    <rect x="6" y="18" width="12" height="2" rx="1" fill="#fff"/>
  </svg>`;
  return `<button id="share-btn" type="button" style="margin-left:8px;background:none;border:none;padding:0;cursor:pointer;display:inline-flex;align-items:center;">${shareIcon}</button>`;
}
window.createCopyShareButtonHtml = createCopyShareButtonHtml;

/**
 * 共有ボタンのHTMLを生成（X, Facebook, コピー, URL）
 * @param {string} shareUrl - 共有用URL
 * @returns {string} ボタンHTML
 */
function createShareButtonHtml(shareUrl) {
  return `<span style="font-weight:bold;margin-right:8px;vertical-align:middle;display:inline-flex;align-items:center;height:28px;">診断結果を共有:</span>`
    + `<span style="display:inline-flex;align-items:center;vertical-align:middle;height:28px;">`
    + createXShareButtonHtml(shareUrl)
    + createFacebookShareButtonHtml(shareUrl)
    + createCopyShareButtonHtml()
    + `</span>`
    + `<input id="share-url" type="text" value="${shareUrl}" readonly style="width:60%;margin-left:8px;vertical-align:middle;height:28px;">`;
}
window.createShareButtonHtml = createShareButtonHtml;

/**
 * 共有ボタンのクリックイベントをセットアップ
 * @param {string} btnId - ボタンID
 * @param {string} inputId - URL表示用inputのID
 */
function setupShareButtonCopy(btnId = 'share-btn', inputId = 'share-url') {
  const btn = document.getElementById(btnId);
  const input = document.getElementById(inputId);
  if (btn && input) {
    // 元のアイコンを保持
    const originalHtml = btn.innerHTML;
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(input.value);
        btn.innerHTML = 'コピーしました！';
        setTimeout(() => { btn.innerHTML = originalHtml; }, 1500);
      } catch (e) {
        // Fallback: select and copy (for very old browsers)
        input.select();
        document.execCommand('copy');
        btn.innerHTML = 'コピーしました！';
        setTimeout(() => { btn.innerHTML = originalHtml; }, 1500);
      }
    });
  }
}
window.setupShareButtonCopy = setupShareButtonCopy;
