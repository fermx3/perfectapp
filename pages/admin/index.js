import Link from 'next/link';

import { getSession } from 'next-auth/react';
import Container from '@/components/layout/container';

export default function AdminPage() {
  return (
    <Container md>
      <header>
        <h1>Página de Administración</h1>
        <h3>Bienvenido</h3>
      </header>
      <main>
        <nav>
          <ul>
            <li>
              <Link href={'/admin/crear-cliente'}>Crear Leal</Link>
            </li>
            <li>
              <Link href={'/admin'}>Crear Asesor</Link>
            </li>
            <li>
              <Link href={'/admin'}>Crear Cliente</Link>
            </li>
          </ul>
        </nav>
      </main>
    </Container>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });

  if (!session || session.user.role !== 'ADMIN') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
