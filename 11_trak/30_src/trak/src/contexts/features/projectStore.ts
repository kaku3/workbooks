import { useState, useCallback } from 'react';

export interface ProjectData {
  id: string;
  name: string;
  beginDate: string;
  endDate: string;
}

export interface ProjectStore {
  project: ProjectData | null;
  isLoadingProject: boolean;
  projectError: string | null;
  fetchProject: () => Promise<void>;
}

// プロジェクト管理のカスタムフック
export function useProjectStore(): ProjectStore {
  // プロジェクト関連の状態
  const [project, setProject] = useState<ProjectData | null>(null);
  const [isLoadingProject, setIsLoadingProject] = useState(true);
  const [projectError, setProjectError] = useState<string | null>(null);

  // プロジェクトの取得
  const fetchProject = useCallback(async () => {
    console.log('[ApplicationContext] fetchProject called');
    setIsLoadingProject(true);
    
    try {
      const response = await fetch('/api/project');
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'プロジェクト情報の取得に失敗しました');
      }

      console.log('[ApplicationContext] fetchProject success:', data.project);
      setProject(data.project);
      setProjectError(null);
    } catch (err) {
      console.error('[ApplicationContext] fetchProject error:', err);
      const errorMessage = err instanceof Error ? err.message : '予期せぬエラーが発生しました';
      setProjectError(errorMessage);
    } finally {
      setIsLoadingProject(false);
    }
  }, []);

  return {
    project,
    isLoadingProject,
    projectError,
    fetchProject,
  };
}
