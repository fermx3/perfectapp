import { getSession } from 'next-auth/react';
import { getUserInfo } from '@/lib/prismaDB';

import LayoutCliente from '@/components/cliente/layout-cliente';

import classes from './index.module.scss';

export default function PanelDeCliente({ userInfo }) {
  const isOnPreview = true;

  if (isOnPreview) {
    return (
      <div className={classes.preview}>
        <header>
          <h2>Hola {userInfo.nombreDelUser}</h2>
          <p>Nivel {userInfo.nivelDeCliente}</p>
        </header>
        <main>
          <h1>¡Bienvenido a la experiencia LEAL!</h1>
          <p>Pronto descubriras como tu lealtad te hará ganar.</p>
          <p>Pregunta a tu asesor.</p>
        </main>
        ;
      </div>
    );
  }

  return (
    <LayoutCliente nombreDelCliente={userInfo.nombreDelUser}>
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
    </LayoutCliente>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });
  const { clientID } = context.query;
  const userInfo = await getUserInfo(clientID);

  if (
    !session ||
    session.user.role !== 'CLIENTE' ||
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
    props: { session, userInfo },
  };
}
