import { getSession } from 'next-auth/react';

import LayoutDashboard from '@/components/cliente/layout-dashboard';

import classes from './index.module.scss';

export default function PromocionesClientePage() {
  return (
    <LayoutDashboard>
      <main className={classes.main}>
        <div className={classes.section}>
          <h2>Datos del cliente</h2>
        </div>
        <div className={classes.section}>
          <h2>Datos del negocio</h2>
        </div>
      </main>
    </LayoutDashboard>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });
  const { clientID } = context.query;

  if (
    !session ||
    session.user.role !== 'LEAL' ||
    clientID !== session.user.userId
  ) {
    return {
      redirect: {
        destination: '/cliente/login',
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
