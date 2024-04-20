import { getSession } from 'next-auth/react';
import { getUserInfo } from '@/lib/prismaDB';

import LayoutDashboard from '@/components/cliente/layout-dashboard';

import classes from './index.module.scss';

export default function PanelDeLeal({ userInfo }) {
  console.log(userInfo);

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
