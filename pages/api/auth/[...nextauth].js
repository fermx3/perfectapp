import { verifyPassword } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
  session: {
    jwt: true,
  },
  secret: process.env.NEXT_SECRET,
  providers: [
    CredentialsProvider({
      profile(profile) {
        return { role: profile.role ?? 'user' };
      },
      async authorize(credentials) {
        const client = await connectToDatabase();

        const usersCollection = client.db().collection('users');

        const user = await usersCollection.findOne({
          userId: credentials.userId,
        });

        if (!user) {
          throw new Error('No se encuentra el usuario.');
        }

        const isValid = await verifyPassword(
          credentials.password,
          user.password
        );

        if (!isValid) {
          client.close();
          throw new Error('Contraseña incorrecta.');
        }

        client.close();
        return { userId: user.userId, role: user.role };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.userId = user.userId;
      }
      return token;
    },
    session({ session, token }) {
      session.user.role = token.role;
      session.user.userId = token.userId;
      return session;
    },
  },
};

export default NextAuth(authOptions);
