import { useRouter } from 'next/router';
import moment from 'moment';
import 'moment/locale/es-mx';

import Container from '../layout/container';
import Link from 'next/link';

import classes from './layout-dashboard.module.scss';

export default function LayoutDashboard({
  children,
  nombre,
  nivelDeCliente,
  leales,
  cadena,
  role,
  userId,
  asesores,
  ubicacion,
}) {
  return (
    <Container>
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
          {asesores && (
            <div className={classes.asesores}>
              <h4>Asesores:</h4>
              {asesores.map((asesor) => (
                <div key={asesor}>
                  <p>{asesor}</p>
                </div>
              ))}
            </div>
          )}
          {nivelDeCliente && <p>Prioridad {nivelDeCliente}</p>}
          {cadena && <p>{`Cadena: ${cadena}`}</p>}
          {leales && <p>{`Leales: ${leales}`}</p>}
        </div>
        {/* <nav className={classes.nav}>
          <ul>
            <li>
              <Link href={`/${role}/${userId}`}>Home</Link>
            </li>
            <li>
              <Link href={`/${role}/${userId}/promociones`}>Promociones</Link>
            </li>
            <li>
              <Link href={`/${role}/${userId}/perfil`}>Perfil</Link>
            </li>
          </ul>
        </nav> */}
      </header>
      {children}
    </Container>
  );
}
