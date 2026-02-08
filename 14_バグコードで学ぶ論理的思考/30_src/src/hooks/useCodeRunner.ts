import { useState } from 'react';
import type { Problem, TestResult } from '../types';
import { checkSyntax, generateSyntaxHint } from '../utils/syntaxChecker';
import {
  extractFunctionNames,
  determineMainFunction,
  createUserFunction,
  runTestCase,
  captureConsoleLog
} from '../utils/codeExecution';

/**
 * コード実行とテストの管理
 */
export function useCodeRunner() {
  const [output, setOutput] = useState<string>('');
  const [results, setResults] = useState<TestResult[]>([]);
  const [syntaxHint, setSyntaxHint] = useState<string>('');

  /**
   * コードを実行してテスト
   */
  const runCode = (
    code: string,
    problem: Problem,
    onSuccess?: () => void
  ): TestResult[] => {
    let testResults: TestResult[] = [];
    let fullLog = '';

    // 構文ヒントをリセット
    setSyntaxHint('');

    try {
      // 簡易的な構文チェック
      const syntaxIssues = checkSyntax(code);
      if (syntaxIssues.length > 0) {
        setSyntaxHint(generateSyntaxHint(code, syntaxIssues));
      }

      // 関数名を抽出
      const functionNames = extractFunctionNames(code);
      const functionName = determineMainFunction(functionNames);
      fullLog += `📌 実行する関数: ${functionName}\n\n`;

      // ユーザーコードを実行可能な関数に変換
      // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
      let userFunc: Function;
      try {
        userFunc = createUserFunction(code, functionName);
      } catch (syntaxError) {
        // 構文エラーの場合、詳細情報をヒント用に保存
        if (!syntaxHint) {
          setSyntaxHint(generateSyntaxHint(code, []));
        }
        throw syntaxError;
      }

      if (typeof userFunc !== 'function') {
        throw new Error('関数の取得に失敗しました。');
      }

      // console.logをキャプチャしながらテストケース実行
      const capturedLog = captureConsoleLog(() => {
        testResults = problem.testCases.map((testCase, idx) => {
          const { result, log } = runTestCase(userFunc, testCase, code, idx);
          fullLog += log;
          return result;
        });
      });

      fullLog = capturedLog + fullLog;

      // 成功時のコールバック
      if (testResults.length > 0 && testResults.every(r => r.passed)) {
        onSuccess?.();
      }

    } catch (e) {
      const error = e as Error;
      const errorMsg = error.message || error.toString();
      fullLog += `❌ ${errorMsg}\n`;
    }

    setOutput(fullLog);
    setResults(testResults);
    return testResults;
  };

  /**
   * 結果をリセット
   */
  const resetResults = () => {
    setOutput('');
    setResults([]);
    setSyntaxHint('');
  };

  return {
    output,
    results,
    syntaxHint,
    runCode,
    resetResults
  };
}
