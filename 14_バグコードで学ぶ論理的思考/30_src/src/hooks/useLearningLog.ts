import { useState, useEffect } from 'react';
import type { LearningLog, ProblemLog } from '../types';
import { STORAGE_KEY } from '../constants';

/**
 * 学習ログの管理
 */
export function useLearningLog() {
  const [learningLog, setLearningLog] = useState<LearningLog>(() => {
    // ローカルストレージから初期値を読み込み
    const savedLog = localStorage.getItem(STORAGE_KEY);
    if (savedLog) {
      try {
        return JSON.parse(savedLog);
      } catch (e) {
        console.error('Failed to parse learning log', e);
      }
    }
    return {};
  });

  // ローカルストレージに保存
  useEffect(() => {
    if (Object.keys(learningLog).length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(learningLog));
    }
  }, [learningLog]);

  /**
   * 問題の開始時刻を記録
   */
  const initProblemLog = (problemId: string) => {
    if (!learningLog[problemId]) {
      setLearningLog(prev => ({
        ...prev,
        [problemId]: {
          problemId,
          attempts: 0,
          hintUsed: false,
          cleared: false,
          startTime: Date.now(),
          lastAttemptTime: Date.now()
        }
      }));
    }
  };

  /**
   * 学習ログを更新
   */
  const updateLog = (problemId: string, updates: Partial<ProblemLog>) => {
    setLearningLog(prev => ({
      ...prev,
      [problemId]: {
        ...prev[problemId],
        ...updates,
        problemId
      } as ProblemLog
    }));
  };

  /**
   * 学習ログをエクスポート
   */
  const exportLog = () => {
    const exportData = {
      exportDate: new Date().toISOString(),
      learningLog
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `learning_log_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return {
    learningLog,
    initProblemLog,
    updateLog,
    exportLog
  };
}
