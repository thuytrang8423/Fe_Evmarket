import type { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import FacebookProvider from 'next-auth/providers/facebook'

const authConfig: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.provider = account.provider
      }
      if (profile && typeof profile === 'object') {
        // Common profile fields
        token.name = (profile as any).name ?? token.name
        token.picture = (profile as any).picture ?? token.picture
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session as any).user.provider = (token as any).provider
      }
      return session
    },
  },
}

export default authConfig


