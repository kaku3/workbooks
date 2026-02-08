/**
 * コードの構文をチェックし、一般的なエラーを検出
 */
export function checkSyntax(code: string): string[] {
  const lines = code.split('\n');
  const syntaxIssues: string[] = [];

  lines.forEach((line, idx) => {
    const lineNum = idx + 1;
    const trimmed = line.trim();

    // if文での代入演算子チェック
    if (/if\s*\([^)]*[^=!<>]\s=\s[^=]/.test(line)) {
      syntaxIssues.push(`${lineNum}行目: if文で代入演算子(=)が使われています。比較には === を使ってください`);
    }

    // while文での代入演算子チェック
    if (/while\s*\([^)]*[^=!<>]\s=\s[^=]/.test(line)) {
      syntaxIssues.push(`${lineNum}行目: while文で代入演算子(=)が使われています。比較には === を使ってください`);
    }

    // for文の条件部での代入演算子チェック
    const forMatch = line.match(/for\s*\([^;]*;([^;]*);/);
    if (forMatch && /[^=!<>]\s=\s[^=]/.test(forMatch[1])) {
      syntaxIssues.push(`${lineNum}行目: for文の条件部で代入演算子(=)が使われています。比較には === を使ってください`);
    }

    // コメント記号の誤り
    if (/^\s*#/.test(trimmed) && !trimmed.startsWith('#!')) {
      syntaxIssues.push(`${lineNum}行目: # はJavaScriptのコメント記号ではありません。// を使ってください`);
    }
  });

  return syntaxIssues;
}

/**
 * 構文エラーヒントを生成
 */
export function generateSyntaxHint(code: string, syntaxIssues: string[]): string {
  const lines = code.split('\n');
  const numberedCode = lines.map((line, idx) => `${idx + 1}: ${line}`).join('\n');

  if (syntaxIssues.length > 0) {
    return (
      syntaxIssues.map(issue => `❌ ${issue}`).join('\n') +
      `\n\n【あなたのコード】\n${numberedCode}`
    );
  }

  return (
    `【あなたのコード】\n${numberedCode}\n\n` +
    `【よくある構文エラー】\n` +
    `- 代入演算子(=)と比較演算子(===)の間違い\n` +
    `- 括弧やクォートの閉じ忘れ\n` +
    `- セミコロンの欠落\n` +
    `- コメント記号の間違い`
  );
}
