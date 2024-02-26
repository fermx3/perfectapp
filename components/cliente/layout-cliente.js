import Link from 'next/link';
import { useRouter } from 'next/router';

import classes from './layout-cliente.module.scss';

export default function LayoutCliente({ children, nombreDelCliente }) {
  const router = useRouter();

  const { clientID } = router.query;

  return (
    <>
      <header>
        <p>Numero de cliente: {clientID}</p>
        <div>
          <h1>Hola {nombreDelCliente}</h1>
        </div>
        <nav className={classes.nav}>
          <ul>
            <li>
              <Link href={`/cliente/${clientID}`}>Home</Link>
            </li>
            <li>
              <Link href={`/cliente/${clientID}/promociones`}>Promociones</Link>
            </li>
            <li>
              <Link href={`/cliente/${clientID}/perfil`}>Perfil</Link>
            </li>
          </ul>
        </nav>
      </header>
      {children}
    </>
  );
}
