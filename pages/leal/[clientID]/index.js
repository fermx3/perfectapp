import { getSession } from 'next-auth/react';
import { getLeal, getSettings } from '@/lib/prismaDB';
import moment from 'moment';

import { getVisitasConOrdenesPorCliente } from '@/lib/db';

import Dashboard from '@/components/dashboard/dashboard';
import ButtonGroup from '@/components/button-group';
import Button, { BUTTON_TYPE_CLASSES } from '@/components/button';
import Container from '@/components/layout/container';

import classes from './index.module.scss';
import Image from 'next/image';

export default function PanelDeLeal({
  leal,
  promocionesDisponibles,
  session,
  visitasConOrdenes,
}) {
  const puntosLeal = leal?.datosLeal ? leal.datosLeal.puntosLeal : 0;
  let badgeUrl = '';

  switch (leal.nivelDeCliente) {
    case 'Platinum':
      badgeUrl = '/images/icons/badges/platinum.svg';
      break;
    case 'Oro':
      badgeUrl = '/images/icons/badges/oro.svg';
      break;
    case 'Plata':
      badgeUrl = '/images/icons/badges/plata.svg';
      break;
    default:
      badgeUrl = '/images/icons/badges/default.svg';
      break;
  }

  return (
    <div className={classes.mainContainer}>
      <Container>
        <header className={classes.header}>
          <div className={classes.nivelBadge}>
            <Image
              src={badgeUrl}
              fill
              alt={`nivel ${leal.nivelDeCliente.toLowerCase()} icon`}
            />
          </div>
          <div>
            <h3>Nivel {leal.nivelDeCliente.toLowerCase()}</h3>
            <p>Puntos leales: {puntosLeal}</p>
          </div>
        </header>
        <main className={classes.main}>
          <div className={classes.hero}>
            <h2>Hola {leal.nombre}</h2>
            <h1>Bienvenido a la experiencia de Los Leales</h1>
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
              {
                name: 'Actualiza tus datos',
                link: '/leal/actualizar-datos',
                buttonType: BUTTON_TYPE_CLASSES.secondary,
              },
              {
                image: '/images/icons/links/whatsapp.svg',
                link: '#',
                buttonType: BUTTON_TYPE_CLASSES.icon,
                tooltip: 'WhatsApp',
                // disabled: true,
              },
              {
                image: '/images/icons/links/mail.svg',
                link: 'mailto:hola@ruta-perfectapp.com?subject=Soy Leal y necesito asistencia',
                newPage: true,
                buttonType: BUTTON_TYPE_CLASSES.icon,
                tooltip: 'e-mail',
                // disabled: true,
              },
              {
                image: '/images/icons/links/encuesta.svg',
                link: '#',
                buttonType: BUTTON_TYPE_CLASSES.icon,
                tooltip: 'Encuesta',
                // disabled: true,
              },
            ]}
          />
        </main>
      </Container>
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

  const { promocionesDelMes } = await getSettings('upfield');

  const leal = await getLeal(clientID);
  const nivelDeCliente = leal.nivelDeCliente.toLowerCase();
  const promocionesDisponibles = promocionesDelMes
    .filter((promocion) => {
      const promociones = promocion.nivelDeCliente.includes(nivelDeCliente);
      return promociones;
    })
    .map((promocion) => ({ desc: promocion.promo }));

  const yearMonth = moment().format('YYYY-MM');

  const visitasConOrdenes = await getVisitasConOrdenesPorCliente(yearMonth, [
    clientID,
  ]);

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
