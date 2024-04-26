import { getSession } from 'next-auth/react';
import { getLeal } from '@/lib/prismaDB';
import Link from 'next/link';

import classes from './index.module.scss';

export default function PanelDeLeal({ leal }) {
  return (
    <div className={classes.preview}>
      <header>
        <div>
          <h2>Hola {leal.nombre}</h2>
          <p>Nivel {leal.nivelDeCliente.toLowerCase()}</p>
          <p>Puntos leales: {leal.datosLeal.puntosLeal}</p>
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
        <p>Pronto descubrirás cómo puedes ganar por tu lealtad.</p>
        <p>Acércate a tu asesor.</p>
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
