import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from '@/store/store';

import MainLayout from '@/components/layout/main-layout';
import Loader from '@/components/ui/loader';
import { Nunito } from 'next/font/google';

import '@/styles/globals.scss';

import { SessionProvider } from 'next-auth/react';
import PageLoader from '@/components/ui/page-loader/page-loader';

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
});

export default function App({ Component, pageProps, session }) {
  return (
    <SessionProvider session={session}>
      <Provider store={store}>
        <PersistGate loading={<Loader />} persistor={persistor}>
          <MainLayout className={nunito.className}>
            <>
              <PageLoader />
              <Component {...pageProps} />
            </>
          </MainLayout>
        </PersistGate>
      </Provider>
    </SessionProvider>
  );
}
