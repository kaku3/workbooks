import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    const usersPath = path.join(process.cwd(), 'trak-data', 'configs', 'users.json');
    const rawData = await fs.readFile(usersPath, 'utf-8');
    const data = JSON.parse(rawData);

    return NextResponse.json(data);
  } catch (error) {
    console.error('ユーザーデータの読み込みに失敗:', error);
    return NextResponse.json(
      { error: 'ユーザーデータの読み込みに失敗しました' },
      { status: 500 }
    );
  }
}
