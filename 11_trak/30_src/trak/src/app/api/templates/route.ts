import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

interface Template {
  id: string;
  name: string;
  content?: string;
}

export async function GET() {
  try {
    // テンプレート設定の読み込み
    const configPath = path.join(process.cwd(), 'trak-data', 'configs', 'templates.json');
    const configData = await fs.readFile(configPath, 'utf-8');
    const { templates } = JSON.parse(configData);

    // 各テンプレートのmarkdownファイルを読み込む
    const templatesWithContent = await Promise.all(
      templates.map(async (template: Template) => {
        const mdPath = path.join(process.cwd(), 'trak-data', 'templates', `${template.id}.md`);
        try {
          const content = await fs.readFile(mdPath, 'utf-8');
          return {
            ...template,
            content
          };
        } catch (error) {
          console.error(`テンプレート ${template.id} の読み込みに失敗:`, error);
          return {
            ...template,
            content: '## 内容\n\n'  // デフォルトの内容
          };
        }
      })
    );

    return NextResponse.json({ templates: templatesWithContent });
  } catch (error) {
    console.error('テンプレートデータの読み込みに失敗:', error);
    return NextResponse.json(
      { error: 'テンプレートデータの読み込みに失敗しました' },
      { status: 500 }
    );
  }
}
