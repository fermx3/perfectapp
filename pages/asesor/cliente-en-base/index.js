import { getSession } from 'next-auth/react';
import { getUserInfo } from '@/lib/prismaDB';

export default function ClienteEnBasePage() {
  return <>ClienteEnBasePage</>;
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });
  const { userId } = context.query;

  if (!session || session.user.role !== 'ASESOR') {
    return {
      redirect: {
        destination: '/cliente/login',
        permanent: false,
      },
    };
  }

  const userInfo = await getUserInfo(userId);

  return {
    props: { session, userInfo },
  };
}
