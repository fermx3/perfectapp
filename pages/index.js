import Head from 'next/head';
import Image from 'next/image';
import Question from '@/components/question';

import { Inter } from 'next/font/google';

import classes from './index.module.scss';

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
        <div className={classes.logo}>
          <Image
            src={'/images/perfect-logo.png'}
            width={100}
            height={100}
            alt='perfect logo'
          />
          <h1>perfect app</h1>
        </div>
        <div className={classes.header}>
          <Question
            question='Bienvenido/a! Primero selecciona tu rol:'
            options={[
              { name: 'Cliente', link: '/cliente' },
              { name: 'Operador', link: '/operador' },
              { name: 'Usuario', link: '/usuario' },
            ]}
          />
        </div>
      </main>
    </>
  );
}
