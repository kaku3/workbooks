import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import type { TicketData } from '../types';

interface GetTicketResponse {
  success: boolean;
  ticket?: TicketData;
  ticketId: string;
  error?: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ticketId = params.id;

    // トラッキング情報の読み込み
    const trackingPath = path.join(
      process.cwd(),
      'trak-data',
      'trackings',
      `${ticketId}.json`
    );
    const trackingData = await fs.readFile(trackingPath, 'utf-8');
    const tracking: TicketData = JSON.parse(trackingData);

    // チケット本文の読み込み
    const ticketPath = path.join(
      process.cwd(),
      'trak-data',
      'tickets',
      `${ticketId}.md`
    );
    const content = await fs.readFile(ticketPath, 'utf-8');

    const ticket: TicketData = {
      ...tracking,
      content
    };

    const response: GetTicketResponse = { 
      success: true, 
      ticket,
      ticketId
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('チケットの取得に失敗:', error);
    const response: GetTicketResponse = { 
      success: false,
      ticketId: params.id,
      error: 'チケットの取得に失敗しました'
    };
    return NextResponse.json(response, { status: 500 });
  }
}
