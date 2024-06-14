import Head from 'next/head';

import HomeHero from '@/components/home-page/hero';
import NosotrosSection from '@/components/home-page/nosotros';
import SolucionSection from '@/components/home-page/solucion';

import classes from './index.module.scss';
import AyudaSection from '@/components/home-page/ayuda';

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
        <HomeHero />
        <NosotrosSection />
        <SolucionSection />
        <AyudaSection />
      </main>
    </>
  );
}
