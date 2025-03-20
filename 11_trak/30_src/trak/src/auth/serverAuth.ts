'use server';

import { authConfig } from './auth';
import { getServerSession } from 'next-auth/next';

export async function auth() {
  return await getServerSession(authConfig);
}
