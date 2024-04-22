import { getSession } from 'next-auth/react';
import { getLeal, getUserInfo } from '@/lib/prismaDB';
import Link from 'next/link';

import LayoutDashboard from '@/components/cliente/layout-dashboard';

import classes from './index.module.scss';
import InfoMessage from '@/components/ui/info-message';

export default function PanelDeLeal({ leal }) {
  console.log(leal);
  console.log(leal.datosLeal);

  return (
    <div className={classes.preview}>
      <header>
        <div>
          <h2>Hola {leal.nombre}</h2>
          <p>Nivel {leal.nivelDeCliente}</p>
          <p>Puntos Leales: {leal.datosLeal.puntosLeal}</p>
        </div>
        <div>
          <div>
            <Link href='/cambiar-password'>Cambiar contraseña</Link>
          </div>
          <div>
            <Link href='/leal/actualizar-datos'>Actualiza tus datos</Link>
          </div>
        </div>
      </header>
      <main>
        <h1>¡Bienvenido a la experiencia LEAL!</h1>
        <p>Pronto descubriras como tu lealtad te hará ganar.</p>
        <p>Pregunta a tu asesor.</p>
        {!leal.datosLeal?.nombreDelEncargado && (
          <Link href='/leal/actualizar-datos'>
            Actualiza tus datos y gana 100 puntos
          </Link>
        )}
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

  const leal = await getLeal(clientID);

  if (!leal.datosLeal) {
    return {
      redirect: {
        destination: '/cambiar-password',
        permanent: false,
      },
    };
  }

  return {
    props: { session, leal },
  };
}
