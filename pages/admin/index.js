import Link from 'next/link';

import { getSession } from 'next-auth/react';
import Container from '@/components/layout/container';
import LinksGroup from '@/components/ui/links-group';

const links = [
  {
    titulo: 'Mensajes de Asesores',
    link: '/admin/mensajes-asesores',
    desc: 'Cambia los mensjes que ven los Asesores.',
  },
  {
    titulo: 'Cambiar valor de puntos por cliente',
    link: '#',
    desc: 'Cambia el valor de los puntos por cliente.',
  },
  {
    titulo: 'Cambiar promociones del mes',
    link: '/admin/promociones-del-mes',
    desc: 'Modifica las promocones del mes por tipo de cliente.',
  },
  {
    titulo: 'Validar prospectos',
    link: '#',
    desc: 'Validar prospectos que han sido agregados por asesores.',
  },
];

export default function AdminPage() {
  return (
    <Container>
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
