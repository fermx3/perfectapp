import Head from 'next/head';

import HomeHero from '@/components/home-page/hero';
import NosotrosSection from '@/components/home-page/nosotros';
import SolucionSection from '@/components/home-page/solucion';
import AyudaSection from '@/components/home-page/ayuda';

import classes from './index.module.scss';
import { getAvisoDePrivacidad, getTerminosYCondiciones } from '@/lib/db';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  setAvisoDePrivacidad,
  setTerminosYCondiciones,
} from '@/store/footer/footer.reducer';

export default function Home({ avisoDePrivacidad, terminosYCondiciones }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setAvisoDePrivacidad(avisoDePrivacidad));
    dispatch(setTerminosYCondiciones(terminosYCondiciones));
  }, []);

  return (
    <>
      <Head>
        <title>Perfectapp</title>
        <meta name='description' content='app description' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
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

export async function getStaticProps() {
  const { avisoDePrivacidad } = await getAvisoDePrivacidad();
  const { terminosYCondiciones } = await getTerminosYCondiciones();

  return {
    props: { avisoDePrivacidad, terminosYCondiciones },
  };
}
