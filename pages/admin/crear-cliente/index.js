import CrearClienteForm from '@/components/admin/crear-cliente-form';

import { getSession } from 'next-auth/react';

export default function CrearClientePage() {
  return (
    <>
      <header>
        <h1>Crear cliente</h1>
        <p>
          Escribe los datos para crear un cliente nuevo en la base de datos.
        </p>
      </header>
      <main>
        <CrearClienteForm />
      </main>
    </>
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
