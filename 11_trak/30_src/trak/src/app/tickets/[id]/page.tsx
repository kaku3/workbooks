import { auth } from '@/auth/auth';
import MainPage from '@/components/main/MainPage';
import { redirect } from 'next/navigation';

export default async function TicketPage() {
  const session = await auth();
  
  // 未認証の場合はログインページへリダイレクト
  if (!session) {
    redirect('/auth/signin');
  }

  return <MainPage />;
}
