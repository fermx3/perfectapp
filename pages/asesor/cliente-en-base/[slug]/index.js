import { getSession } from 'next-auth/react';
import { getCliente } from '@/lib/prismaDB';

import Button from '@/components/button';
import LayoutDashboard from '@/components/cliente/layout-dashboard';

export default function VisitaPage({ cliente }) {
  return (
    <>
      <LayoutDashboard
        role='leal'
        nombre={cliente.nombre}
        nivelDeCliente={cliente.nivelDeCliente}
        cadena={cliente.cadena}
        leales={cliente.leales}
      >
        <Button>Comenzar visita</Button>
      </LayoutDashboard>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });
  const { slug } = context.query;

  if (!session || session.user.role !== 'ASESOR') {
    return {
      redirect: {
        destination: '/cliente/login',
        permanent: false,
      },
    };
  }

  const cliente = await getCliente(slug);

  return {
    props: { session, cliente },
  };
}
