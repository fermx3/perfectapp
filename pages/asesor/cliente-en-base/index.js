import { useState } from 'react';
import { useRouter } from 'next/router';
import { AnimatePresence, motion } from 'framer-motion';

import Link from 'next/link';
import Container from '@/components/layout/container';
import FormControl, {
  INPUT_TYPE_CLASSES,
} from '@/components/forms/form-control';

import { getUserInfo } from '@/lib/db';
import { getLealesAsignados } from '@/lib/db';
import { getSession } from 'next-auth/react';

import classes from './index.module.scss';
import { frecuencias } from '@/lib/schemas/schemas';
import SelectInput from '@/components/forms/select-input';

export default function ClienteEnBasePage({ lealesAsignados, userInfo }) {
  const [value, setValue] = useState('');
  const [frecuenciaIsSelected, setFrecuenciaIsSelected] = useState('');

  const filteredLeales = lealesAsignados.filter((leal) => {
    return leal.frecuencia.some((i) => i === frecuenciaIsSelected);
  });

  const router = useRouter();

  const ulVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 1,
        when: 'beforeChildren',
        duration: 0.2,
      },
    },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  const liVariants = {
    hidden: { opacity: 0, x: 10 },
    visible: { opacity: 1, x: 0 },
    hover: { scale: 1.1 },
    click: { scale: 0.9 },
  };

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
          <motion.ul
            className={classes.leales}
            variants={ulVariants}
            initial='hidden'
            animate='visible'
          >
            {lealesAsignados
              .filter((leal) => {
                const searchTerm = value.toLowerCase();
                const nombre = leal.nombre.toLowerCase();
                const central = leal.central.toLowerCase();
                const userId = leal.userId.toLowerCase();
                return (
                  searchTerm &&
                  (nombre.includes(searchTerm) ||
                    central.includes(searchTerm) ||
                    userId.includes(searchTerm))
                );
              })
              .map((leal, index) => (
                <Link
                  key={index}
                  href={`/asesor/cliente-en-base/${leal.userId}`}
                >
                  <motion.li
                    variants={liVariants}
                    whileHover='hover'
                    whileTap='click'
                  >
                    <div className={classes.nombre}>
                      {leal.nombre} ({leal.central})
                    </div>
                    <div className={classes.id}>{leal.userId}</div>
                  </motion.li>
                </Link>
              ))}
          </motion.ul>
        )}
        <h4>o</h4>
        <FormControl label='Día de visita'>
          <SelectInput
            defaultValue={'Elige una opción'}
            options={frecuencias}
            value={frecuenciaIsSelected}
            onChange={(e) => setFrecuenciaIsSelected(e.target.value)}
          />
        </FormControl>

        {frecuenciaIsSelected && (
          <motion.ul
            className={classes.leales}
            variants={ulVariants}
            initial='hidden'
            animate='visible'
          >
            {filteredLeales.length !== 0 ? (
              filteredLeales.map((leal, index) => (
                <Link
                  key={index}
                  href={`/asesor/cliente-en-base/${leal.userId}`}
                >
                  <motion.li
                    variants={liVariants}
                    whileHover='hover'
                    whileTap='click'
                  >
                    <div className={classes.nombre}>
                      {leal.nombre} ({leal.central})
                    </div>
                    <div className={classes.id}>{leal.userId}</div>
                  </motion.li>
                </Link>
              ))
            ) : (
              <li>No hay clientes para este día</li>
            )}
          </motion.ul>
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

  const empresa = session?.user?.empresa;

  const userId = session.user.userId;

  const userInfo = await getUserInfo(userId);
  const lealesAsignados = await getLealesAsignados(
    userInfo.zonaAsignada,
    empresa
  );

  return {
    props: { session, userInfo, lealesAsignados },
  };
}
