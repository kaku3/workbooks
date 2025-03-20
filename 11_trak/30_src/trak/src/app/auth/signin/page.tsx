import { auth } from '@/auth/serverAuth';
import { redirect } from 'next/navigation';
import SignInContainer from '@/components/auth/SignInContainer';

export default async function SignInPage() {
  const session = await auth();
  if (session) {
    redirect('/');
  }

  return <SignInContainer />;
}
