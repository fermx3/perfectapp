import Image from 'next/image';
import classes from './leal-header.module.scss';

import { motion } from 'framer-motion';

export default function LealHeader({ leal }) {
  const puntosLeal = leal?.datosLeal ? leal.datosLeal.puntosLeal : 0;
  let badgeUrl = '';

  switch (leal.nivelDeCliente) {
    case 'Platinum':
      badgeUrl = '/images/icons/badges/platinum.svg';
      break;
    case 'Oro':
      badgeUrl = '/images/icons/badges/oro.svg';
      break;
    case 'Plata':
      badgeUrl = '/images/icons/badges/plata.svg';
      break;
    default:
      badgeUrl = '/images/icons/badges/default.svg';
      break;
  }

  const variants = {
    hidden: { opacity: 0, scale: 0 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <motion.header
      className={classes.header}
      variants={variants}
      initial='hidden'
      animate='visible'
      transition={{
        duration: 0.2,
        delay: 0.3,
        ease: 'easeInOut',
        type: 'spring',
        mass: 0.5,
      }}
    >
      <div className={classes.nivelBadge}>
        <Image
          src={badgeUrl}
          fill
          alt={`nivel ${leal.nivelDeCliente.toLowerCase()} icon`}
        />
      </div>
      <div className={classes.nivelTexto}>
        <h3>NIVEL {leal.nivelDeCliente.toUpperCase()}</h3>
        <p>PUNTOS LEALES: {puntosLeal}</p>
      </div>
    </motion.header>
  );
}
