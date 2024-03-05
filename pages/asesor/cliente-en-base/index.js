import Link from 'next/link';
import { useState } from 'react';

import Container from '@/components/layout/container';
import FormControl from '@/components/forms/form-control';

import { getClientes } from '@/lib/prismaDB';
import { getSession } from 'next-auth/react';

import classes from './index.module.scss';

export default function ClienteEnBasePage({ userId, clientes }) {
  const [value, setValue] = useState('');
  const [frecuenciaIsSelected, setFrecuenciaIsSelected] = useState(false);

  return (
    <Container md>
      <header>
        <h1>Busqueda de cliente</h1>
      </header>
      <main className={classes.main}>
        <FormControl
          type='search'
          id='searchBar'
          label='Nombre de Cliente'
          onChange={(event) => setValue(event.target.value)}
          value={value}
        />
        {value !== '' && (
          <ul className={classes.clientes}>
            {clientes
              .filter((cliente) => {
                const searchTerm = value.toLowerCase();
                const nombre = cliente.nombre.toLowerCase();
                return searchTerm && nombre.includes(searchTerm);
              })
              .map((cliente) => (
                <li key={cliente.userId}>
                  <Link href={`/asesor/cliente-en-base/${cliente.userId}`}>
                    {cliente.nombre}
                  </Link>
                </li>
              ))}
          </ul>
        )}
        <h4>o</h4>
        <FormControl
          type='select'
          id='frecuencia'
          label='Frecuencia'
          defaultOption='Día de Visita'
          options={[
            'Lunes',
            'Martes',
            'Miércoles',
            'Jueves',
            'Sábado',
            'Domingo',
          ]}
          onChange={() => setFrecuenciaIsSelected(true)}
        />
        {frecuenciaIsSelected && (
          <ul className={classes.clientes}>
            {clientes.map((cliente) => (
              <li key={cliente.userId}>
                <Link href={`/asesor/cliente-en-base/${cliente.userId}`}>
                  {cliente.nombre}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </Container>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });

  if (!session || session.user.role !== 'ASESOR') {
    return {
      redirect: {
        destination: '/cliente/login',
        permanent: false,
      },
    };
  }

  const clientes = await getClientes();

  const userId = session.user.userId;

  return {
    props: { session, userId, clientes },
  };
}
