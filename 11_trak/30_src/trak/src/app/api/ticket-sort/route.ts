import { NextRequest, NextResponse } from 'next/server';
import { 
  loadSortData, 
  updateTicketOrder, 
  batchUpdateOrders,
  type BatchUpdateData 
} from '@/backend/services/ticket-sort';

// GETリクエストハンドラ
export async function GET() {
  try {
    const sortData = await loadSortData();
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

      await updateTicketOrder(ticketId, order);
      return NextResponse.json({ success: true });
    }
    
    // 一括更新
    if ('orders' in body) {
      const updateData = body as BatchUpdateData;
      if (!Array.isArray(updateData.orders)) {
        return NextResponse.json(
          { success: false, error: '無効なリクエストです' },
          { status: 400 }
        );
      }

      await batchUpdateOrders(updateData);
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
