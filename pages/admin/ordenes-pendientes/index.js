import Button, { BUTTON_TYPE_CLASSES } from '@/components/button';
import BackgroundGradientContainer from '@/components/layout/background-gradient-container';
import Container from '@/components/layout/container';
import { getOrdenesSinValidar } from '@/lib/db';
import { getSession } from 'next-auth/react';
import moment from 'moment';
import { useFieldArray, useForm } from 'react-hook-form';

import classes from './index.module.scss';
import Loader from '@/components/ui/loader';

export default function OrdenesPendientesPage({ ordenes }) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    control,
  } = useForm();

  const onSubmit = async (data) => {
    console.log(data.ordenesParaValidar);
    const response = await fetch('/api/admin/validar-ordenes', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      alert('Ordenes validadas');
      window.location.reload();
    }

    if (!response.ok) {
      alert('Error al validar orden');
    }

    return response;
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'ordenesParaValidar',
  });

  const handleCheck = (e) => {
    if (e.target.checked) {
      const orden = ordenes.filter((orden) => orden._id === e.target.value);
      const puntosGenerados = orden[0].orden.reduce((acc, item) => {
        return acc + item.cajas * item.puntos;
      }, 0);
      const ordenObj = orden[0].orden.reduce((acc, item) => {
        return { ...acc, [item.sku]: item.cajas };
      }, {});
      append({
        _id: orden[0]._id,
        cliente: orden[0].cliente,
        puntosGenerados,
        orden: ordenObj,
        fecha: orden[0].fecha,
      });
    } else {
      const ordenToRemoveIndex = fields.findIndex(
        (field) => field._id === e.target.value
      );
      remove(ordenToRemoveIndex);
    }
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
                  <td className={classes.checkboxes}>
                    <input
                      type='checkbox'
                      value={orden._id}
                      onClick={handleCheck}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
          {fields.map((field, index) => {})}
          {isSubmitting ? (
            <Loader />
          ) : (
            <Button
              type='submit'
              disabled={isSubmitting}
              buttonType={
                fields.length > 0
                  ? BUTTON_TYPE_CLASSES.primary
                  : BUTTON_TYPE_CLASSES.disabled
              }
            >
              Validar
            </Button>
          )}
        </form>
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
