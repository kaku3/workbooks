import type { TestCase, TestResult } from '../types';

/**
 * コードから関数名を抽出
 */
export function extractFunctionNames(code: string): string[] {
  const matches = code.matchAll(/function\s+([a-zA-Z0-9_]+)/g);
  return Array.from(matches, m => m[1]);
}

/**
 * 実行する関数名を決定
 */
export function determineMainFunction(functionNames: string[]): string {
  if (functionNames.length === 0) {
    throw new Error('関数が見つかりません。function キーワードで関数を定義してください。');
  }

  // testで始まる関数 > 最初の関数（メイン処理は通常最初に定義される）
  const testFunction = functionNames.find(name => /^test/i.test(name));
  return testFunction || functionNames[0];
}

/**
 * ユーザーコードを実行可能な関数に変換
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function createUserFunction(code: string, functionName: string): Function {
  const userCodeWrapper = `
    ${code}
    return ${functionName};
  `;

  return new Function(userCodeWrapper)();
}

/**
 * テストケースを実行
 */
export function runTestCase(
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  userFunc: Function,
  testCase: TestCase,
  code: string,
  idx: number
): { result: TestResult; log: string } {
  let logOutput = `\n=== Test Case ${idx + 1} ===\n`;

  try {
    let actual;

    // inputが文字列の場合は即時実行関数として評価（特殊なテストケース用）
    if (typeof testCase.input === 'string') {
      const evalFunc = new Function(code + '\nreturn ' + testCase.input);
      actual = evalFunc();
    } else {
      // 配列の場合は通常の関数呼び出し
      actual = userFunc(...testCase.input);
    }

    // 戻り値の比較（expectedOutputがnullやundefinedでない場合のみ）
    let returnValuePassed = true;
    if (testCase.expectedOutput !== null && testCase.expectedOutput !== undefined) {
      returnValuePassed = JSON.stringify(actual) === JSON.stringify(testCase.expectedOutput);
    }

    // console.log出力の比較（期待値が設定されている場合）
    let consoleOutputPassed = true;
    if (testCase.expectedConsoleOutput !== undefined) {
      // TODO: 個別のテストケースごとのconsole出力比較は現在未対応
      consoleOutputPassed = true;
    }

    const passed = returnValuePassed && consoleOutputPassed;

    return {
      result: {
        passed,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        input: testCase.input as any[],
        expected: testCase.expectedOutput,
        actual,
      },
      log: logOutput
    };
  } catch (e) {
    const error = e as Error;
    const errorMsg = error.message || error.toString();
    logOutput += `[Test Case ${idx + 1} - Error] ${errorMsg}\n`;
    return {
      result: {
        passed: false,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        input: testCase.input as any[],
        expected: testCase.expectedOutput,
        actual: null,
        error: errorMsg
      },
      log: logOutput
    };
  }
}

/**
 * console.log をキャプチャするラッパー
 */
export function captureConsoleLog(callback: () => void): string {
  let logOutput = '';
  const originalLog = console.log;

  console.log = (...args) => {
    logOutput += args.map(arg => {
      if (typeof arg === 'object' && arg !== null) {
        try {
          return JSON.stringify(arg, null, 2);
        } catch {
          return String(arg);
        }
      }
      return String(arg);
    }).join(' ') + '\n';
    originalLog(...args);  // ブラウザコンソールにも出力
  };

  try {
    callback();
  } finally {
    console.log = originalLog;
  }

  return logOutput;
}
