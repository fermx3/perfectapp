import BackgroundGradientContainer from '@/components/layout/background-gradient-container';
import Container from '@/components/layout/container';
import RecompensasGrid from '@/components/recompensas/recompensas-grid';
import { getRecompensasLeal } from '@/lib/db';
import { getSession } from 'next-auth/react';

export default function ActividadesYPromocionesPage({ recompensasLeal, role }) {
  return (
    <BackgroundGradientContainer>
      <Container>
        <h1>Actividades y Promociones</h1>
        <p>
          ¡Aquí encontrarás todas las actividades y promociones que tenemos para
          nuestros Leales!
        </p>
        <div>
          <RecompensasGrid recompensas={recompensasLeal} role={role} />
        </div>
      </Container>
    </BackgroundGradientContainer>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });

  //   const yearMonth = moment().format('YYYY-MM');

  const recompensasLeal = await getRecompensasLeal();
  const role = session?.user.role;

  if (!session || session.user.role !== 'ASESOR') {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: { recompensasLeal, role },
  };
}
