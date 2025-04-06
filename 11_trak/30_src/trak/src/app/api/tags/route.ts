import { NextResponse } from 'next/server';
import { loadTags, createTag } from '@/backend/services/tag';

// GET /api/tags
export async function GET() {
  try {
    const data = await loadTags();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading tags:', error);
    return NextResponse.json({ error: 'Failed to read tags' }, { status: 500 });
  }
}

// POST /api/tags
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, name, color, categoryId } = body;

    if (!id || !name || !color || !categoryId) {
      return NextResponse.json(
        { error: 'Required fields: id, name, color, categoryId' },
        { status: 400 }
      );
    }

    try {
      const data = await createTag({ id, name, color, categoryId });
      return NextResponse.json(data);
    } catch (error) {
      if (error instanceof Error && error.message === '同じIDのタグが既に存在します') {
        return NextResponse.json(
          { error: 'Tag with this ID already exists' },
          { status: 400 }
        );
      }
      throw error;
    }
  } catch (error) {
    console.error('Error creating tag:', error);
    return NextResponse.json(
      { error: 'Failed to create tag' },
      { status: 500 }
    );
  }
}
