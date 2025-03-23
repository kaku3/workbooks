import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

interface TicketSortData {
  [key: string]: number;  // ticketId: order
}

interface BatchUpdateBody {
  orders: { ticketId: string, order: number }[];
}

const SORT_FILE_PATH = path.join(
  process.cwd(),
  'trak-data',
  'meta',
  'ticket-sort.json'
);

// 初期化関数: ファイルがない場合は作成
async function initializeSortFile() {
  try {
    await fs.access(SORT_FILE_PATH);
  } catch {
    await fs.mkdir(path.dirname(SORT_FILE_PATH), { recursive: true });
    await fs.writeFile(SORT_FILE_PATH, JSON.stringify({}));
  }
}

// sortデータの読み込み
async function readSortData(): Promise<TicketSortData> {
  await initializeSortFile();
  const data = await fs.readFile(SORT_FILE_PATH, 'utf8');
  return JSON.parse(data);
}

// GETリクエストハンドラ
export async function GET() {
  try {
    const sortData = await readSortData();
    return NextResponse.json({ success: true, sortData });
  } catch (error) {
    console.error('Sort data fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'ソート順の取得に失敗しました' },
      { status: 500 }
    );
  }
}

// PUTリクエストハンドラ
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // 単一のチケット更新
    if ('ticketId' in body) {
      const { ticketId, order } = body;
      if (!ticketId || order === undefined) {
        return NextResponse.json(
          { success: false, error: '無効なリクエストです' },
          { status: 400 }
        );
      }

      const sortData = await readSortData();
      sortData[ticketId] = order;
      await fs.writeFile(SORT_FILE_PATH, JSON.stringify(sortData, null, 2));
      return NextResponse.json({ success: true });
    }
    
    // 一括更新
    if ('orders' in body) {
      const { orders } = body as BatchUpdateBody;
      if (!Array.isArray(orders)) {
        return NextResponse.json(
          { success: false, error: '無効なリクエストです' },
          { status: 400 }
        );
      }

      const sortData = await readSortData();
      orders.forEach(({ ticketId, order }) => {
        sortData[ticketId] = order;
      });
      await fs.writeFile(SORT_FILE_PATH, JSON.stringify(sortData, null, 2));
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { success: false, error: '無効なリクエストです' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Sort data update error:', error);
    return NextResponse.json(
      { success: false, error: 'ソート順の更新に失敗しました' },
      { status: 500 }
    );
  }
}
