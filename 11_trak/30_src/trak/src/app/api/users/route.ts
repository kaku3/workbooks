import { NextResponse } from 'next/server';
import { loadUsers } from '@/backend/services/user';

export async function GET() {
  try {
    const users = await loadUsers();
    return NextResponse.json(users);
  } catch (error) {
    console.error('ユーザーデータの読み込みに失敗:', error);
    return NextResponse.json(
      { error: 'ユーザーデータの読み込みに失敗しました' },
      { status: 500 }
    );
  }
}
