import { useContext, useState } from 'react';
import { getSession } from 'next-auth/react';
import { getCliente } from '@/lib/prismaDB';

import { UserContext } from '@/store/user-context';
import { ClienteEnBaseContext } from '@/store/clienteEnBase.context';

import Button, { BUTTON_TYPE_CLASSES } from '@/components/button';
import LayoutDashboard from '@/components/cliente/layout-dashboard';
import ClienteEnBase1 from '@/components/cliente-en-base/cliente-en-base';
import ClienteEnBase2 from '@/components/cliente-en-base/cliente-en-base-2';
import ClienteEnBase3 from '@/components/cliente-en-base/cliente-en-base-3';

import moment from 'moment';
import { useRouter } from 'next/router';
import { StageContext } from '@/store/stage.context';

export default function VisitaPage({ cliente }) {
  const { setVisitaActual, visitaActual } = useContext(ClienteEnBaseContext);
  const { currentUser } = useContext(UserContext);
  const { currentStage, setCurrentStage } = useContext(StageContext);

  console.log(currentUser);
  console.log(visitaActual);
  console.log(currentStage);

  const router = useRouter();

  function submitHandler(event, newData) {
    // event.preventDefault();
    // setVisitaActual({ ...visitaActual, ...newData });
    // if (currentStage >= 2) {
    //   alert('Order Sent!');
    //   const finVisita = moment().format();
    //   //Upload to DB with finVisita
    //   setStage(0);
    //   setVisitaActual({});
    //   router.replace('/');
    // } else {
    //   setStage(currentStage + 1);
    // }
  }

  function prevHandler() {
    setCurrentStage(currentStage - 1);
  }

  function onClickHandler() {
    if (visitaActual.inicioVisita) {
      return;
    }
    const inicioVisita = moment().format();
    setVisitaActual({
      ...visitaActual,
      asesor: 'dummyNumber',
      numeroDeCliente: cliente.userId,
      inicioVisita: inicioVisita,
    });
  }

  return (
    <>
      <LayoutDashboard
        role='leal'
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
        {visitaActual.inicioVisita && currentStage === 0 && (
          <ClienteEnBase1 submitHandler={submitHandler} />
        )}
        {visitaActual.inicioVisita && currentStage === 1 && (
          <ClienteEnBase2
            submitHandler={submitHandler}
            prevHandler={prevHandler}
          />
        )}
        {visitaActual.inicioVisita && currentStage === 2 && (
          <ClienteEnBase3
            submitHandler={submitHandler}
            prevHandler={prevHandler}
          />
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
        destination: '/cliente/login',
        permanent: false,
      },
    };
  }

  const cliente = await getCliente(slug);

  return {
    props: { session, cliente },
  };
}
