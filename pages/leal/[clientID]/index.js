import { useState } from 'react';
import { getSession } from 'next-auth/react';
import { getSettings } from '@/lib/db';
import { getLeal } from '@/lib/db';
import moment from 'moment';

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
import InputGroup from '@/components/forms/input-group';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { aceptarTyCSchema } from '@/lib/schemas/schemas';

export default function PanelDeLeal({
  leal,
  promocionesDisponibles,
  session,
  avance,
  recompensasLeal,
  bannersLeales,
  skus,
}) {
  const [isModalOpen, setIsModalOpen] = useState(!leal.aceptoTyC);
  const [successMessage, setSuccessMessage] = useState('');
  const [aceptoTyC, setAceptoTyC] = useState(leal.aceptoTyC);

  const hasDatosCompletos = leal.datosLeal?.nombreDelEncargado ? true : false;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      aceptoTyC: false,
    },
    resolver: zodResolver(aceptarTyCSchema),
  });

  const handleAcepto = async (data) => {
    const result = await fetch('/api/leal/aceptarTyCs', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!result.ok) {
      console.log('Error al aceptar los términos y condiciones');
    } else {
      setSuccessMessage('Términos y condiciones aceptados');
      setAceptoTyC(true);
    }
  };

  const handleCerrarTyC = () => {
    setIsModalOpen(false);
    setSuccessMessage('');
  };

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
              <Carousel
                slides={bannersLeales}
                options={OPTIONS}
                requisitos={{
                  datosCompletos: hasDatosCompletos,
                  fecha: moment().format('YYYY-MM-DD') > '2024-08-03',
                }}
              />
              {/* {!hasDatosCompletos && (
                <Button
                  href='/leal/actualizar-datos'
                  buttonType={BUTTON_TYPE_CLASSES.secondary}
                >
                  Actualiza tus datos y gana 3,000 puntos
                </Button>
              )} */}
            </div>
            <Dashboard
              cuota={leal.cuotaPallets}
              puntos={leal.datosLeal?.puntosLeal}
              promocionesDisponibles={promocionesDisponibles}
              session={session}
              avance={avance}
              valorDePuntos={leal.valorDePuntos}
              skus={skus}
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
                },
                {
                  image: '/images/icons/links/mail.svg',
                  link: 'mailto:hola@ruta-perfectapp.com?subject=Soy Leal y necesito asistencia',
                  newPage: true,
                  buttonType: BUTTON_TYPE_CLASSES.icon,
                  tooltip: 'e-mail',
                },
                {
                  image: '/images/icons/links/encuesta.svg',
                  link: '#',
                  buttonType: BUTTON_TYPE_CLASSES.iconDisabled,
                  tooltip: 'Encuesta',
                },
                {
                  name: 'Términos y Condiciones Leales',
                  onClick: () => setIsModalOpen(true),
                  buttonType: BUTTON_TYPE_CLASSES.link,
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
            contenidoHTML={
              successMessage ? (
                <div>
                  <p>{successMessage}</p>
                  <Button onClick={handleCerrarTyC}>Cerrar</Button>
                </div>
              ) : (
                <TycProgramaFidelizacion />
              )
            }
            clickHandler={handleCerrarTyC}
          />
          {!successMessage && !aceptoTyC && (
            <form
              className={classes.form}
              onSubmit={handleSubmit(handleAcepto)}
            >
              <InputGroup>
                <label htmlFor='aceptoTyC'>
                  He leído y acepto los términos y condiciones del programa de
                  fidelización
                </label>
                <input
                  type='checkbox'
                  id='aceptoTyC'
                  {...register('aceptoTyC')}
                />
                {errors.aceptoTyC?.message && (
                  <p>{errors.aceptoTyC?.message}</p>
                )}
              </InputGroup>
              <Button buttonType={BUTTON_TYPE_CLASSES.secondary}>Acepto</Button>
            </form>
          )}
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

  const empresa = session?.user?.empresa;
  const { promocionesDelMes, skus } = await getSettings(empresa);

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
      skus,
    },
  };
}
