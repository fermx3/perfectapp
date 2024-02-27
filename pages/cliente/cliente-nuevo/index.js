import { useState } from 'react';

import Button from '@/components/button';
import Container from '@/components/layout/container';
import FormControl from '@/components/forms/form-control';

export default function ClienteNuevoPage() {
  const [username, setUsername] = useState('');

  return (
    <Container>
      <header>
        <h1>Cliente nuevo</h1>
      </header>
      <main>
        <h2>¿Cuentas con numero de Cliente Upfield?</h2>
        <form>
          <FormControl
            id='username'
            label=''
            type='number'
            onChange={(e) => setUsername(e.target.value)}
          />
          <FormControl type='button' label='Registrar' />
        </form>
        <div style={{ display: 'flex' }}>
          <Button
            onClick={() =>
              alert(
                'Solicita a un asesor de negocios Execution Force el pre registro para ingresar a la app'
              )
            }
          >
            NO tengo numero de Cliente Upfield
          </Button>
        </div>
      </main>
    </Container>
  );
}

// export async function getServerSideProps(context) {
//   const session = await getSession({ req: context.req });
//   const { clientID } = context.query;

//   if (
//     !session ||
//     session.user.role !== 'CLIENTE' ||
//     clientID !== session.user.userId
//   ) {
//     return {
//       redirect: {
//         destination: '/cliente/login',
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: { session },
//   };
// }
