import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

interface Tag {
  id: string;
  name: string;
  color: string;
}

interface CategoryTag {
  categoryId: string;
  name: string;
  tags: Tag[];
}

const configPath = path.join(process.cwd(), 'trak-data', 'configs', 'tags.json');

// Helper function to flatten categorized tags
function flattenTags(categorizedTags: CategoryTag[]): Tag[] {
  return categorizedTags.reduce<Tag[]>((acc, category) => {
    return [...acc, ...category.tags];
  }, []);
}

// GET /api/tags
export async function GET() {
  try {
    const data = await fs.readFile(configPath, 'utf8');
    const parsedData = JSON.parse(data);
    return NextResponse.json({
      categories: parsedData,
      tags: flattenTags(parsedData.tags)
    });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      // ファイルが存在しない場合は空の配列を返す
      return NextResponse.json({ tags: [] });
    }
    console.error('Error reading tags:', error);
    return NextResponse.json({ error: 'Failed to read tags' }, { status: 500 });
  }
}

// POST /api/tags
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, name, color } = body;

    if (!id || !name || !color) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    let data;
    try {
      const fileContent = await fs.readFile(configPath, 'utf8');
      data = JSON.parse(fileContent);
    } catch {
      data = { tags: [] };
    }

    // タグの重複チェック
    if (data.tags.some((tag: { id: string }) => tag.id === id)) {
      return NextResponse.json(
        { error: 'Tag with this ID already exists' },
        { status: 400 }
      );
    }

    data.tags.push({ id, name, color });
    await fs.writeFile(configPath, JSON.stringify(data, null, 2));

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating tag:', error);
    return NextResponse.json(
      { error: 'Failed to create tag' },
      { status: 500 }
    );
  }
}
