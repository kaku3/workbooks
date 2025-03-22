import { auth } from '@/auth/auth';
import MainPage from '@/components/main/MainPage';
import { redirect } from 'next/navigation';

export default async function TicketPage({ params }: { params: { id: string } }) {
  const session = await auth();
  
  // 未認証の場合はログインページへリダイレクト
  if (!session) {
    redirect('/auth/signin');
  }

  return <MainPage initialTicketId={params.id} />;
}
