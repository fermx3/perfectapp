import BackgroundGradientContainer from '@/components/layout/background-gradient-container';
import Container from '@/components/layout/container';
import ProspectosList from '@/components/admin/prospectos-list/prospectos-list';
import { getSession } from 'next-auth/react';
import { getProspectos } from '@/lib/db';

export default function ValidarProspectosPage({ prospectos }) {
  return (
    <BackgroundGradientContainer>
      <Container>
        <header>
          <h1>Validar Prospectos</h1>
          <h3>
            Valida los prospectos que han sido agregados por los asesores.
          </h3>
        </header>
        <main>
          <ProspectosList prospectos={prospectos} />
        </main>
      </Container>
    </BackgroundGradientContainer>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });

  if (!session || session.user.role !== 'ADMIN') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const empresa = session?.user?.empresa;
  const prospectos = await getProspectos(empresa);

  return {
    props: { session, prospectos },
  };
}
