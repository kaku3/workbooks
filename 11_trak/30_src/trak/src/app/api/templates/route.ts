import { NextResponse } from 'next/server';
import { loadTemplates } from '@/backend/services/template';

export async function GET() {
  try {
    const data = await loadTemplates();
    return NextResponse.json(data);
  } catch (error) {
    console.error('テンプレートデータの読み込みに失敗:', error);
    return NextResponse.json(
      { error: 'テンプレートデータの読み込みに失敗しました' },
      { status: 500 }
    );
  }
}
