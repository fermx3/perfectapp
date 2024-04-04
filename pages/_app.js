import MainLayout from '@/components/layout/main-layout';
import { VisitaActualProvider } from '@/store/visitaActual.context';
import '@/styles/globals.scss';

import { SessionProvider } from 'next-auth/react';

export default function App({ Component, pageProps, session }) {
  return (
    <SessionProvider session={session}>
      <VisitaActualProvider>
        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
      </VisitaActualProvider>
    </SessionProvider>
  );
}
