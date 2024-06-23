import Image from 'next/image';
import HomeSection, { SECTION_TYPE_CLASSES } from './section';

import classes from './solucion.module.scss';
import Button from '../button';

const cards = [
  {
    titulo: 'CÓMO VIVE TU AUDIENCIA',
    desc: 'Conocer a tu audiencia es fundamental, en un análisis de todo el ecosistema digital entenderemos las prioridades, filias y fobias, para asegurar tu estrategia digital.',
    link: '#',
    icon: 'audiencia.svg',
  },
  {
    titulo: 'LA RUTA DE...',
    desc: 'Entender los motores de compra de toda la cadena de suministro, las evoluciones de la ruta de mercado y el lugar que juega tu marca en la categoría son fundamentales, esto garantizara que tu producto correcto esté disponible para tu consumidor final.',
    link: '#',
    icon: 'ruta.png',
  },
  {
    titulo: 'DATA SCIENCE',
    desc: 'Tu consumidor, tu marca, tu categoría, tus canales, tus rutas de mercado, tu competencia son elementos vitales para la toma de decisiones, con información periódica y precisa tomarás mejores decisiones.',
    link: '#',
    icon: 'data-science.svg',
  },
  {
    titulo: 'MUTE',
    desc: 'Metodología para el desarrollo de estrategias de mercado y planes de posicionamiento. \nMomento / Ubicación / Todos / Estrategia',
    link: '#',
    icon: 'mute.svg',
  },
];

export default function SolucionSection() {
  return (
    <HomeSection sectionType={SECTION_TYPE_CLASSES.secondary} id='soluciones'>
      <div className={classes.grid}>
        <div className={classes.header}>
          <h2>Soluciones para todas las empresas</h2>
          <p>En Perfectapp, ayudamos a miles de clientes a crecer mejor.</p>
          <p>
            Descubre cuáles son los principales problemas a los que se enfrentan
            las empresas en expansión, y cómo nuestras soluciones y aplicaciones
            integradas pueden ayudarte a resolverlos.
          </p>
        </div>
        <div className={classes.cardsContainer}>
          {cards.map((card, index) => (
            <div className={classes.card} key={index}>
              <div className={classes.icon}>
                <Image src={`/images/home/icons/${card.icon}`} fill alt='' />
              </div>
              <div className={classes.text}>
                <h4>{card.titulo}</h4>
                <p>{card.desc}</p>
              </div>
              <div className={classes.button}>
                <Button href='mailto:hola@ruta-perfectapp.com' target='_blank'>
                  Más información
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </HomeSection>
  );
}
