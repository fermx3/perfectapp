import Link from 'next/link';
import { useState } from 'react';

import Container from '@/components/layout/container';
import FormControl from '@/components/forms/form-control';

import { getClientes, getUserInfo } from '@/lib/prismaDB';
import { getSession } from 'next-auth/react';

import classes from './index.module.scss';

export default function ClienteEnBasePage({ clientes, userInfo }) {
  const [value, setValue] = useState('');
  const [frecuenciaIsSelected, setFrecuenciaIsSelected] = useState();

  const filteredClientes = clientes.filter((cliente) => {
    return cliente.frecuencia === frecuenciaIsSelected;
  });

  return (
    <Container md>
      <header>
        <h1>Busqueda de cliente</h1>
        <h5>Asesor: {userInfo.nombre}</h5>
      </header>
      <main className={classes.main}>
        <FormControl>
          <label>Nombre del cliente</label>
          <input
            type='search'
            placeholder='Busqueda por nombre'
            onChange={(event) => setValue(event.target.value)}
            value={value}
          />
        </FormControl>
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
        <FormControl>
          <label>Día de visita</label>
          <select onChange={(e) => setFrecuenciaIsSelected(e.target.value)}>
            <option value={0} selected disabled hidden>
              Elije una opción
            </option>
            {[
              'Lunes',
              'Martes',
              'Miércoles',
              'Jueves',
              'Sábado',
              'Domingo',
            ].map((dia) => (
              <option>{dia}</option>
            ))}
          </select>
        </FormControl>
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
          onChange={(e) => setFrecuenciaIsSelected(e.target.value)}
        />
        {frecuenciaIsSelected && (
          <ul className={classes.clientes}>
            {filteredClientes.length !== 0 ? (
              filteredClientes.map((cliente) => (
                <li key={cliente.userId}>
                  <Link href={`/asesor/cliente-en-base/${cliente.userId}`}>
                    {cliente.nombre}
                  </Link>
                </li>
              ))
            ) : (
              <li>No hay clientes para este día</li>
            )}
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
        destination: '/login',
        permanent: false,
      },
    };
  }

  const clientes = await getClientes();
  const userId = session.user.userId;

  const userInfo = await getUserInfo(userId);

  return {
    props: { session, clientes, userInfo },
  };
}
