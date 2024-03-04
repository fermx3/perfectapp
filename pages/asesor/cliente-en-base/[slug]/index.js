import { getSession } from 'next-auth/react';
import { getCliente } from '@/lib/prismaDB';

import LayoutDashboard from '@/components/cliente/layout-dashboard';

export default function VisitaPage({ cliente }) {
  console.log(cliente);

  return (
    <>
      <LayoutDashboard
        role='leal'
        clientId='111'
        nombre={cliente.nombre}
        nivelDeCliente={cliente.nivelDeCliente}
      >
        <h1>Comenzar visita</h1>
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
