import MainLayout from '@/components/layout/main-layout';
import { UserProvider } from '@/store/user-context';
import '@/styles/globals.css';

import { SessionProvider } from 'next-auth/react';

export default function App({ Component, pageProps, session }) {
  return (
    <SessionProvider session={session}>
      <UserProvider>
        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
      </UserProvider>
    </SessionProvider>
  );
}
