import { loadProject } from '@/backend/services/project';

export async function GET() {
  try {
    const project = loadProject();
    return Response.json({ 
      success: true,
      project
    });
  } catch (error) {
    console.error('Failed to read project data:', error);
    return Response.json({ 
      success: false, 
      error: 'プロジェクト情報の読み込みに失敗しました'
    }, { 
      status: 500 
    });
  }
}
