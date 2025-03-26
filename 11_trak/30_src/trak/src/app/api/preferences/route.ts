import { auth } from '@/auth/serverAuth';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';

interface Preferences {
  tableView?: {
    sortColumn: string | null;
    sortDirection: 'asc' | 'desc' | null;
    selectedStatuses: string[];
  };
}

const PREFERENCES_DIR = path.join(process.cwd(), 'trak-data', 'preferences');

// ディレクトリが存在しない場合は作成
if (!existsSync(PREFERENCES_DIR)) {
  mkdirSync(PREFERENCES_DIR, { recursive: true });
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const preferencesPath = path.join(PREFERENCES_DIR, `${session.user.email}.json`);
    
    if (!existsSync(preferencesPath)) {
      return NextResponse.json({});
    }

    const preferences = JSON.parse(readFileSync(preferencesPath, 'utf-8'));
    return NextResponse.json(preferences);
  } catch (error) {
    console.error('Error reading preferences:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const preferences: Preferences = await request.json();
    const preferencesPath = path.join(PREFERENCES_DIR, `${session.user.email}.json`);

    writeFileSync(preferencesPath, JSON.stringify(preferences, null, 2));
    return NextResponse.json({ message: 'Preferences updated' });
  } catch (error) {
    console.error('Error updating preferences:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
