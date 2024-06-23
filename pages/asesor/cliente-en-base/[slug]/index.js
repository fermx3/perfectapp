import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';

import { getLeal, getSettings } from '@/lib/prismaDB';

import Button, { BUTTON_TYPE_CLASSES } from '@/components/button';
import LayoutDashboard from '@/components/cliente/layout-dashboard';
import ClienteEnBase1 from '@/components/cliente-en-base/cliente-en-base';
import ClienteEnBase2 from '@/components/cliente-en-base/cliente-en-base-2';
import ClienteEnBase3 from '@/components/cliente-en-base/cliente-en-base-3';
import ClienteEnBaseResumen from '@/components/cliente-en-base/cliente-en-base-resumen';

import moment from 'moment';

import {
  setVisitaActual,
  prevStage,
  resetStage,
} from '@/store/visitaActual/visitaActual.reducer';
import {
  selectCurrentStage,
  selectVisitaActual,
} from '@/store/visitaActual/visitaActual.selector';
import Dashboard from '@/components/dashboard/dashboard';
import { getVisitasConOrdenesPorCliente } from '@/lib/db';
import Container from '@/components/layout/container';

export default function VisitaPage({
  leal,
  session,
  promocionesDisponibles,
  opcionesDeNoCompra,
  distribuidores,
  competidores,
  gramajes,
  skus,
  materialesDeComunicacion,
  visitasConOrdenes,
}) {
  const dispatch = useDispatch();
  const visitaActual = useSelector(selectVisitaActual);
  const currentStage = useSelector(selectCurrentStage);

  const router = useRouter();

  function prevHandler() {
    dispatch(prevStage());
  }

  function onClickHandler() {
    if (
      visitaActual.inicioVisita &&
      visitaActual.numeroDeCliente === router.query.slug
    ) {
      return;
    }
    const inicioVisita = moment().format();
    dispatch(resetStage());
    dispatch(
      setVisitaActual({
        asesor: session.user.userId,
        numeroDeCliente: leal.userId,
        inicioVisita: inicioVisita,
      })
    );
  }

  return (
    <Container>
      <LayoutDashboard
        session={session}
        ubicacion={leal.ubicacion}
        userId={router.query.slug}
        role='LEAL'
        nombre={leal.nombre}
        nivelDeCliente={leal.nivelDeCliente}
        cadena={leal.cadena}
        leales={leal.leales}
      />
      <Dashboard
        cuota={leal.cuotaPallets}
        promocionesDisponibles={promocionesDisponibles}
        puntos={leal.datosLeal?.puntosLeal}
        avance={visitasConOrdenes}
        session={session}
      />
      <Button
        onClick={onClickHandler}
        buttonType={
          visitaActual.inicioVisita &&
          visitaActual.numeroDeCliente === router.query.slug
            ? BUTTON_TYPE_CLASSES.disabled
            : BUTTON_TYPE_CLASSES.base
        }
        disabled={
          visitaActual.inicioVisita &&
          visitaActual.numeroDeCliente === router.query.slug
        }
      >
        Comenzar visita
      </Button>
      {visitaActual.inicioVisita &&
        visitaActual.numeroDeCliente === router.query.slug &&
        currentStage === 0 && (
          <ClienteEnBase1 competidores={competidores} gramajes={gramajes} />
        )}
      {visitaActual.inicioVisita &&
        visitaActual.numeroDeCliente === router.query.slug &&
        currentStage === 1 && (
          <ClienteEnBase2
            prevHandler={prevHandler}
            opcionesDeNoCompra={opcionesDeNoCompra}
            distribuidores={distribuidores}
            promociones={promocionesDisponibles}
            skus={skus}
          />
        )}
      {visitaActual.inicioVisita &&
        visitaActual.numeroDeCliente === router.query.slug &&
        currentStage === 2 && (
          <ClienteEnBase3
            prevHandler={prevHandler}
            skus={skus}
            materialesDeComunicacion={materialesDeComunicacion}
          />
        )}
      {visitaActual.inicioVisita &&
        visitaActual.numeroDeCliente === router.query.slug &&
        currentStage === 3 && (
          <ClienteEnBaseResumen prevHandler={prevHandler} />
        )}
    </Container>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });
  const { slug } = context.query;

  if (!session || session.user.role !== 'ASESOR') {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const leal = await getLeal(slug);
  const {
    promocionesDelMes,
    distribuidores,
    competidores,
    gramajes,
    opcionesDeNoCompra,
    skus,
    materialesDeComunicacion,
  } = await getSettings('upfield');
  // const promociones = await getPromociones('upfield');
  const nivelDeCliente = leal.nivelDeCliente.toLowerCase();
  const promocionesDisponibles = promocionesDelMes
    .filter((promocion) => {
      const promociones = promocion.nivelDeCliente.includes(nivelDeCliente);
      return promociones;
    })
    .map((promocion) => promocion.promo);
  // const opcionesDeNoCompra = await getOpcionesDeNoCompra('upfield');
  // const distribuidores = await getDistribuidores('upfield');

  const yearMonth = moment().format('YYYY-MM');

  const visitasConOrdenes = await getVisitasConOrdenesPorCliente(yearMonth, [
    slug,
  ]);

  return {
    props: {
      session,
      leal,
      promocionesDisponibles,
      opcionesDeNoCompra,
      distribuidores,
      competidores,
      gramajes,
      skus,
      materialesDeComunicacion,
      visitasConOrdenes: visitasConOrdenes || [],
    },
  };
}
