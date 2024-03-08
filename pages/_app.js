import MainLayout from '@/components/layout/main-layout';
import '@/styles/globals.css';

import { SessionProvider } from 'next-auth/react';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { setCurrentUser } from '@/store/user/user.action';
import { getUserInfo } from '@/lib/prismaDB';
import {wrapper}

export default function App({ Component, pageProps, session }) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (session) {
      console.log(session);
      // const userInfo = getUserInfo();
      // dispatch(setCurrentUser(userInfo));
    }
  }, []);

  return (
    <SessionProvider session={session}>
      <Provider store={store}>
        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
      </Provider>
    </SessionProvider>
  );
}
