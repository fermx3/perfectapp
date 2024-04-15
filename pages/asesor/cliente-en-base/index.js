import { useState } from 'react';
import { useRouter } from 'next/router';

import Link from 'next/link';
import Container from '@/components/layout/container';
import FormControl, {
  INPUT_TYPE_CLASSES,
} from '@/components/forms/form-control';

import { getClientes, getUserInfo } from '@/lib/prismaDB';
import { getSession } from 'next-auth/react';

import classes from './index.module.scss';
import { frecuencias } from '@/lib/schemas/schemas';

export default function ClienteEnBasePage({ clientes, userInfo, session }) {
  const [value, setValue] = useState('');
  const [frecuenciaIsSelected, setFrecuenciaIsSelected] = useState();

  console.log(clientes);
  console.log(userInfo);
  console.log(session.user.userId);

  const filteredClientes = clientes.filter((cliente) => {
    if (cliente.asesorAsignado.some((i) => i === session.user.userId))
      return cliente.frecuencia.some((i) => i === frecuenciaIsSelected);
  });

  const router = useRouter();

  const listaChangeHandler = function (e) {
    const selectedUser = clientes.find(
      (cliente) => cliente.nombre === e.target.value
    );

    if (!selectedUser) return;

    router.replace(`/asesor/cliente-en-base/${selectedUser.userId}`);
  };

  return (
    <Container md>
      <header>
        <h1>Busqueda de cliente</h1>
        <h5>Asesor: {userInfo.nombre}</h5>
      </header>
      <main className={classes.main}>
        <FormControl
          label='Nombre del cliente'
          inputType={INPUT_TYPE_CLASSES.fullWidth}
        >
          {/* <input
            list='clientesLista'
            placeholder='Busqueda por nombre'
            onChange={listaChangeHandler}
          />
          <datalist id='clientesLista'>
            {clientes.map((cliente) => (
              <option key={cliente.id} value={cliente.nombre}>
                {cliente.nombre}
              </option>
            ))}
          </datalist> */}
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
                if (
                  cliente.asesorAsignado.some((i) => i === session.user.userId)
                )
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
        <FormControl inputType={INPUT_TYPE_CLASSES.fullWidth}>
          <label>Día de visita</label>
          <select onChange={(e) => setFrecuenciaIsSelected(e.target.value)}>
            <option value={0} selected disabled hidden>
              Elije una opción
            </option>
            {frecuencias.map((dia) => (
              <option key={dia}>{dia}</option>
            ))}
          </select>
        </FormControl>

        {frecuenciaIsSelected && (
          <ul className={classes.clientes}>
            {filteredClientes.length !== 0 ? (
              filteredClientes.map((cliente) => (
                <li key={cliente.nombre}>
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
