import CrearClienteForm from '@/components/admin/crear-cliente-form';
import Container from '@/components/layout/container';

import { getSession } from 'next-auth/react';

export default function CrearClientePage() {
  return (
    <Container md>
      <header>
        <h1>Crear Leal</h1>
        <p>Escribe los datos para crear un nuevo Leal en la base de datos.</p>
      </header>
      <main>
        <CrearClienteForm />
      </main>
    </Container>
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

  return {
    props: { session },
  };
}
