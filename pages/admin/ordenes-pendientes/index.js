import Button, { BUTTON_TYPE_CLASSES } from '@/components/button';
import BackgroundGradientContainer from '@/components/layout/background-gradient-container';
import Container from '@/components/layout/container';
import { getOrdenesSinValidar, getUserNamesByRole } from '@/lib/db';
import { getSession } from 'next-auth/react';
import moment from 'moment';
import { useFieldArray, useForm } from 'react-hook-form';

import classes from './index.module.scss';
import Loader from '@/components/ui/loader';
import Link from 'next/link';
import Image from 'next/image';

export default function OrdenesPendientesPage({ ordenes, userNames }) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    control,
  } = useForm();

  const onValidate = async (data) => {
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

  const onArchivar = async (data) => {
    const response = await fetch('/api/admin/archivar-ordenes', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      alert('Ordenes archivadas');
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
        <Button
          buttonType={BUTTON_TYPE_CLASSES.outline}
          href='/admin/ordenes-pendientes/archivadas'
        >
          Ordenes Archivadas
        </Button>
        <table className={classes.table}>
          <thead>
            <tr>
              <th>Asesor</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Distribuidor</th>
              <th>Orden</th>
              <th>Puntos</th>
              <th>Seleccionar</th>
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

              const nombreCliente = userNames.find(
                (user) => user.userId === orden.cliente
              )?.nombre;

              const nivelDeCliente = userNames.find(
                (user) => user.userId === orden.cliente
              )?.nivelDeCliente;

              return (
                <tr
                  key={index}
                  className={
                    nivelDeCliente === 'Platinum'
                      ? classes.platinum
                      : classes.row
                  }
                >
                  <td>{orden.asesor}</td>
                  <td className={classes.clienteCol}>
                    {orden.cliente} <br />
                    {nombreCliente}
                  </td>
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
                    {orden.evidenciaCompra && (
                      <ul className={classes.evidencias}>
                        {orden.evidenciaCompra.map((evidencia, index) => (
                          <Button
                            href={evidencia}
                            buttonType={BUTTON_TYPE_CLASSES.coloredLink}
                            key={index}
                            target='_blank'
                          >
                            Evidencia {index + 1}{' '}
                            {
                              <Image
                                src='/images/icons/camera.svg'
                                width={14}
                                height={14}
                                alt='camara'
                                style={{ filter: 'invert(1)' }}
                              />
                            }
                          </Button>
                        ))}
                      </ul>
                    )}
                  </td>
                  <td>{puntosGenerados}</td>
                  <td className={classes.checkboxes}>
                    <input
                      type='checkbox'
                      id='validar'
                      value={orden._id}
                      onClick={handleCheck}
                    />
                  </td>
                  {nivelDeCliente === 'Platinum' && (
                    <div className={classes.cuentaClave}>Platinum</div>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
        <form className={classes.form}>
          {fields.map((field, index) => {})}
          {isSubmitting ? (
            <Loader />
          ) : (
            <div className={classes.buttons}>
              <Button
                type='submit'
                disabled={isSubmitting}
                buttonType={
                  fields.length > 0
                    ? BUTTON_TYPE_CLASSES.secondary
                    : BUTTON_TYPE_CLASSES.disabled
                }
                onClick={handleSubmit(onArchivar)}
              >
                Archivar
                <Image
                  src='/images/icons/delete.png'
                  width={18}
                  height={18}
                  alt='archivar'
                />
              </Button>
              <Button
                type='submit'
                disabled={isSubmitting}
                buttonType={
                  fields.length > 0
                    ? BUTTON_TYPE_CLASSES.primary
                    : BUTTON_TYPE_CLASSES.disabled
                }
                onClick={handleSubmit(onValidate)}
              >
                Validar
              </Button>
            </div>
          )}
        </form>
      </Container>
    </BackgroundGradientContainer>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });

  const userNames = await getUserNamesByRole('LEAL');

  if (!session || session.user.role !== 'ADMIN') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const empresa = session?.user?.empresa;
  const ordenes = await getOrdenesSinValidar(empresa);

  return {
    props: { session, ordenes, userNames },
  };
}
