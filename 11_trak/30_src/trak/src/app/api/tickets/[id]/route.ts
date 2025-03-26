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

// ファイルロック用のユーティリティ関数
async function acquireLock(lockPath: string, maxAttempts = 10): Promise<boolean> {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      await fs.writeFile(lockPath, '', { flag: 'wx' });
      return true;
    } catch (error) {
      if (i === maxAttempts - 1) return false;
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  return false;
}

async function releaseLock(lockPath: string) {
  try {
    await fs.unlink(lockPath);
  } catch (error) {
    console.error('ロックファイルの削除に失敗:', error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const ticketId = params.id;
  const lockPath = path.join(process.cwd(), 'trak-data', 'trackings', `${ticketId}.lock`);

  try {
    const data = await request.json() as TicketData;
    console.log(params, JSON.stringify(data));

    // ロックの取得
    const lockAcquired = await acquireLock(lockPath);
    if (!lockAcquired) {
      return NextResponse.json(
        { success: false, ticketId, error: 'ファイルがロックされています' },
        { status: 409 }
      );
    }

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

    console.log('updatedTracking:', updatedTracking);

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

    await releaseLock(lockPath);
    return NextResponse.json({ success: true, ticketId });
  } catch (error) {
    await releaseLock(lockPath);
    console.error('チケットの更新に失敗:', error);
    return NextResponse.json(
      { success: false, ticketId: params.id, error: 'チケットの更新に失敗しました' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ticketId = params.id;

    // トラッキングファイルの削除
    const trackingPath = path.join(
      process.cwd(),
      'trak-data',
      'trackings',
      `${ticketId}.json`
    );
    await fs.unlink(trackingPath);

    // チケットファイルの削除
    const ticketPath = path.join(
      process.cwd(),
      'trak-data',
      'tickets',
      `${ticketId}.md`
    );
    await fs.unlink(ticketPath);

    return NextResponse.json({ success: true, ticketId });
  } catch (error) {
    console.error('チケットの削除に失敗:', error);
    return NextResponse.json(
      { success: false, ticketId: params.id, error: 'チケットの削除に失敗しました' },
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
