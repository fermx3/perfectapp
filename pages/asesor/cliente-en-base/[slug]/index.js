import { getSession } from 'next-auth/react';
import { getCliente } from '@/lib/prismaDB';

import Button, { BUTTON_TYPE_CLASSES } from '@/components/button';
import LayoutDashboard from '@/components/cliente/layout-dashboard';

import { ClienteEnBaseContext } from '@/store/clienteEnBase.context';
import { UserContext } from '@/store/user-context';
import moment from 'moment';
import { useContext } from 'react';
import ClienteEnBase1 from '@/components/cliente-en-base/cliente-en-base';

export default function VisitaPage({ cliente }) {
  const { setVisitaActual, visitaActual } = useContext(ClienteEnBaseContext);
  const { currentUser } = useContext(UserContext);
  console.log(visitaActual);
  console.log(currentUser);

  const onClickHandler = function () {
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
  };

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
        {visitaActual.inicioVisita && <ClienteEnBase1 />}
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
