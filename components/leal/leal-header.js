import Image from 'next/image';
import classes from './leal-header.module.scss';

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

  return (
    <header className={classes.header}>
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
    </header>
  );
}
