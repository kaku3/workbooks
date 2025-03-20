import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    const statusesPath = path.join(process.cwd(), 'trak-data', 'configs', 'statuses.json');
    const rawData = await fs.readFile(statusesPath, 'utf-8');
    const data = JSON.parse(rawData);

    return NextResponse.json(data);
  } catch (error) {
    console.error('ステータスデータの読み込みに失敗:', error);
    return NextResponse.json(
      { error: 'ステータスデータの読み込みに失敗しました' },
      { status: 500 }
    );
  }
}
