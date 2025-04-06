import { NextResponse } from 'next/server';
import { loadStatuses } from '@/backend/services/status';

export async function GET() {
  try {
    const data = loadStatuses();
    return NextResponse.json(data);
  } catch (error) {
    console.error('ステータスデータの読み込みに失敗:', error);
    return NextResponse.json(
      { error: 'ステータスデータの読み込みに失敗しました' },
      { status: 500 }
    );
  }
}
