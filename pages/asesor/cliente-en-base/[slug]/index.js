import { useContext } from 'react';
import { getSession } from 'next-auth/react';
import { getCliente } from '@/lib/prismaDB';
import { VisitaActualContext } from '@/store/visitaActual.context';

import Button, { BUTTON_TYPE_CLASSES } from '@/components/button';
import LayoutDashboard from '@/components/cliente/layout-dashboard';
import ClienteEnBase1 from '@/components/cliente-en-base/cliente-en-base';
import ClienteEnBase2 from '@/components/cliente-en-base/cliente-en-base-2';
import ClienteEnBase3 from '@/components/cliente-en-base/cliente-en-base-3';

import moment from 'moment';
import { useRouter } from 'next/router';
import ClienteEnBaseResumen from '@/components/cliente-en-base/cliente-en-base-resumen';

export default function VisitaPage({ cliente, session }) {
  const { setVisitaActual, visitaActual, currentStage, prevStage } =
    useContext(VisitaActualContext);
  // const { currentStage, setCurrentStage } = useContext(StageContext);

  console.log(visitaActual);
  console.log(currentStage);

  const router = useRouter();

  function prevHandler() {
    prevStage();
  }

  function onClickHandler() {
    if (visitaActual.inicioVisita) {
      return;
    }
    const inicioVisita = moment().format();
    setVisitaActual({
      ...visitaActual,
      asesor: session.user.userId,
      numeroDeCliente: cliente.userId,
      inicioVisita: inicioVisita,
    });
  }

  return (
    <>
      <LayoutDashboard
        session={session}
        userId={router.query.slug}
        role='LEAL'
        nombre={cliente.nombre}
        nivelDeCliente={cliente.nivelDeCliente}
        cadena={cliente.cadena}
        leales={cliente.leales}
      >
        <Button
          onClick={onClickHandler}
          buttonType={visitaActual.inicioVisita && BUTTON_TYPE_CLASSES.disabled}
          disabled={visitaActual.inicioVisita}
        >
          Comenzar visita
        </Button>
        {visitaActual.inicioVisita && currentStage === 0 && <ClienteEnBase1 />}
        {visitaActual.inicioVisita && currentStage === 1 && (
          <ClienteEnBase2 prevHandler={prevHandler} />
        )}
        {visitaActual.inicioVisita && currentStage === 2 && (
          <ClienteEnBase3 prevHandler={prevHandler} />
        )}
        {visitaActual.inicioVisita && currentStage === 3 && (
          <ClienteEnBaseResumen prevHandler={prevHandler} />
        )}
      </LayoutDashboard>
    </>
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

  const cliente = await getCliente(slug);

  return {
    props: { session, cliente },
  };
}
