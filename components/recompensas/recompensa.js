import Image from 'next/image';

import classes from './recompensa.module.scss';

export default function Recompensa({ recompensa, role }) {
  const puntos = new Intl.NumberFormat().format(
    recompensa.valorCajas || recompensa.valorPuntos
  );

  console.log(recompensa.valorPuntos);

  return (
    <div className={classes.recompensaContainer}>
      <div className={classes.puntos}>
        {recompensa.valorCajas ? (
          <p>Valor en cajas:</p>
        ) : (
          <p>Valor en puntos:</p>
        )}
        <p>{puntos}</p>
        {recompensa.valorCajas && <p>de {recompensa.sku}</p>}
      </div>
      <div className={classes.imageContainer}>
        {recompensa.image ? (
          <Image
            src={`/images/recompensasLeal/${recompensa.image}`}
            alt={recompensa.nombre}
            fill
          />
        ) : (
          <h3>{recompensa.nombre}</h3>
        )}
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
