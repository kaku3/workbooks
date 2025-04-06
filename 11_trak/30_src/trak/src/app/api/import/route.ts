import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth/auth';
import { ImportLogic } from '../../../backend/logic/importLogic';
import { loadProject } from '../../../backend/services/project';
import { loadTags } from '../../../backend/services/tag';
import { loadUsers } from '../../../backend/services/user';
import { loadStatuses } from '../../../backend/services/status';
import { loadTemplates } from '../../../backend/services/template';

export async function POST(request: NextRequest) {
  try {
    // 認証チェック
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // ファイル取得
    const formData = await request.formData();
    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // 必要なデータの取得
    const [
      project,
      { tags },
      { users },
      { statuses },
      { templates }
    ] = await Promise.all([
      loadProject(),
      loadTags(),
      loadUsers(),
      loadStatuses(),
      loadTemplates()
    ]);

    if (!project || !templates?.[0]) {
      return NextResponse.json(
        { error: 'Project or template not found' },
        { status: 404 }
      );
    }

    // バッファに変換
    const buffer = await file.arrayBuffer();

    // インポート実行
    const importLogic = new ImportLogic(
      project,
      tags,
      statuses,
      users,
      session.user.email,
      templates[0].id // 最初のテンプレートをデフォルトとして使用
    );

    const result = await importLogic.importFromExcel(buffer);

    return NextResponse.json(result);

  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
