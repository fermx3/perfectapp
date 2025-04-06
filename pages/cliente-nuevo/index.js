import ClienteNuevoForm from '@/components/asesor/cliente-nuevo-form';
import BackgroundGradientContainer from '@/components/layout/background-gradient-container';
import Container from '@/components/layout/container';
import { getSettings } from '@/lib/db';
import { getSession } from 'next-auth/react';

export default function ClienteNuevoPage({ centrales, regiones }) {
  return (
    <BackgroundGradientContainer>
      <Container>
        <h1>Alta de cliente</h1>
        <ClienteNuevoForm centrales={centrales} regiones={regiones} />
      </Container>
    </BackgroundGradientContainer>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });
  const { centrales, regiones } = await getSettings('lala');

  //   const yearMonth = moment().format('YYYY-MM');

  // const role = session?.user.role;

  if (
    !session ||
    (session.user.role !== 'ASESOR' && session.user.role !== 'IDM')
  ) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const empresa = session?.user?.empresa;

  return {
    props: { centrales, session, regiones },
  };
}
