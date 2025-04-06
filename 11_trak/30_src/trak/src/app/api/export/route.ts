import { NextResponse } from 'next/server';
import { ExportLogic } from '@/backend/logic/exportLogic';
import { loadProject } from '@/backend/services/project';
import { loadTags } from '@/backend/services/tag';
import { loadStatuses } from '@/backend/services/status';
import { loadUsers } from '@/backend/services/user';
import { loadTickets } from '@/backend/services/ticket';
import { auth } from '@/auth/auth';

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const [
      project,
      { tags },
      { statuses },
      { users },
      { tickets }
    ] = await Promise.all([
      loadProject(),
      loadTags(),
      loadStatuses(),
      loadUsers(),
      loadTickets()
    ]);

    const exportLogic = new ExportLogic(
      project,
      tags,
      statuses,
      users,
      tickets
    );

    const buffer = await exportLogic.exportToExcel();

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename=trak_export.xlsx'
      }
    });
  } catch (error) {
    console.error('Export failed:', error);
    return new NextResponse(
      JSON.stringify({ error: error instanceof Error ? error.message : 'エクスポートに失敗しました' }), 
      { status: 500 }
    );
  }
}
