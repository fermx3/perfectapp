import Head from 'next/head';
import Image from 'next/image';
import Question from '@/components/question';

import { Inter } from 'next/font/google';

import classes from './index.module.scss';
import Logo from '@/components/logo/logo';

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
          <Question
            question='Bienvenido/a! Primero selecciona tu rol:'
            options={[
              { name: 'Leal', link: '/cliente/login' },
              { name: 'Asesor', link: '/asesor' },
              { name: 'Cliente', link: '/usuario' },
            ]}
          />
        </div>
      </main>
    </>
  );
}
