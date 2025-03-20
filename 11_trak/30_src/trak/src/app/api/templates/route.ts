import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    const templatesDir = path.join(process.cwd(), 'trak-data', 'templates');
    const files = await fs.readdir(templatesDir);
    const templates = await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(templatesDir, file);
        const content = await fs.readFile(filePath, 'utf-8');
        return {
          id: path.parse(file).name,
          name: path.parse(file).name.split('_').pop() || '',
          content
        };
      })
    );

    return NextResponse.json({ templates });
  } catch (error) {
    console.error('テンプレートの読み込みに失敗:', error);
    return NextResponse.json(
      { error: 'テンプレートの読み込みに失敗しました' },
      { status: 500 }
    );
  }
}
