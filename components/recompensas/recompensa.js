import Image from 'next/image';

import classes from './recompensa.module.scss';

export default function Recompensa({ recompensa, role }) {
  return (
    <div className={classes.recompensaContainer}>
      <div className={classes.puntos}>
        <p>Valor en puntos:</p>
        <p>{recompensa.valorPuntos}</p>
      </div>
      <div className={classes.imageContainer}>
        <Image src={recompensa.image} alt={recompensa.nombre} fill />
      </div>
      <div className={classes.recompensaContent}>
        <div className={classes.header}>
          <h3>{recompensa.nombre}</h3>
        </div>
        <div className={classes.desc}>
          <p>{recompensa.desc}</p>
        </div>
        {role === 'ASESOR' && (
          <div className={classes.nivelesContainer}>
            <p>Nivel requerido:</p>
            <div className={classes.nivelesList}>
              {recompensa.nivelRequerido.map((nivel) => (
                <p key={nivel}>{nivel}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
