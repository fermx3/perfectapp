import { getSession } from 'next-auth/react';
import { getLeal, getSettings } from '@/lib/prismaDB';
import { motion } from 'framer-motion';

import Dashboard from '@/components/dashboard/dashboard';
import ButtonGroup from '@/components/button-group';
import Button, { BUTTON_TYPE_CLASSES } from '@/components/button';

import classes from './index.module.scss';
import Container from '@/components/layout/container';

export default function PanelDeLeal({ leal, promocionesDisponibles }) {
  return (
    <Container>
      <header className={classes.header}>
        <div>
          <h2>Hola {leal.nombre}</h2>
          <p className={classes.nivel}>
            Nivel {leal.nivelDeCliente.toLowerCase()}
          </p>
        </div>
        <Dashboard
          cuota={leal.cuotaPallets}
          puntos={leal.datosLeal?.puntosLeal}
          promocionesDisponibles={promocionesDisponibles}
        />
        <ButtonGroup
          options={[
            { name: 'Cambiar contraseña', link: '/cambiar-password' },
            { name: 'Actualiza tus datos', link: '/leal/actualizar-datos' },
          ]}
        />
      </header>
      <main className={classes.main}>
        <Container md>
          <h1>¡Bienvenido a la experiencia LEAL!</h1>
          <p>Pronto descubrirás cómo puedes ganar por tu lealtad.</p>
          <p>Acércate a tu asesor.</p>
          {!leal.datosLeal?.nombreDelEncargado && (
            <Button
              href='/leal/actualizar-datos'
              buttonType={BUTTON_TYPE_CLASSES.secondary}
            >
              Actualiza tus datos y gana 3,000 puntos
            </Button>
          )}
        </Container>
      </main>
    </Container>
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

  const { promocionesDelMes } = await getSettings('upfield');

  const leal = await getLeal(clientID);
  const nivelDeCliente = leal.nivelDeCliente.toLowerCase();
  const promocionesDisponibles = promocionesDelMes
    .filter((promocion) => {
      const promociones = promocion.nivelDeCliente.includes(nivelDeCliente);
      return promociones;
    })
    .map((promocion) => promocion.promo);

  if (!leal.datosLeal) {
    return {
      redirect: {
        destination: '/cambiar-password',
        permanent: false,
      },
    };
  }

  return {
    props: { session, leal, promocionesDisponibles },
  };
}
