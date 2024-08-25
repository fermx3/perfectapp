import { getSession } from 'next-auth/react';
import { getUserInfo } from '@/lib/db';

import LayoutDashboard from '@/components/cliente/layout-dashboard';
import LinksGroup from '@/components/ui/links-group';
import Container from '@/components/layout/container';
import Dashboard from '@/components/dashboard/dashboard';
import {
  getAvanceDeCuotaByZona,
  getCuotaTotals,
  getUserIdsFromAGivenZonas,
  getUserIdsFromGivenZonasThatPurchased,
  getSettings,
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
  skus,
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
          skus={skus}
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
              link: '/asesor/actividades-y-promociones',
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
  const yearMonth = moment().format('YYYY-MM');

  const avance = await getAvanceDeCuotaByZona(userInfo.zonaAsignada, yearMonth);

  // const asesores = userInfo.asesores
  //   ? userInfo.asesores
  //   : [session?.user.userId];

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

  const empresa = session?.user?.empresa;
  const { skus, promocionesDelMes } = await getSettings(empresa);
  const cuotaTotal = await getCuotaTotals(userInfo.zonaAsignada, empresa);
  const userIdsFromAsesorZonas = await getUserIdsFromAGivenZonas(
    userInfo.zonaAsignada,
    empresa
  );
  const clientesQueCompraron = await getUserIdsFromGivenZonasThatPurchased(
    yearMonth,
    userInfo.zonaAsignada,
    empresa
  );

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
