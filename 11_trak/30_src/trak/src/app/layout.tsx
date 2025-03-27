import { Inter } from 'next/font/google';
import { TagsProvider } from '@/components/main/TagsContext';
import AuthProvider from '@/components/auth/AuthProvider';
import '@/styles/site.scss';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Trak - タスク管理システム',
  description: 'シンプルで使いやすいタスク管理システム',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <AuthProvider>
          <TagsProvider>
            <div className="animate-fade-in">
              {children}
            </div>
          </TagsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
