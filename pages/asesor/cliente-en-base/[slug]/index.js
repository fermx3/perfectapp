import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';

import { getLeal, getSettings } from '@/lib/db';

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
import {
  getAvanceDeCuota,
  getMensajesAsesores,
  getVisitasConOrdenesPorCliente,
} from '@/lib/db';
import Container from '@/components/layout/container';

// const mensajesAsesores = {
//   infoDeCategoria: {
//     titulo: 'Información de la categoría',
//     contenido:
//       'Para comenzar, necesitamos información sobre los competidores y los gramajes de la categoría.',
//   },
//   infoFidelizacion: null,
//   infoComunicacion: { titulo: 'Información de comunicación', contenido: '' },
// };

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
  mensajesAsesores,
  avance,
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
        grupo={leal.grupo}
        nombre={leal.nombre}
        nivelDeCliente={leal.nivelDeCliente}
        cadena={leal.cadena}
        leales={leal.leales}
      />
      <Dashboard
        cuota={leal.cuotaPallets}
        promocionesDisponibles={promocionesDisponibles}
        puntos={leal.datosLeal?.puntosLeal}
        avance={avance}
        session={session}
        valorDePuntos={leal.valorDePuntos}
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
          <ClienteEnBase1
            competidores={competidores}
            gramajes={gramajes}
            infoDeCategoria={mensajesAsesores.infoDeCategoria}
          />
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
            valorDePuntos={leal.valorDePuntos}
            cuotaPallets={leal.cuotaPallets}
            promocionesDisponibles={promocionesDisponibles}
            infoFidelizacion={mensajesAsesores.infoFidelizacion}
          />
        )}
      {visitaActual.inicioVisita &&
        visitaActual.numeroDeCliente === router.query.slug &&
        currentStage === 2 && (
          <ClienteEnBase3
            prevHandler={prevHandler}
            skus={skus}
            materialesDeComunicacion={materialesDeComunicacion}
            infoComunicacion={mensajesAsesores.infoComunicacion}
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

  const empresa = session?.user?.empresa;
  const leal = await getLeal(slug);
  const {
    promocionesDelMes,
    distribuidores,
    competidores,
    gramajes,
    opcionesDeNoCompra,
    skus,
    materialesDeComunicacion,
  } = await getSettings(empresa);
  // const promociones = await getPromociones(empresa);
  const nivelDeCliente = leal.nivelDeCliente.toLowerCase();
  const promocionesDisponibles = promocionesDelMes
    .filter((promocion) => {
      const promociones = promocion.nivelDeCliente.includes(nivelDeCliente);
      return promociones;
    })
    .map((promocion) => ({ desc: promocion.promo, sku: promocion.sku }));
  // const opcionesDeNoCompra = await getOpcionesDeNoCompra(empresa);
  // const distribuidores = await getDistribuidores(empresa);

  const yearMonth = moment().format('YYYY-MM');

  const visitasConOrdenes = await getVisitasConOrdenesPorCliente(yearMonth, [
    slug,
  ]);

  const avance = await getAvanceDeCuota(slug, yearMonth);

  const mensajesAsesores = await getMensajesAsesores();

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
      visitasConOrdenes,
      mensajesAsesores,
      avance,
    },
  };
}
