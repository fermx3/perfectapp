import Button from '@/components/button';
import BackgroundGradientContainer from '@/components/layout/background-gradient-container';
import Container from '@/components/layout/container';
import LealHeader from '@/components/leal/leal-header';
import RecompensasGrid from '@/components/recompensas/recompensas-grid';
import { getRecompensasByNivel } from '@/lib/db';
import { getLeal } from '@/lib/db';
import { getSession } from 'next-auth/react';

import classes from './index.module.scss';

export default function RecompensasPage({ recompensasLeal, role, leal }) {
  return (
    <BackgroundGradientContainer>
      <Container>
        <LealHeader leal={leal} />
        <div className={classes.title}>
          <div>
            <h1>Recompensas</h1>
            <p>¡Aquí encontrarás todas las recompensas que tenemos para ti!</p>
          </div>
          <div>
            <Button href='/login'>Volver al perfil</Button>
          </div>
        </div>
        <div>
          <RecompensasGrid recompensas={recompensasLeal} role={role} />
        </div>
      </Container>
    </BackgroundGradientContainer>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });
  const { clientID } = context.query;

  if (
    !session ||
    session.user.role !== 'LEAL' ||
    clientID !== session.user.userId
  ) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const leal = await getLeal(clientID);
  const nivelDeCliente = leal.nivelDeCliente.toLowerCase();
  const empresa = session?.user?.empresa;

  const recompensasLeal = await getRecompensasByNivel(nivelDeCliente, empresa);

  if (!leal.datosLeal?.firstLoginDate) {
    return {
      redirect: {
        destination: '/cambiar-password',
        permanent: false,
      },
    };
  }

  return {
    props: { session, recompensasLeal, leal },
  };
}
