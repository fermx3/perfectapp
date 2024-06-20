import { getSession } from 'next-auth/react';
import { getLeal, getSettings } from '@/lib/prismaDB';
import moment from 'moment';

import Dashboard from '@/components/dashboard/dashboard';
import ButtonGroup from '@/components/button-group';
import Button, { BUTTON_TYPE_CLASSES } from '@/components/button';

import classes from './index.module.scss';
import Container from '@/components/layout/container';
import { getVisitasConOrdenesPorCliente } from '@/lib/db';

export default function PanelDeLeal({
  leal,
  promocionesDisponibles,
  session,
  visitasConOrdenes,
}) {
  return (
    <Container>
      <header className={classes.header}>
        <div>
          <h2>Hola {leal.nombre}</h2>
          <p className={classes.nivel}>
            Nivel {leal.nivelDeCliente.toLowerCase()}
          </p>
          <Container>
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
        </div>
        <Dashboard
          cuota={leal.cuotaPallets}
          puntos={leal.datosLeal?.puntosLeal}
          promocionesDisponibles={promocionesDisponibles}
          session={session}
          avance={visitasConOrdenes}
        />
        <ButtonGroup
          options={[
            { name: 'Cambiar contraseña', link: '/cambiar-password' },
            { name: 'Actualiza tus datos', link: '/leal/actualizar-datos' },
          ]}
        />
      </header>
      <main className={classes.main}>
        <ButtonGroup
          options={[
            { name: 'Whatsapp', link: '#', disabled: true },
            {
              name: 'e-mail',
              link: '#',
              disabled: true,
            },
            { name: 'Encuesta', link: '#', disabled: true },
          ]}
        />
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

  const yearMonth = moment().format('YYYY-MM');

  const visitasConOrdenes = await getVisitasConOrdenesPorCliente(
    yearMonth,
    clientID
  );

  if (!leal.datosLeal?.firstLoginDate) {
    return {
      redirect: {
        destination: '/cambiar-password',
        permanent: false,
      },
    };
  }

  return {
    props: { session, leal, promocionesDisponibles, visitasConOrdenes },
  };
}
