import BackgroundGradientContainer from '@/components/layout/background-gradient-container';
import Container from '@/components/layout/container';
import LinksGroup from '@/components/ui/links-group';
import { getSession } from 'next-auth/react';

export default function SuperAdminPage() {
  return (
    <BackgroundGradientContainer>
      <Container>
        <h1>SuperAdmin</h1>
        <LinksGroup
          links={[
            {
              titulo: 'Passwords',
              desc: 'Administra las contraseñas de los usuarios',
              link: '/superadmin/passwords',
            },
          ]}
        />
      </Container>
    </BackgroundGradientContainer>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });

  if (!session || session.user.role !== 'SUPERADMIN') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const empresa = session?.user?.empresa;

  return {
    props: {
      session,
    },
  };
}
