import { getSession } from 'next-auth/react';
import { getUserInfo } from '@/lib/prismaDB';

import LayoutDashboard from '@/components/cliente/layout-dashboard';
import ButtonGroup from '@/components/button-group';

export default function AsesorPage({ userInfo, session }) {
  console.log(userInfo);
  console.log(session);

  return (
    <>
      <LayoutDashboard
        nombre={userInfo.nombre}
        userId={session.user.userId}
        role={session.user.role}
      />
      <ButtonGroup
        options={[
          { name: 'Cliente en Base', link: '/asesor/cliente-en-base' },
          { name: 'Cliente Nuevo', link: '#' },
          { name: 'Actividades y Promociones', link: '#' },
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
