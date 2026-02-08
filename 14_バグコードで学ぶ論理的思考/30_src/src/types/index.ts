// 問題データの型定義
export interface TestResult {
  passed: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  input: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expected: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  actual: any;
  error?: string;
}

export interface TestCase {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  input: any[] | string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expectedOutput: any;
  expectedConsoleOutput?: string; // console.log の期待値
  description?: string; // テストケースの説明
}

export interface Problem {
  id: string;
  title: string;
  description: string;
  initialCode: string;
  testCases: TestCase[];
  hint: string;
  explanation: string;
  level: 'beginner' | 'intermediate' | 'advanced';
}

// 学習ログの型定義
export interface ProblemLog {
  problemId: string;
  attempts: number;
  hintUsed: boolean;
  cleared: boolean;
  startTime: number;
  clearTime?: number;
  lastAttemptTime: number;
}

export interface LearningLog {
  [problemId: string]: ProblemLog;
}

export type Level = 'beginner' | 'intermediate' | 'advanced';

export interface ProblemsByLevel {
  beginner: Problem[];
  intermediate: Problem[];
  advanced: Problem[];
}
