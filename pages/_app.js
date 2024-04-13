import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from '@/store/store';

import MainLayout from '@/components/layout/main-layout';
import Loader from '@/components/ui/loader';

import '@/styles/globals.scss';

import { SessionProvider } from 'next-auth/react';
import { getUserInfo } from '@/lib/prismaDB';

export default function App({ Component, pageProps, session }) {
  return (
    <SessionProvider session={session}>
      <Provider store={store}>
        <PersistGate loading={<Loader />} persistor={persistor}>
          <MainLayout>
            <Component {...pageProps} />
          </MainLayout>
        </PersistGate>
      </Provider>
    </SessionProvider>
  );
}
