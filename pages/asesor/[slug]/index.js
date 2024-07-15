import { getSession } from 'next-auth/react';
import { getPromociones, getUserInfo } from '@/lib/prismaDB';

import LayoutDashboard from '@/components/cliente/layout-dashboard';
import LinksGroup from '@/components/ui/links-group';
import Container from '@/components/layout/container';
import Dashboard from '@/components/dashboard/dashboard';
import {
  getAvanceDeCuotaByZona,
  getCuotaTotals,
  getUserIdsFromAGivenZonas,
  getUserIdsFromGivenZonasThatPurchased,
} from '@/lib/db';
import moment from 'moment';
import BackgroundGradientContainer from '@/components/layout/background-gradient-container';

export default function AsesorPage({
  userInfo,
  session,
  cuotaTotal,
  promocionesDisponibles,
  clientesQueCompraron,
  userIdsFromAsesorZonas,
  avance,
}) {
  return (
    <BackgroundGradientContainer>
      <Container>
        <LayoutDashboard
          nombre={userInfo.nombre}
          userId={session.user.userId}
          role={session.user.role}
          asesores={userInfo.asesores}
        />
        <Dashboard
          session={session}
          cuota={cuotaTotal}
          avance={avance}
          promocionesDisponibles={promocionesDisponibles}
          clientesQueCompraron={clientesQueCompraron}
          clientesTotales={userIdsFromAsesorZonas}
        />
        <LinksGroup
          links={[
            {
              titulo: 'Cliente en Base',
              link: '/asesor/cliente-en-base',
              desc: 'Registra la visita de un cliente de nuestra base de datos.',
            },
            {
              titulo: 'Cliente Nuevo',
              link: '/asesor/cliente-nuevo',
              desc: 'Suma a un prospecto nuevo a nuestra base de datos.',
            },
            {
              titulo: 'Actividades y Promociones',
              link: '#',
              desc: 'Conoce las promociones disponibles y tabla de premios',
            },
          ]}
        />
      </Container>
    </BackgroundGradientContainer>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });
  const { slug } = context.query;

  const userInfo = await getUserInfo(slug);

  const cuotaTotal = await getCuotaTotals(userInfo.zonaAsignada);
  const { promocionesDelMes } = await getPromociones('upfield');

  const promocionesDisponibles = promocionesDelMes.map((promocion) => {
    const nivelDeClienteString = promocion.nivelDeCliente.join(', ');
    return { desc: `${promocion.promo} [ ${nivelDeClienteString} ]` };
  });

  const userIdsFromAsesorZonas = await getUserIdsFromAGivenZonas(
    userInfo.zonaAsignada
  );

  console.log('zonaAsignada', userInfo.zonaAsignada);

  const yearMonth = moment().format('YYYY-MM');

  const avance = await getAvanceDeCuotaByZona(userInfo.zonaAsignada, yearMonth);

  const asesores = userInfo.asesores
    ? userInfo.asesores
    : [session?.user.userId];

  const clientesQueCompraron = await getUserIdsFromGivenZonasThatPurchased(
    yearMonth,
    userInfo.zonaAsignada
  );

  console.log('clientesQueCompraron', clientesQueCompraron);

  if (
    !session ||
    session.user.role !== 'ASESOR' ||
    slug !== session.user.userId
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
      clientesQueCompraron,
      userIdsFromAsesorZonas,
      avance,
    },
  };
}
