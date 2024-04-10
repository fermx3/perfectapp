import Head from 'next/head';
import Button from '@/components/button';

import { Inter } from 'next/font/google';

import classes from './index.module.scss';
import Logo from '@/components/logo/logo';
import Loader from '@/components/ui/loader';
import Container from '@/components/layout/container';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  return (
    <>
      <Head>
        <title>Perfectapp</title>
        <meta name='description' content='app description' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.png' />
      </Head>
      <main className={classes.main}>
        <div className={classes.header}>
          <Container md>
            <h1>Bienvenido/a a</h1>
            <Logo />
            <Button href='/login'>Acceder</Button>
          </Container>
        </div>
      </main>
    </>
  );
}
