import { getSession } from 'next-auth/react';
import { getUserInfo } from '@/lib/prismaDB';

import LayoutDashboard from '@/components/cliente/layout-dashboard';
import ButtonGroup from '@/components/button-group';
import LinksGroup from '@/components/ui/links-group';

export default function AsesorPage({ userInfo, session }) {
  return (
    <>
      <LayoutDashboard
        nombre={userInfo.nombre}
        userId={session.user.userId}
        role={session.user.role}
        asesores={userInfo.asesores}
      />
      <LinksGroup
        links={[
          {
            titulo: 'Cliente en Base',
            link: '/asesor/cliente-en-base',
            desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras.',
          },
          {
            titulo: 'Cliente Nuevo',
            link: '#',
            desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras.',
          },
          {
            titulo: 'Actividades y Promociones',
            link: '#',
            desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras.',
          },
        ]}
      />
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });
  const { slug } = context.query;

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

  const userInfo = await getUserInfo(slug);

  return {
    props: { session, userInfo },
  };
}
