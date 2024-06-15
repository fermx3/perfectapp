import ButtonGroup from '@/components/button-group';
import Container from '@/components/layout/container';

import { getUsuario } from '@/lib/db';
import { getSession } from 'next-auth/react';
import { CldImage } from 'next-cloudinary';
import Image from 'next/image';

import classes from './index.module.scss';
import Link from 'next/link';

export default function UsuarioPage({ usuario }) {
  const { userInfo, userId, role } = usuario;

  return (
    <Container>
      <h1>Bienvenido {userInfo.nombre}</h1>
      <ButtonGroup
        options={[
          {
            name: 'Resumen',
            link: `/${role.toLowerCase()}/${userId}`,
          },
          {
            name: 'Base de datos',
            link: `/${role.toLowerCase()}/${userId}/base-de-datos`,
            disabled: true,
          },
          {
            name: 'Ver PowerBI',
            link: '#',
            disabled: true,
          },
        ]}
      />
      <div className={classes.grafica}>
        <Link
          href='https://asset.cloudinary.com/dp8i43san/60d3ca45091849f960278a565d85f9cd'
          target='_blank'
        >
          <CldImage fill src='grafica.jpg' alt='' />
        </Link>
      </div>
    </Container>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });
  const { userID } = context.query;

  const usuario = await getUsuario(userID);

  if (
    !session ||
    session.user.role !== 'USUARIO' ||
    userID !== session.user.userId
  ) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: { session, usuario },
  };
}
