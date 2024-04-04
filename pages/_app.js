import MainLayout from '@/components/layout/main-layout';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from '@/store/store';

import '@/styles/globals.scss';

import { SessionProvider } from 'next-auth/react';

export default function App({ Component, pageProps, session }) {
  return (
    <SessionProvider session={session}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <MainLayout>
            <Component {...pageProps} />
          </MainLayout>
        </PersistGate>
      </Provider>
    </SessionProvider>
  );
}
