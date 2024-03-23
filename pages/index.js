import Head from 'next/head';
import Button from '@/components/button';

import { Inter } from 'next/font/google';

import classes from './index.module.scss';
import Logo from '@/components/logo/logo';
import Container from '@/components/layout/container';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  return (
    <>
      <Head>
        <title>perfect app</title>
        <meta name='description' content='app description' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.png' />
      </Head>
      <main className={classes.main}>
        <Logo />
        <div className={classes.header}>
          <Container md>
            <h1>Bienvenido/a a perfect app!</h1>
            <Button href='/cliente/login'>Acceder</Button>
          </Container>
        </div>
      </main>
    </>
  );
}
