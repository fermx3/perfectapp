import Image from 'next/image';

import Button from '../button';
import HomeSection from './section';

import classes from './nosotros.module.scss';

const bulletpoints = [
  {
    titulo: 'DECISIONES INFORMADAS',
    desc: 'Los consumidores cada vez son mas sofisticados y las Route to Markets se han tenido que adaptar y evolucionar, forzando que las categorías avancen a un ritmo acelerado. Para lograr una mejor toma de decisiones, la información tiene que ser oportuna, clara y precisa.',
  },
  {
    titulo: 'IDENTIFICACIÓN DE OPORTUNIDADES Y AMENAZAS',
    desc: 'Los cambios en los hábitos y decisiones de consumo resultan en oportunidades y amenazas. Tener en cuenta las tendencias y cambios es fundamental.',
  },
  {
    titulo: 'SEGMENTACIÓN DE MERCADO EFECTIVA',
    desc: '¿Sabes en donde "juega" tu marca? ¿Por qué te compran y en qué momentos? Son algunas preguntas básicas para definir una estrategia clara en el objetivo de tus mercado. Si no tienes estas respuestas, nosotros te ayudamos.',
  },
  {
    titulo: 'OPTIMIZACIÓN DE RECURSOS',
    desc: 'Un mal resultado no es necesariamente consecuencia de tu toma de decisiones, sino por falta de información útil para tomar una mejor decisión. Optimiza tus recursos, transforma tu gastos y pérdidas en efectividad y eficiencias.',
  },
];

export default function NosotrosSection() {
  return (
    <HomeSection id='nosotros'>
      <div className={classes.grid}>
        <div className={classes.mobileHeader}>
          <h3>PERFECTAPP</h3>
          <h2>¿Cómo me puede ayudar?</h2>
        </div>
        <div className={classes.image}>
          <Image
            src='/images/home/img-2.png'
            width={837 / 1.3}
            height={1293 / 1.3}
            alt=''
          />
        </div>
        <div className={classes.text}>
          <div className={classes.header}>
            <h3>PERFECTAPP</h3>
            <h2>¿Cómo me puede ayudar?</h2>
          </div>
          <div className={classes.content}>
            {bulletpoints.map((punto, index) => (
              <div className={classes.punto}>
                <div className={classes.puntoHeader}>
                  <h4 className={classes.number}>0{index + 1}</h4>
                  <h4>{punto.titulo}</h4>
                </div>
                <div className={classes.puntoDesc}>
                  <p>{punto.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className={classes.button}>
            <Button href='#'>Solicita una demostración</Button>
          </div>
        </div>
      </div>
    </HomeSection>
  );
}
