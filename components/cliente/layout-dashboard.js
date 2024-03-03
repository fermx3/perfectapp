import Link from 'next/link';
import { useRouter } from 'next/router';

import classes from './layout-dashboard.module.scss';
import Container from '../layout/container';

export default function LayoutDashboard({
  children,
  nombre,
  role,
  nivelDeCliente,
}) {
  const router = useRouter();

  const { userId } = router.query;

  return (
    <Container>
      <header>
        <div>
          {role === 'asesor' && <h4>Asesor</h4>}
          <h1>{nombre}</h1>
          <p>
            {role === 'cliente'
              ? `Numero de cliente: ${userId}`
              : `Usuario: ${userId}`}
          </p>
          {nivelDeCliente && <p>Cliente {nivelDeCliente}</p>}
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
