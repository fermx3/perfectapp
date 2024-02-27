import Link from 'next/link';
import { useRouter } from 'next/router';

import classes from './layout-cliente.module.scss';
import Container from '../layout/container';

export default function LayoutCliente({
  children,
  nombreDelCliente,
  nivelDeCliente,
}) {
  const router = useRouter();

  const { clientID } = router.query;

  return (
    <Container>
      <header>
        <div>
          <h1>{nombreDelCliente}</h1>
          <p>Numero de cliente: {clientID}</p>
          <p>Cliente {nivelDeCliente}</p>
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
    </Container>
  );
}
