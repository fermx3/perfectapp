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

const socialMedia = [
  {
    title: 'linkedin',
    url: 'https://www.linkedin.com/company/perfectapp/',
    image: 'linkedin.svg',
  },
  {
    title: 'facebook',
    url: 'https://www.facebook.com/perfectapp.mx/',
    image: 'facebook.svg',
  },
  {
    title: 'instagram',
    url: 'https://www.instagram.com/perfectapp.mx/',
    image: 'instagram.svg',
  },
];

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
        <HomeHero socialMedia={socialMedia} />
        <NosotrosSection />
        <SolucionSection />
        <AyudaSection socialMedia={socialMedia} />
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
