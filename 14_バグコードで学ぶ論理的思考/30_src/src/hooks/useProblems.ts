import { useState, useEffect } from 'react';
import type { Problem } from '../types';
import { SAMPLE_PROBLEMS } from '../constants';

/**
 * 問題データの読み込みと管理
 */
export function useProblems() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProblems = async () => {
      const loadedProblems: Problem[] = [];
      for (const path of SAMPLE_PROBLEMS) {
        try {
          const res = await fetch(path);
          if (res.ok) {
            const data = await res.json();
            loadedProblems.push(data);
          }
        } catch (e) {
          console.error('Failed to load problem:', path, e);
        }
      }
      setProblems(loadedProblems);
      setLoading(false);
    };
    fetchProblems();
  }, []);

  return { problems, loading };
}
