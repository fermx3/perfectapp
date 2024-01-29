import Link from 'next/link';
import { useRouter } from 'next/router';

import classes from './layout-cliente.module.scss';

export default function LayoutCliente({ children }) {
  const router = useRouter();

  return (
    <>
      <header>
        <p>Numero de cliente: {router.query.clientID}</p>
        <div>
          <h1>Hola NOMBRE DEL NEGOCIO</h1>
        </div>
        <nav className={classes.nav}>
          <ul>
            <li>
              <Link href={`/cliente/${router.query.clientID}`}>Home</Link>
            </li>
            <li>
              <Link href={`/cliente/${router.query.clientID}/promociones`}>
                Promociones
              </Link>
            </li>
            <li>
              <Link href={`/cliente/${router.query.clientID}/perfil`}>
                Perfil
              </Link>
            </li>
          </ul>
        </nav>
      </header>
      {children}
    </>
  );
}
