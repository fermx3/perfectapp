import MainLayout from '@/components/layout/main-layout';
import { ClienteEnBaseProvider } from '@/store/clienteEnBase.context';
import { UserProvider } from '@/store/user-context';
import '@/styles/globals.css';

import { SessionProvider } from 'next-auth/react';

export default function App({ Component, pageProps, session }) {
  return (
    <SessionProvider session={session}>
      <UserProvider>
        <ClienteEnBaseProvider>
          <MainLayout>
            <Component {...pageProps} />
          </MainLayout>
        </ClienteEnBaseProvider>
      </UserProvider>
    </SessionProvider>
  );
}
