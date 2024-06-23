import Image from 'next/image';

import Button, { BUTTON_TYPE_CLASSES } from '../button';

import classes from './hero.module.scss';
import Link from 'next/link';

export default function HomeHero() {
  return (
    <header className={classes.heroContainer}>
      <div className={classes.hero}>
        <div className={classes.heroText}>
          <div>
            <h1>SMART DATA CENTER</h1>
            <h2>Centraliza tu información en un solo lugar.</h2>
          </div>
          <div className={classes.cta}>
            <Button
              href='mailto:hola@ruta-perfectapp.com'
              buttonType={BUTTON_TYPE_CLASSES.secondary}
              target='_blank'
            >
              Solicita una demostración
            </Button>
            <p>Una app tan potente como sencilla.</p>
            <p>Conecta tus datos, equipos y clientes en una sola plataforma.</p>
          </div>
          <div className={classes.socialMedia}>
            <Link href='#'>
              <Image
                src='/images/home/icons/linkedin.svg'
                height={20}
                width={20}
                alt='linkedin icon'
              />
            </Link>
            <Link href='#'>
              <Image
                src='/images/home/icons/facebook.svg'
                height={20}
                width={20}
                alt='facebook icon'
              />
            </Link>
            <Link href='#'>
              <Image
                src='/images/home/icons/instagram.svg'
                height={20}
                width={20}
                alt='instagram icon'
              />
            </Link>
          </div>
        </div>
        <div className={classes.heroImg}>
          <Image
            src='/images/home/img-1.png'
            width={707 / 1.3}
            height={809 / 1.3}
            alt=''
            priority
          />
        </div>
      </div>
    </header>
  );
}
