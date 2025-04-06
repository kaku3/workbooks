import { NextRequest, NextResponse } from 'next/server';
import { loadTickets, createTicket, updateTicket, deleteTicket } from '@/backend/services/ticket';
import type { TicketData } from '@/backend/models/ticket';

export async function GET() {
  try {
    const data = await loadTickets();
    return NextResponse.json({ success: true, ...data });
  } catch (error) {
    console.error('チケット一覧の取得に失敗:', error);
    return NextResponse.json(
      { success: false, error: 'チケット一覧の取得に失敗しました' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.info('POST /api/tickets/ request:', request.body);
    const data = await request.json() as TicketData;
    const response = await createTicket(data);
    return NextResponse.json(response);
  } catch (error) {
    console.error('チケットの保存に失敗:', error);
    return NextResponse.json(
      { success: false, ticketId: '', error: 'チケットの保存に失敗しました' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const data = await request.json() as { ticketId: string };
    const { ticketId } = data;

    if (!ticketId) {
      return NextResponse.json(
        {
          success: false,
          ticketId: '',
          error: 'チケットIDが指定されていません'
        },
        { status: 400 }
      );
    }

    const response = await deleteTicket(ticketId);
    return NextResponse.json(response);
  } catch (error) {
    console.error('チケットの削除に失敗:', error);
    return NextResponse.json(
      {
        success: false,
        ticketId: '',
        error: 'チケットの削除に失敗しました'
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json() as TicketData & { ticketId: string };
    const { ticketId } = data;

    if (!ticketId) {
      return NextResponse.json(
        {
          success: false,
          ticketId: '',
          error: 'チケットIDが指定されていません'
        },
        { status: 400 }
      );
    }

    const response = await updateTicket(ticketId, data);
    return NextResponse.json(response);
  } catch (error) {
    console.error('チケットの更新に失敗:', error);
    return NextResponse.json(
      {
        success: false,
        ticketId: '',
        error: 'チケットの更新に失敗しました'
      },
      { status: 500 }
    );
  }
}
