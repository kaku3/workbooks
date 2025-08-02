/**
 * ルビ機能のロジック部分
 * ルビデータの処理とゲーム統合のための関数群
 */

/**
 * 置き換え変数の値を定義
 */
const REPLACEMENT_VALUES = {
  '{{user_company}}': '株式会社サンプル',
  '{{user_name}}': '田中太郎',
  '{{customer_company}}': '顧客株式会社',
  '{{customer_name}}': '佐藤次郎'
};

/**
 * 行のトークン配列から文字配列を展開する関数（置き換え変数を実際の値に変換）
 * @param {Array} lineTokens - 行のトークン配列
 * @returns {Array} - 文字配列
 */
window.expandLineTokensToCharacters = function(lineTokens) {
  const characters = [];
  
  for (const token of lineTokens) {
    if (token.isVariable && REPLACEMENT_VALUES[token.t]) {
      // 置き換え変数の場合、実際の値を文字単位で展開
      const replacementValue = REPLACEMENT_VALUES[token.t];
      for (const char of replacementValue) {
        characters.push({ char: char, ruby: null });
      }
    } else {
      // 通常のテキストの場合、文字単位で展開
      // 'r' プロパティがあればそれをrubyとして使用、なければnull
      for (const char of token.t) {
        characters.push({ char: char, ruby: token.r || null });
      }
    }
  }
  
  return characters;
};

/**
 * 特定の行の文字配列から現在のタイピング行用のHTMLを生成する関数
 * @param {Array} lineCharacters - 行の文字配列
 * @param {string} typedText - 入力済みテキスト
 * @param {string} currentLine - 現在行の正解テキスト
 * @returns {string} - HTML形式のゲーム行
 */
window.generateGameLineWithRuby = function(lineCharacters, typedText = '', currentLine = '') {
  let result = '';
  
  for (let i = 0; i < lineCharacters.length; i++) {
    const charData = lineCharacters[i];
    let className = 'untyped';
    
    if (i < typedText.length) {
      // 入力済みの文字の正誤判定
      if (i < currentLine.length && typedText[i] === currentLine[i]) {
        className = 'correct';
      } else {
        className = 'incorrect';
      }
    }
    
    if (charData.ruby) {
      result += `<span class="${className}"><ruby>${charData.char}<rt>${charData.ruby}</rt></ruby></span>`;
    } else {
      result += `<span class="${className}">${charData.char}</span>`;
    }
  }
  
  return result;
};

/**
 * 問題IDと行番号から展開済み文字配列を取得する関数
 * @param {number} questionId - 問題ID
 * @param {number} lineIndex - 行番号（0から始まる）
 * @returns {Array} - 展開済み文字配列
 */
window.getExpandedLineCharacters = function(questionId, lineIndex) {
  const questionRubies = window.rubies[questionId];
  if (!questionRubies || !questionRubies.to_customer || !questionRubies.to_customer.body) {
    return [];
  }
  
  const lines = questionRubies.to_customer.body.lines;
  if (!lines || lineIndex >= lines.length) {
    return [];
  }
  
  return window.expandLineTokensToCharacters(lines[lineIndex]);
};

/**
 * 問題IDから全行の文字配列を取得する関数
 * @param {number} questionId - 問題ID
 * @returns {Array} - 行ごとの文字配列
 */
window.getAllLinesCharacters = function(questionId) {
  const questionRubies = window.rubies[questionId];
  if (!questionRubies || !questionRubies.to_customer || !questionRubies.to_customer.body) {
    return [];
  }
  
  const lines = questionRubies.to_customer.body.lines;
  if (!lines) {
    return [];
  }
  
  return lines.map(lineTokens => window.expandLineTokensToCharacters(lineTokens));
};

/**
 * 全行の文字配列から行の境界を計算する関数
 * @param {Array} allLinesCharacters - 全行の文字配列
 * @returns {Array} - 各行の開始・終了インデックスの配列
 */
window.calculateLineBreaks = function(allLinesCharacters) {
  const lines = [];
  let currentIndex = 0;
  
  for (let lineIndex = 0; lineIndex < allLinesCharacters.length; lineIndex++) {
    const lineCharacters = allLinesCharacters[lineIndex];
    const startIndex = currentIndex;
    const endIndex = currentIndex + lineCharacters.length;
    
    lines.push({ 
      start: startIndex, 
      end: endIndex,
      lineIndex: lineIndex,
      length: lineCharacters.length
    });
    
    // 次の行のために改行文字分も加算（最後の行以外）
    currentIndex = endIndex + (lineIndex < allLinesCharacters.length - 1 ? 1 : 0);
  }
  
  return lines;
};

/**
 * 置き換え変数の値を設定する関数
 * @param {Object} values - 置き換え値のオブジェクト
 */
window.setReplacementValues = function(values) {
  Object.assign(REPLACEMENT_VALUES, values);
};

// === 後方互換性のための関数 ===

/**
 * 問題IDから展開済み文字配列を取得する関数（後方互換性用）
 * @param {number} questionId - 問題ID
 * @returns {Array} - 展開済み文字配列（一次元配列として）
 */
window.getExpandedCharacters = function(questionId) {
  const allLinesCharacters = window.getAllLinesCharacters(questionId);
  const flatCharacters = [];
  
  for (let i = 0; i < allLinesCharacters.length; i++) {
    const lineCharacters = allLinesCharacters[i];
    
    // 行の文字を追加
    flatCharacters.push(...lineCharacters);
    
    // 最後の行以外は改行文字を追加
    if (i < allLinesCharacters.length - 1) {
      flatCharacters.push({ char: '\n', ruby: null });
    }
  }
  
  return flatCharacters;
};
