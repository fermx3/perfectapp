import Image from 'next/image';

import Button, { BUTTON_TYPE_CLASSES } from '../button';

import classes from './hero.module.scss';
import Link from 'next/link';

export default function HomeHero({ socialMedia }) {
  return (
    <header className={classes.heroContainer}>
      <div className={classes.hero}>
        <div className={classes.heroText}>
          <div>
            <h1>SMART DATA CENTER</h1>
            <h2>Centraliza tu información en un solo lugar.</h2>
          </div>
          <div className={classes.cta}>
            <Button href='/contacto' buttonType={BUTTON_TYPE_CLASSES.secondary}>
              Solicita una demostración
            </Button>
            <p>Una app tan potente como sencilla.</p>
            <p>Conecta tus datos, equipos y clientes en una sola plataforma.</p>
          </div>
          <div className={classes.socialMedia}>
            {socialMedia.map((link, index) => (
              <Link href={link.url} target='_blank' key={index}>
                <div className={classes.socialMediaLink}>
                  <Image
                    src={`/images/home/icons/${link.image}`}
                    fill
                    alt={`${link.title} icon`}
                  />
                </div>
              </Link>
            ))}
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
