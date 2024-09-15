import { getSession } from 'next-auth/react';
import { getUsuario } from '@/lib/db';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

import Container from '@/components/layout/container';
import ButtonGroup from '@/components/button-group';
import Button, { BUTTON_TYPE_CLASSES } from '@/components/button';
import Loader from '@/components/ui/loader';
import BackgroundGradientContainer from '@/components/layout/background-gradient-container';
import Modal from '@/components/ui/modal';

import classes from './index.module.scss';
import FormControl from '@/components/forms/form-control';
import InputGroup from '@/components/forms/input-group';
import SelectInput from '@/components/forms/select-input';
import { centrales, filtrarBaseSchema } from '@/lib/schemas/schemas';

const bases = ['ventas', 'inventario', 'precios'];

export default function BaseDeDatos({ usuario, linkVisitas, userID }) {
  const { role, userId, userInfo } = usuario;
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    defaultValues: {
      fechaInicio: '',
      fechaFin: '',
      base: '',
    },
    resolver: zodResolver(filtrarBaseSchema),
  });

  // const handleFullDownload = async function () {
  //   // router.push(linkVisitas);
  //   setIsLoading(true);
  //   const response = await fetch('/api/usuario/export', {
  //     method: 'GET',
  //   });

  //   const responseData = await response.json();

  //   if (!response.ok) {
  //     throw new Error(
  //       // responseData.error.message ||
  //       'Something went wrong'
  //     );
  //   }

  //   setIsLoading(false);

  //   router.push(responseData.url);
  //   return responseData;
  // };

  const handleClick = function () {
    setSuccessMessage('');
    setErrorMessage('');
  };

  async function sendFiltros(data) {
    let fetchURI = '';
    switch (data.base) {
      case 'ventas':
        fetchURI = '/api/usuario/export-ventas';
        break;
      case 'inventario':
        fetchURI = '/api/usuario/export-inventario';
        break;
      case 'precios':
        fetchURI = '/api/usuario/export-precios';
        break;
      default:
        fetchURI = '/api/usuario/export-ventas';
        break;
    }

    const response = await fetch(fetchURI, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.error.message || 'Something went wrong!');
    }

    if (responseData.errors) {
      const errors = responseData.errors;

      if (errors.fechaInicio) {
        setError('fechaInicio', {
          type: 'server',
          message: errors.fechaInicio,
        });
      } else if (errors.fechaFin) {
        setError('fechaFin', {
          type: 'server',
          message: errors.fechaFin,
        });
      }
    }

    router.push(responseData.url);

    return responseData;
  }

  const onSubmit = async (data) => {
    setSuccessMessage('');
    setErrorMessage('');
    // submit to server
    try {
      const result = await sendFiltros(data);
      //Successfuly send Filtros
      setSuccessMessage(result.message);
      // if (result.message) {
      //   reset();
      // }
    } catch (error) {
      setErrorMessage(
        // error.message ||
        'Algo salio mal, intenta de nuevo o contacta al administrador.'
      );
      //Fail on create user
    }
  };

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
        <div className={classes.section}>
          <h2>Descargar base de datos</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <InputGroup>
              <FormControl
                label='Fecha de inicio'
                error={errors.fechaInicio?.message}
              >
                <input
                  type='date'
                  id='fechaInicio'
                  {...register('fechaInicio')}
                  max={new Date().toISOString().split('T')[0]}
                />
              </FormControl>
              <FormControl
                label='Fecha de fin'
                error={errors.fechaFin?.message}
              >
                <input
                  type='date'
                  id='fechaFin'
                  {...register('fechaFin')}
                  max={new Date().toISOString().split('T')[0]}
                />
              </FormControl>
            </InputGroup>
            <InputGroup>
              <FormControl
                label='Selecciona la base de datos que necesitas'
                error={errors.base?.message}
              >
                <Controller
                  name={'base'}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <SelectInput
                      defaultValue='Selecciona la base de datos que necesitas'
                      options={bases}
                      value={value}
                      onChange={onChange}
                    />
                  )}
                />
              </FormControl>
            </InputGroup>
            {isSubmitting && <Loader />}
            <Button
              disabled={isSubmitting}
              buttonType={
                isSubmitting
                  ? BUTTON_TYPE_CLASSES.disabled
                  : BUTTON_TYPE_CLASSES.base
              }
            >
              Descargar base de datos
            </Button>
          </form>
        </div>
      </Container>
      {(successMessage || errorMessage) && (
        <Modal>
          <p style={{ marginBottom: '1rem' }}>
            {successMessage || errorMessage}
          </p>
          <Button type='button' onClick={handleClick}>
            Ok
          </Button>
        </Modal>
      )}
    </BackgroundGradientContainer>
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
    props: { session, usuario, linkVisitas, userID },
  };
}
