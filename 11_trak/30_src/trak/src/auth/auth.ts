import NextAuth, { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { z } from 'zod';
import { loadUsers } from '@/backend/services/config';
import type { 
  DefaultSession, 
  Session,
  User as NextAuthUser 
} from 'next-auth';
import type { JWT } from 'next-auth/jwt';

// セッションとユーザーの型拡張
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: 'admin' | 'user';
    } & DefaultSession['user']
  }
}

// JWTの型拡張
declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: 'admin' | 'user';
  }
}

// アプリケーション固有のユーザー型
interface AppUser extends NextAuthUser {
  id: string;
  name: string | null;
  email: string;
  role: 'admin' | 'user';
}

export const authConfig: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials): Promise<AppUser | null> {
        try {
          const schema = z.object({
            email: z.string().email(),
            password: z.string().min(1),
          });

          const result = schema.safeParse(credentials);
          if (!result.success) {
            return null;
          }

          const { email } = result.data;

          // trak-data/configs/users.jsonからユーザーを読み込み
          const config = await loadUsers();
          const user = config.users.find(u => u.email === email);

          // TODO: 本来はパスワードのハッシュ化と検証が必要
          // 現在は開発用に簡易的な実装
          if (!user) {
            return null;
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30日
  },
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async jwt({ token, user }: { 
      token: JWT;
      user: NextAuthUser | null;
    }) {
      if (user) {
        token.id = user.id;
        token.role = (user as unknown as AppUser).role;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
};

const handler = NextAuth(authConfig);

export const { signIn, signOut } = handler;

// Export the handler for the API route
export { handler };

// Re-export auth from serverAuth
export { auth } from './serverAuth';
