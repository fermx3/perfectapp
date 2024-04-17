import Link from 'next/link';

import { getSession } from 'next-auth/react';
import Container from '@/components/layout/container';
import LinksGroup from '@/components/ui/links-group';

const links = [
  {
    titulo: 'Crear Leal',
    link: '/admin/crear-leal',
    desc: 'Haz click aquí para crear un cliente LEAL.',
  },
  {
    titulo: 'Crear Asesor',
    link: '#',
    desc: 'Haz click aquí para crear un Asesor.',
  },
  {
    titulo: 'Crear Cliente',
    link: '#',
    desc: 'Haz click aquí para crear un Cliente.',
  },
];

export default function AdminPage() {
  return (
    <Container md>
      <header>
        <h1>Página de Administración</h1>
        <h3>Bienvenido</h3>
      </header>
      <main>
        <LinksGroup links={links} />
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
