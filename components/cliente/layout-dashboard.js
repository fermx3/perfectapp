import { useRouter } from 'next/router';
import moment from 'moment';
import 'moment/locale/es-mx';

import classes from './layout-dashboard.module.scss';
import Button, { BUTTON_TYPE_CLASSES } from '../button';

export default function LayoutDashboard({
  nombre,
  nivelDeCliente,
  leales,
  grupo,
  cadena,
  role,
  userId,
  asesores,
  ubicacion,
  zonasAsignadas,
}) {
  return (
    <header>
      <div>
        {role === 'ASESOR' &&
          (asesores ? <h4>Coordinador</h4> : <h4>Asesor</h4>)}
        <h1>{nombre}</h1>
        {userId && (
          <p>
            {role === 'LEAL'
              ? `Numero de cliente: ${userId}`
              : `Usuario: ${userId}`}
          </p>
        )}
        {ubicacion && <p>{ubicacion}</p>}
        {role === 'ASESOR' && <p>{moment().format('LL')}</p>}
        {zonasAsignadas && (
          <>
            <h5>Zonas Asignadas:</h5>
            <ul>
              {zonasAsignadas.map((zonaAsignada) => (
                <li key={zonaAsignada}>{zonaAsignada.toUpperCase()}</li>
              ))}
            </ul>
          </>
        )}
        {asesores && (
          <div className={classes.asesores}>
            <h4>Asesores:</h4>
            {asesores.map((asesor) => (
              <Button
                key={asesor}
                href={`/coordinador/${asesor}`}
                buttonType={BUTTON_TYPE_CLASSES.secondary}
              >
                {asesor}
              </Button>
            ))}
          </div>
        )}
        {nivelDeCliente && <p>Prioridad {nivelDeCliente}</p>}
        {cadena && <p>{`Cadena: ${cadena}`}</p>}
        {grupo && <p>{`Grupo: ${grupo}`}</p>}
        {leales && <p>{`Leales: ${leales}`}</p>}
      </div>
    </header>
  );
}
