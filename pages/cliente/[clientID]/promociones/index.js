import { getSession } from 'next-auth/react';

import LayoutCliente from '@/components/cliente/layout-cliente';

import classes from './index.module.scss';

export default function PromocionesClientePage() {
  return (
    <LayoutCliente>
      <main className={classes.main}>
        <div className={classes.section}>
          <h2>Promociones del mes</h2>
        </div>
      </main>
    </LayoutCliente>
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
