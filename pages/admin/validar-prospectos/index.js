import BackgroundGradientContainer from '@/components/layout/background-gradient-container';
import Container from '@/components/layout/container';
import ProspectosList from '@/components/admin/prospectos-list/prospectos-list';
import { getSession } from 'next-auth/react';
import { getProspectos, getSettings } from '@/lib/db';

export default function ValidarProspectosPage({
  prospectos,
  zonas,
  skus,
  centrales,
  regiones,
}) {
  return (
    <BackgroundGradientContainer>
      <Container>
        <header>
          <h1>Validar Prospectos</h1>
          <p>Valida los prospectos que han sido agregados por los asesores.</p>
        </header>
        <main>
          <ProspectosList
            prospectos={prospectos}
            zonas={zonas}
            skus={skus}
            centrales={centrales}
            regiones={regiones}
          />
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
  const { zonas, skus, centrales, regiones } = await getSettings(empresa);

  return {
    props: { session, prospectos, zonas, skus, centrales, regiones },
  };
}
