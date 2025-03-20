import { Inter } from 'next/font/google';
import '@/styles/site.scss';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <div className="animate-fade-in">
          {children}
        </div>
      </body>
    </html>
  );
}

export const metadata = {
  title: 'Trak - タスク管理システム',
  description: 'シンプルで使いやすいタスク管理システム',
};
