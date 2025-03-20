import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import type { TicketData, APIResponse } from './types';

export async function GET() {
  try {
    const trackingsDir = path.join(process.cwd(), 'trak-data', 'trackings');
    await fs.mkdir(trackingsDir, { recursive: true });

    // trackingsディレクトリ内のすべてのJSONファイルを読み込む
    const files = await fs.readdir(trackingsDir);
    const jsonFiles = files.filter(file => file.endsWith('.json'));

    const tickets = await Promise.all(
      jsonFiles.map(async (file) => {
        const tracking = JSON.parse(
          await fs.readFile(path.join(trackingsDir, file), 'utf-8')
        );
        return tracking;
      })
    );

    // チケットを作成日時の降順でソート
    tickets.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({ success: true, tickets });
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
    const timestamp = Date.now();
    const ticketId = `T${timestamp}`;

    // チケットの内容をMarkdownファイルとして保存
    const ticketsDir = path.join(process.cwd(), 'trak-data', 'tickets');
    await fs.mkdir(ticketsDir, { recursive: true });
    await fs.writeFile(
      path.join(ticketsDir, `${ticketId}.md`),
      data.content
    );

    // トラッキング情報をJSONとして保存
    const trackingsDir = path.join(process.cwd(), 'trak-data', 'trackings');
    await fs.mkdir(trackingsDir, { recursive: true });
    
    const tracking: TicketData = {
      ...data,
      id: ticketId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await fs.writeFile(
      path.join(trackingsDir, `${ticketId}.json`),
      JSON.stringify(tracking, null, 2)
    );

    const response: APIResponse = { success: true, ticketId };
    return NextResponse.json(response);
  } catch (error) {
    console.error('チケットの保存に失敗:', error);
    const response: APIResponse = {
      success: false,
      ticketId: '',
      error: 'チケットの保存に失敗しました'
    };
    return NextResponse.json(response, { status: 500 });
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

    const ticketsDir = path.join(process.cwd(), 'trak-data', 'tickets');
    const trackingsDir = path.join(process.cwd(), 'trak-data', 'trackings');

    // チケットファイルとトラッキングファイルの両方を削除
    await Promise.all([
      fs.unlink(path.join(ticketsDir, `${ticketId}.md`)),
      fs.unlink(path.join(trackingsDir, `${ticketId}.json`))
    ]);

    return NextResponse.json({ success: true, ticketId });
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
      const response: APIResponse = {
        success: false,
        ticketId: '',
        error: 'チケットIDが指定されていません'
      };
      return NextResponse.json(response, { status: 400 });
    }

    // チケットの内容を更新
    const ticketsDir = path.join(process.cwd(), 'trak-data', 'tickets');
    await fs.writeFile(
      path.join(ticketsDir, `${ticketId}.md`),
      data.content
    );

    // トラッキング情報を更新
    const trackingsDir = path.join(process.cwd(), 'trak-data', 'trackings');
    const tracking: TicketData = {
      ...data,
      id: ticketId,
      updatedAt: new Date().toISOString()
    };

    const existingTrackingPath = path.join(trackingsDir, `${ticketId}.json`);
    const existingTracking = JSON.parse(
      await fs.readFile(existingTrackingPath, 'utf-8')
    );

    await fs.writeFile(
      existingTrackingPath,
      JSON.stringify({ 
        ...existingTracking, 
        ...tracking,
        createdAt: existingTracking.createdAt // 作成日は既存のものを維持
      }, null, 2)
    );

    const response: APIResponse = { success: true, ticketId };
    return NextResponse.json(response);
  } catch (error) {
    console.error('チケットの更新に失敗:', error);
    const response: APIResponse = {
      success: false,
      ticketId: '',
      error: 'チケットの更新に失敗しました'
    };
    return NextResponse.json(response, { status: 500 });
  }
}
