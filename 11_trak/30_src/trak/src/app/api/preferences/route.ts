import { auth } from '@/auth/serverAuth';
import { NextResponse } from 'next/server';
import { type Preferences, loadPreferences, savePreferences } from '@/backend/services/preferences';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const preferences = loadPreferences(session.user.email);
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
    savePreferences(session.user.email, preferences);
    return NextResponse.json({ message: 'Preferences updated' });
  } catch (error) {
    console.error('Error updating preferences:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
