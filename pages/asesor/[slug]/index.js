import { getSession } from 'next-auth/react';
import { getUserInfo } from '@/lib/prismaDB';

import LayoutDashboard from '@/components/cliente/layout-dashboard';
import Question from '@/components/question';

export default function AsesorPage({ userInfo }) {
  return (
    <>
      <LayoutDashboard nombre={userInfo.nombre} role='asesor' />
      <Question
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
        destination: '/cliente/login',
        permanent: false,
      },
    };
  }

  const userInfo = await getUserInfo(slug);

  return {
    props: { session, userInfo },
  };
}
