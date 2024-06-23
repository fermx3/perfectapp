import Button, { BUTTON_TYPE_CLASSES } from '@/components/button';
import LayoutDashboard from '@/components/cliente/layout-dashboard';
import Dashboard from '@/components/dashboard/dashboard';
import Container from '@/components/layout/container';
import {
  getCuotaTotals,
  getUserIdsFromAGivenZonas,
  getUserIdsFromGivenZonasThatPurchased,
  getVisitasConOrdenesPorCliente,
} from '@/lib/db';
import { getPromociones, getUserInfo } from '@/lib/prismaDB';
import moment from 'moment';
import { getSession } from 'next-auth/react';

export default function AsesorMonitoreoPage({
  session,
  userInfo,
  cuotaTotal,
  promocionesDisponibles,
  visitasConOrdenes,
  clientesQueCompraron,
  userIdsFromAsesorZonas,
}) {
  return (
    <Container>
      <LayoutDashboard
        nombre={userInfo.nombre}
        role='ASESOR'
        userId={session.user.userId}
        zonasAsignadas={userInfo.zonaAsignada}
      />
      <Button
        href={`/asesor/${session.user.userId}`}
        buttonType={BUTTON_TYPE_CLASSES.secondary}
      >
        {'<'} Regresar
      </Button>
      <Dashboard
        cuota={cuotaTotal}
        promocionesDisponibles={promocionesDisponibles}
        avance={visitasConOrdenes}
        session={session}
        clientesQueCompraron={clientesQueCompraron}
        clientesTotales={userIdsFromAsesorZonas}
      />
    </Container>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });
  const { asesorId } = context.query;
  const userInfo = await getUserInfo(asesorId);
  const cuotaTotal = await getCuotaTotals(userInfo.zonaAsignada);
  const { promocionesDelMes } = await getPromociones('upfield');

  const promocionesDisponibles = promocionesDelMes.map((promocion) => {
    const nivelDeClienteString = promocion.nivelDeCliente.join(', ');
    return { desc: `${promocion.promo} [ ${nivelDeClienteString} ]` };
  });

  const userIdsFromAsesorZonas = await getUserIdsFromAGivenZonas(
    userInfo.zonaAsignada
  );

  const yearMonth = moment().format('YYYY-MM');

  const visitasConOrdenes = await getVisitasConOrdenesPorCliente(
    yearMonth,
    userIdsFromAsesorZonas
  );

  const clientesQueCompraron = await getUserIdsFromGivenZonasThatPurchased(
    yearMonth,
    [asesorId]
  );

  if (
    !session ||
    session.user.role !== 'ASESOR' ||
    userInfo.coordinador !== session.user.userId
  ) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
      userInfo,
      cuotaTotal,
      promocionesDisponibles,
      visitasConOrdenes,
      clientesQueCompraron,
      userIdsFromAsesorZonas,
    },
  };
}
