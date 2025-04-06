import { NextRequest, NextResponse } from 'next/server';
import { getTicket, updateTicket, deleteTicket } from '@/backend/services/ticket';
import type { TicketData } from '@/backend/models/ticket';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const ticketId = params.id;
  const data = await request.json() as TicketData;
  const result = await updateTicket(ticketId, data);

  if (!result.success) {
    const status = result.error === 'ファイルがロックされています' ? 409 : 500;
    return NextResponse.json(result, { status });
  }

  return NextResponse.json(result);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const result = await deleteTicket(params.id);
  
  if (!result.success) {
    return NextResponse.json(result, { status: 500 });
  }

  return NextResponse.json(result);
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const result = await getTicket(params.id);
  
  if (!result.success) {
    return NextResponse.json(result, { status: 500 });
  }

  return NextResponse.json(result);
}
