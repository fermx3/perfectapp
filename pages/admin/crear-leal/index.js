import CrearLealForm from '@/components/admin/crear-leal-form';
import Container from '@/components/layout/container';

import { getSession } from 'next-auth/react';

import classes from './index.module.scss';
import { getAsesores } from '@/lib/db';

export default function CrearLealPage({ asesores, session }) {
  return (
    <Container md>
      <header className={classes.header}>
        <h1>Crear Leal</h1>
        <p>Escribe los datos para crear un nuevo Leal en la base de datos.</p>
      </header>
      <main>
        <CrearLealForm asesores={asesores} session={session} />
      </main>
    </Container>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });
  const asesores = await getAsesores();

  if (!session || session.user.role !== 'ADMIN') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: { session, asesores },
  };
}
