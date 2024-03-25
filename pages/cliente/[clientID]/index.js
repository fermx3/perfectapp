import { getSession } from 'next-auth/react';
import { getUserInfo } from '@/lib/prismaDB';

import LayoutDashboard from '@/components/cliente/layout-dashboard';

import classes from './index.module.scss';

export default function PanelDeCliente({ userInfo }) {
  const isOnPreview = true;

  if (isOnPreview) {
    return (
      <div className={classes.preview}>
        <header>
          <h2>Hola {userInfo.nombre}</h2>
          <p>Nivel {userInfo.nivelDeCliente}</p>
        </header>
        <main>
          <h1>¡Bienvenido a la experiencia LEAL!</h1>
          <p>Pronto descubriras como tu lealtad te hará ganar.</p>
          <p>Pregunta a tu asesor.</p>
        </main>
      </div>
    );
  }

  return (
    <LayoutDashboard
      nombre={userInfo.nombre}
      role='leal'
      nivelDeCliente={userInfo.nivelDeCliente}
    >
      <main className={classes.main}>
        <div>
          <section className={classes.section}>
            <h2>Cliente {userInfo.nivelDeCliente}</h2>
          </section>
          <section className={classes.section}>
            <h2>Cuotas del mes</h2>
          </section>
          <section className={classes.section}>
            <h2>Canjear</h2>
          </section>
        </div>
        <section className={classes.section}>
          <h2>Dashboard</h2>
        </section>
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
        destination: '/login',
        permanent: false,
      },
    };
  }

  const userInfo = await getUserInfo(clientID);

  return {
    props: { session, userInfo },
  };
}
