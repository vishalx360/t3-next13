import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type DefaultSession, type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import LinkedinProvider from "next-auth/providers/linkedin";

import { env } from "@/env.mjs";
import { prisma } from "@/utils/db";
import { signJTW, verifyJWT } from "@/utils/jwt";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const options: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  // callbacks: {
  //     session: ({ session, token }) => {
  //         if (token) {
  //             session.user = {
  //                 ...session.user,
  //                 ...token,
  //             }
  //         }
  //         return session
  //     },

  //     jwt: async ({ token, user }) => {
  //         if (user) {
  //             token.id = user.id
  //             token.email = user.email
  //         }
  //         return token
  //     },
  // },
  secret: env.NEXTAUTH_SECRET,
  // jwt: {
  //     async encode({ secret, token }) {
  //         return await signJTW(token, secret)
  //     },
  //     async decode({ secret, token }) {
  //         return await verifyJWT(token, secret)
  //     },
  //     maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
  // },
  session: { strategy: "jwt" },
  providers: [
    // oauth providers
    GoogleProvider({
      allowDangerousEmailAccountLinking: true,
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    LinkedinProvider({
      clientId: env.LINKEDIN_CLIENT_ID,
      clientSecret: env.LINKEDIN_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: "/signin",
  },
};
