import Button, { BUTTON_TYPE_CLASSES } from '@/components/button';
import BackgroundGradientContainer from '@/components/layout/background-gradient-container';
import Container from '@/components/layout/container';
import { getOrdenesSinValidar } from '@/lib/db';
import { getSession } from 'next-auth/react';
import moment from 'moment';
import { useForm } from 'react-hook-form';

import classes from './index.module.scss';
import Loader from '@/components/ui/loader';

export default function OrdenesPendientesPage({ ordenes }) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    console.log(data);
    const response = await fetch('/api/admin/validar-ordenes', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      alert('Orden validada');
      window.location.reload();
    }

    if (!response.ok) {
      alert('Error al validar orden');
    }

    return response;
  };

  return (
    <BackgroundGradientContainer>
      <Container>
        <h1>Ordenes Pendientes</h1>
        <table className={classes.table}>
          <thead>
            <tr>
              <th>Asesor</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Distribuidor</th>
              <th>Orden</th>
              <th>Puntos</th>
              <th>Validar</th>
            </tr>
          </thead>
          <tbody>
            {ordenes.map((orden, index) => {
              const puntosGenerados = orden.orden.reduce((acc, item) => {
                return acc + item.cajas * item.puntos;
              }, 0);

              const cajas = [];
              orden.orden.map((item) => {
                cajas.push({ sku: item.sku, cajas: item.cajas });
              });

              return (
                <tr key={index}>
                  <td>{orden.asesor}</td>
                  <td>{orden.cliente}</td>
                  <td>{moment(orden.fecha).format('YYYY-MM-DD')}</td>
                  <td>{orden.distribuidor}</td>
                  <td>
                    {orden.orden.map((item, index) => (
                      <table key={index}>
                        <thead>
                          <tr>
                            <th>Producto</th>
                            <th>Cantidad</th>
                            <th>Promo</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>{item.producto}</td>
                            <td>{item.cajas} cajas</td>
                            <td>{item.promo}</td>
                          </tr>
                        </tbody>
                      </table>
                    ))}
                  </td>
                  <td>{puntosGenerados}</td>
                  <td>
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <input
                        type='hidden'
                        {...register('cliente')}
                        value={orden.cliente}
                      />
                      <input
                        type='hidden'
                        {...register('_id')}
                        value={orden._id}
                      />
                      <input
                        type='hidden'
                        {...register('puntosGenerados', {
                          valueAsNumber: true,
                        })}
                        value={puntosGenerados}
                      />
                      {orden.orden.map((item, index) => (
                        <div key={index}>
                          <input
                            type='hidden'
                            {...register(`orden.${item.sku}`, {
                              valueAsNumber: true,
                            })}
                            value={item.cajas}
                          />
                        </div>
                      ))}
                      {isSubmitting ? (
                        <Loader />
                      ) : (
                        <Button
                          type='submit'
                          disabled={isSubmitting}
                          buttonType={BUTTON_TYPE_CLASSES.disabled}
                        >
                          Validar
                        </Button>
                        // useFieldArray with hidden inputs to handle multiple form inputs
                      )}
                    </form>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Container>
    </BackgroundGradientContainer>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });

  const ordenes = await getOrdenesSinValidar();

  if (!session || session.user.role !== 'ADMIN') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: { session, ordenes },
  };
}
