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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ticketId = params.id;
    const data = await request.json() as TicketData;

    // トラッキング情報の保存
    const trackingPath = path.join(
      process.cwd(),
      'trak-data',
      'trackings',
      `${ticketId}.json`
    );
    
    // 既存のトラッキングデータを読み込んで、必要なフィールドを維持
    const existingTracking = JSON.parse(
      await fs.readFile(trackingPath, 'utf-8')
    );

    // 更新データを既存データとマージ
    const updatedTracking: TicketData = {
      ...existingTracking,
      ...data,
      id: ticketId,
      updatedAt: new Date().toISOString(),
      createdAt: existingTracking.createdAt // 作成日は既存のものを維持
    };

    await fs.writeFile(
      trackingPath,
      JSON.stringify(updatedTracking, null, 2)
    );

    // チケット本文の保存
    if (data.content) {
      const ticketPath = path.join(
        process.cwd(),
        'trak-data',
        'tickets',
        `${ticketId}.md`
      );
      await fs.writeFile(ticketPath, data.content);
    }

    return NextResponse.json({ success: true, ticketId });
  } catch (error) {
    console.error('チケットの更新に失敗:', error);
    return NextResponse.json(
      { success: false, ticketId: params.id, error: 'チケットの更新に失敗しました' },
      { status: 500 }
    );
  }
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
