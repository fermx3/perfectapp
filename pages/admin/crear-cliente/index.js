import CrearClienteForm from '@/components/admin/crear-cliente-form';
import Container from '@/components/layout/container';

import { getSession } from 'next-auth/react';

import classes from './index.module.scss';
import { getAsesores } from '@/lib/prismaDB';

export default function CrearClientePage({ asesores }) {
  return (
    <Container md>
      <header className={classes.header}>
        <h1>Crear Leal</h1>
        <p>Escribe los datos para crear un nuevo Leal en la base de datos.</p>
      </header>
      <main>
        <CrearClienteForm asesores={asesores} />
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
