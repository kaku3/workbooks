import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // project.jsonを読み込む
    const projectPath = path.join(process.cwd(), 'trak-data', 'configs', 'project.json');
    const projectData = JSON.parse(fs.readFileSync(projectPath, 'utf8'));

    return Response.json({ 
      success: true,
      project: projectData
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
