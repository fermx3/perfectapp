import Button, { BUTTON_TYPE_CLASSES } from '@/components/button';
import LayoutDashboard from '@/components/cliente/layout-dashboard';
import Dashboard from '@/components/dashboard/dashboard';
import BackgroundGradientContainer from '@/components/layout/background-gradient-container';
import Container from '@/components/layout/container';
import {
  getAvanceDeCuotaByZona,
  getCuotaTotals,
  getUserIdsFromAGivenZonas,
  getUserIdsFromGivenZonasThatPurchased,
  getUserInfo,
  getPromociones,
  getSettings,
} from '@/lib/db';
import moment from 'moment';
import { getSession } from 'next-auth/react';

export default function AsesorMonitoreoPage({
  session,
  userInfo,
  cuotaTotal,
  promocionesDisponibles,
  clientesQueCompraron,
  userIdsFromAsesorZonas,
  avance,
  skus,
}) {
  return (
    <BackgroundGradientContainer>
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
          avance={avance}
          session={session}
          clientesQueCompraron={clientesQueCompraron}
          clientesTotales={userIdsFromAsesorZonas}
          skus={skus}
        />
      </Container>
    </BackgroundGradientContainer>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });
  const { asesorId } = context.query;
  const userInfo = await getUserInfo(asesorId);
  const cuotaTotal = await getCuotaTotals(userInfo.zonaAsignada);

  const userIdsFromAsesorZonas = await getUserIdsFromAGivenZonas(
    userInfo.zonaAsignada
  );

  const yearMonth = moment().format('YYYY-MM');

  const avance = await getAvanceDeCuotaByZona(userInfo.zonaAsignada, yearMonth);

  const clientesQueCompraron = await getUserIdsFromGivenZonasThatPurchased(
    yearMonth,
    userInfo.zonaAsignada
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

  const empresa = session?.user?.empresa;
  const { promocionesDelMes } = await getPromociones(empresa);
  const { skus } = await getSettings(empresa);

  const promocionesDisponibles = promocionesDelMes.map((promocion) => {
    const nivelDeClienteString = promocion.nivelDeCliente.join(', ');
    return { desc: `${promocion.promo} [ ${nivelDeClienteString} ]` };
  });

  return {
    props: {
      session,
      userInfo,
      cuotaTotal,
      promocionesDisponibles,
      clientesQueCompraron,
      userIdsFromAsesorZonas,
      avance,
      skus,
    },
  };
}
