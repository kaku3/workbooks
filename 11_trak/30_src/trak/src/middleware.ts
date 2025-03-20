import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const isLoggedIn = !!req.nextauth.token;
    const isAuthPage = req.nextUrl.pathname.startsWith('/auth');

    // 未ログインでかつ認証ページ以外へのアクセス
    if (!isLoggedIn && !isAuthPage) {
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }

    // ログイン済みでかつ認証ページへのアクセス
    if (isLoggedIn && isAuthPage) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

// 認証チェックを適用するパス
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - auth (authentication routes)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|auth).*)',
  ],
};
