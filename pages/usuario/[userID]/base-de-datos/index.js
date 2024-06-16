import { getSession } from 'next-auth/react';
import { getUsuario } from '@/lib/db';

import Container from '@/components/layout/container';
import ButtonGroup from '@/components/button-group';
import Button, { BUTTON_TYPE_CLASSES } from '@/components/button';
import { useState } from 'react';
import Loader from '@/components/ui/loader';
import { useRouter } from 'next/router';

export default function BaseDeDatos({ usuario, linkVisitas }) {
  const { role, userId, userInfo } = usuario;
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleFullDownload = async function () {
    router.push(linkVisitas);
    // setIsLoading(true);
    // const response = await fetch('/api/usuario/all-visitas', {
    //   method: 'GET',
    // });

    // const responseData = await response.json();

    // if (!response.ok) {
    //   throw new Error(responseData.error.message || 'Something went wrong');
    // }

    // setIsLoading(false);
    // router.push('/tmp/visitas.csv');
    // return responseData;
  };

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
          },
          {
            name: 'Ver PowerBI',
            link: '#',
            disabled: true,
          },
        ]}
      />
      <h2>Descargar base de datos</h2>
      <div>
        <Button
          onClick={handleFullDownload}
          disabled={isLoading}
          buttonType={
            isLoading ? BUTTON_TYPE_CLASSES.disabled : BUTTON_TYPE_CLASSES.base
          }
        >
          Descargar base de datos completa
          {isLoading && <Loader />}
        </Button>
      </div>
    </Container>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });
  const { userID } = context.query;

  const usuario = await getUsuario(userID);

  const linkVisitas = process.env.LINK_BASE_VISITAS;

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
    props: { session, usuario, linkVisitas },
  };
}
