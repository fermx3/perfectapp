import Image from 'next/image';

import HomeSection, { SECTION_TYPE_CLASSES } from './section';
import Button from '../button';

import classes from './ayuda.module.scss';
import HomeFooter from './home-footer';

export default function AyudaSection() {
  return (
    <HomeSection sectionType={SECTION_TYPE_CLASSES.gradient} id='ayuda'>
      <div className={classes.grid}>
        <div className={classes.content}>
          <div className={classes.header}>
            <h3>SMART DATA CENTER</h3>
            <h2>¿CÓMO FUNCIONA?</h2>
          </div>
          <div className={classes.text}>
            El ciclo de información de PerfectApp tiene como objetivo
            garantizar, controlar y desarrollar la ejecución perfecta en los
            puntos de venta. A través de una metodología única, generamos
            información de valor y la presentamos de manera sencilla e intuitiva
            para ayudarte a conseguir tus objetivos.
          </div>
          <div className={classes.button}>
            <Button href='mailto:hola@ruta-perfectapp.com'>
              Solicita una demostración
            </Button>
          </div>
        </div>
        <div className={classes.image}>
          <Image src='/images/home/img-3.svg' width={700} height={600} alt='' />
        </div>
      </div>
      <HomeFooter />
    </HomeSection>
  );
}
