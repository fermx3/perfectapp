import CrearLealForm from '@/components/admin/crear-leal-form';
import Container from '@/components/layout/container';

import { getSession } from 'next-auth/react';
import { getAsesores, getSettings } from '@/lib/db';

import classes from './index.module.scss';

export default function CrearLealPage({ asesores, session, centrales }) {
  return (
    <Container md>
      <header className={classes.header}>
        <h1>Crear Leal</h1>
        <p>Escribe los datos para crear un nuevo Leal en la base de datos.</p>
      </header>
      <main>
        <CrearLealForm
          asesores={asesores}
          session={session}
          centrales={centrales}
        />
      </main>
    </Container>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });
  const asesores = await getAsesores();
  const { centrales } = await getSettings('lala');

  if (!session || session.user.role !== 'ADMIN') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: { session, asesores, centrales },
  };
}
