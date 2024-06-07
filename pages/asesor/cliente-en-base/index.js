import { useState } from 'react';
import { useRouter } from 'next/router';

import Link from 'next/link';
import Container from '@/components/layout/container';
import FormControl, {
  INPUT_TYPE_CLASSES,
} from '@/components/forms/form-control';

import { getUserInfo } from '@/lib/prismaDB';
import { getLealesAsignados } from '@/lib/db';
import { getSession } from 'next-auth/react';

import classes from './index.module.scss';
import { frecuencias } from '@/lib/schemas/schemas';

export default function ClienteEnBasePage({
  lealesAsignados,
  userInfo,
  session,
}) {
  const [value, setValue] = useState('');
  const [frecuenciaIsSelected, setFrecuenciaIsSelected] = useState();

  const filteredLeales = lealesAsignados.filter((leal) => {
    return leal.frecuencia.some((i) => i === frecuenciaIsSelected);
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
          <ul className={classes.leales}>
            {lealesAsignados
              .filter((leal) => {
                const searchTerm = value.toLowerCase();
                const nombre = leal.nombre.toLowerCase();
                return searchTerm && nombre.includes(searchTerm);
              })
              .map((leal) => (
                <li key={leal.userId}>
                  <Link href={`/asesor/cliente-en-base/${leal.userId}`}>
                    {leal.nombre}
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
          <ul className={classes.leales}>
            {filteredLeales.length !== 0 ? (
              filteredLeales.map((leal) => (
                <li key={leal.nombre}>
                  <Link href={`/asesor/cliente-en-base/${leal.userId}`}>
                    {leal.nombre}
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

  const userId = session.user.userId;

  const userInfo = await getUserInfo(userId);
  const lealesAsignados = await getLealesAsignados(userInfo.zonaAsignada);

  return {
    props: { session, userInfo, lealesAsignados },
  };
}
