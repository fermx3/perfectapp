import MainLayout from '@/components/layout/main-layout';
import { ClienteEnBaseProvider } from '@/store/clienteEnBase.context';
import { StageProvider } from '@/store/stage.context';
import { UserProvider } from '@/store/user-context';
import '@/styles/globals.css';

import { SessionProvider } from 'next-auth/react';

export default function App({ Component, pageProps, session }) {
  return (
    <SessionProvider session={session}>
      <UserProvider>
        <ClienteEnBaseProvider>
          <StageProvider>
            <MainLayout>
              <Component {...pageProps} />
            </MainLayout>
          </StageProvider>
        </ClienteEnBaseProvider>
      </UserProvider>
    </SessionProvider>
  );
}
