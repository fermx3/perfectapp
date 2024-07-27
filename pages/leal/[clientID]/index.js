import { useState } from 'react';
import { getSession } from 'next-auth/react';
import { getLeal, getSettings } from '@/lib/prismaDB';
import moment from 'moment';
import Image from 'next/image';

import {
  getAvanceDeCuota,
  getBannersLeales,
  getRecompensasByNivel,
} from '@/lib/db';

import Dashboard from '@/components/dashboard/dashboard';
import ButtonGroup from '@/components/button-group';
import Button, { BUTTON_TYPE_CLASSES } from '@/components/button';
import Container from '@/components/layout/container';
import Modal from '@/components/ui/modal';
import ModalPage from '@/components/ui/modal-page';
import TycProgramaFidelizacion from '@/components/documentos/tyc-leales';
import BackgroundGradientContainer from '@/components/layout/background-gradient-container';

import classes from './index.module.scss';
import RecompensasGrid from '@/components/recompensas/recompensas-grid';
import LealHeader from '@/components/leal/leal-header';
import Carousel from '@/components/ui/carousel/carousel';

export default function PanelDeLeal({
  leal,
  promocionesDisponibles,
  session,
  avance,
  recompensasLeal,
  bannersLeales,
}) {
  const [isModalOpen, setIsModalOpen] = useState(true);

  const OPTIONS = { loop: true };

  return (
    <>
      <BackgroundGradientContainer>
        <Container>
          <h2 className={classes.nombre}>¡Hola {leal.nombre}!</h2>
          <LealHeader leal={leal} />
          <main className={classes.main}>
            <div className={classes.hero}>
              <h1>Bienvenido a la experiencia de Los Leales</h1>
              <p>Pronto descubrirás cómo puedes ganar por tu lealtad.</p>
              <p>Acércate a tu asesor.</p>
              <Carousel slides={bannersLeales} options={OPTIONS} />
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
              avance={avance}
            />
            <div className={classes.recompensasSection}>
              <RecompensasGrid
                recompensas={recompensasLeal}
                role={session.user.role}
                featured
              />
              <Button
                href={`/leal/${session.user.userId}/recompensas`}
                buttonType={BUTTON_TYPE_CLASSES.secondary}
              >
                Ver todas las recompensas
              </Button>
            </div>
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
                  link: 'https://wa.me/525569293104?text=Soy%20Leal%20y%20necesito%20asistencia',
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
                  disabled: true,
                },
              ]}
            />
          </main>
        </Container>
      </BackgroundGradientContainer>
      {isModalOpen && (
        <Modal>
          <ModalPage
            titulo='Términos y Condiciones - Programa de Fidelización de Upfield'
            contenidoHTML={<TycProgramaFidelizacion />}
            clickHandler={() => setIsModalOpen(false)}
          />
        </Modal>
      )}
    </>
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

  const avance = await getAvanceDeCuota(clientID, yearMonth);

  const recompensasLeal = await getRecompensasByNivel(nivelDeCliente);

  const bannersLeales = await getBannersLeales();

  if (!leal.datosLeal?.firstLoginDate) {
    return {
      redirect: {
        destination: '/cambiar-password',
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
      leal,
      promocionesDisponibles,
      avance,
      recompensasLeal,
      bannersLeales,
    },
  };
}
