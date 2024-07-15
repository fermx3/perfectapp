import ButtonGroup from '@/components/button-group';
import Container from '@/components/layout/container';

import { getUsuario } from '@/lib/db';
import { getSession } from 'next-auth/react';
import { CldImage } from 'next-cloudinary';

import classes from './index.module.scss';
import Link from 'next/link';
import BackgroundGradientContainer from '@/components/layout/background-gradient-container';
import { BUTTON_TYPE_CLASSES } from '@/components/button';

export default function UsuarioPage({ usuario }) {
  const { userInfo, userId, role } = usuario;

  return (
    <BackgroundGradientContainer>
      <Container>
        <h1>Bienvenido {userInfo.nombre}</h1>
        <ButtonGroup
          options={[
            {
              name: 'Resumen',
              link: `/${role.toLowerCase()}/${userId}`,
              buttonType: BUTTON_TYPE_CLASSES.secondary,
            },
            {
              name: 'Base de datos',
              link: `/${role.toLowerCase()}/${userId}/base-de-datos`,
              buttonType: BUTTON_TYPE_CLASSES.secondary,
            },
            {
              name: 'Ver PowerBI',
              link: '#',
              disabled: true,
              buttonType: BUTTON_TYPE_CLASSES.secondary,
            },
          ]}
        />
        <div className={classes.grafica}>
          <Link
            href='https://asset.cloudinary.com/dp8i43san/f77d8429e17bf500072fb8d580f0b017'
            target='_blank'
          >
            <CldImage fill src='grafica.jpg' alt='' />
          </Link>
        </div>
      </Container>
    </BackgroundGradientContainer>
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
