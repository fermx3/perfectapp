import { useState } from 'react';
import { getSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';

import Button, { BUTTON_TYPE_CLASSES } from '@/components/button';
import Container from '@/components/layout/container';
import FormControl from '@/components/forms/form-control';
import InputGroup from '@/components/forms/input-group';
import Modal from '@/components/ui/modal';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader';

import { getDatosLeal } from '@/lib/prismaDB';
import { actualizarDatosLealSchema } from '@/lib/schemas/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import BackgroundGradientContainer from '@/components/layout/background-gradient-container';

export default function ActualizarDatosPage({ datosLeal }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
    setError,
  } = useForm({
    defaultValues: {
      nombreDelEncargado: datosLeal.nombreDelEncargado || '',
      email: datosLeal.email || '',
      telefono: datosLeal.telefono || '',
      fechaDeAniversario: datosLeal.fechaDeAniversario || '',
    },
    resolver: zodResolver(actualizarDatosLealSchema),
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const router = useRouter();

  async function actualizarDatosLeal(data) {
    const response = await fetch('/api/leal/actualizar-datos', {
      method: 'PATCH',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'Algo salió mal!');
    }

    if (responseData.errors) {
      if (errors.nombreDelEncargado) {
        setError('nombreDelEncargado', {
          type: 'server',
          message: errors.nombreDelEncargado,
        });
      }
      if (errors.email) {
        setError('email', {
          type: 'server',
          message: errors.email,
        });
      }
      if (errors.telefono) {
        setError('telefono', {
          type: 'server',
          message: errors.telefono,
        });
      }
      if (errors.fechaDeAniversario) {
        setError('fechaDeAniversario', {
          type: 'server',
          message: errors.fechaDeAniversario,
        });
      }
    }

    return responseData;
  }

  const onSubmit = async (data) => {
    setSuccessMessage('');
    setErrorMessage('');

    //submit to server
    try {
      const result = await actualizarDatosLeal(data);
      //succesfuly updated data
      setSuccessMessage(result.message);
    } catch (error) {
      console.log(error);
      setErrorMessage(
        error.message ||
          'Algo salio mal, intenta de nuevo o contacta al administrador.'
      );
    }
  };

  const handleClick = function () {
    setSuccessMessage('');
    router.reload();
  };

  return (
    <BackgroundGradientContainer>
      <Container md>
        <h1>Actualiza tus datos</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <InputGroup>
            <FormControl label='Nombre del encargado:'>
              <input type='text' {...register('nombreDelEncargado')} />
              {errors.nombreDelEncargado && (
                <p>{errors.nombreDelEncargado.message}</p>
              )}
            </FormControl>
            <FormControl label='Correo electrónico:'>
              <input type='text' {...register('email')} />
              {errors.email && <p>{errors.email.message}</p>}
            </FormControl>
          </InputGroup>
          <InputGroup>
            <FormControl label='Teléfono (10 dígitos):'>
              <input type='number' {...register('telefono')} />
              {errors.telefono && <p>{errors.telefono.message}</p>}
            </FormControl>
            <FormControl label='Fecha de aniversario:'>
              <input type='date' {...register('fechaDeAniversario')} />
              {errors.fechaDeAniversario && (
                <p>{errors.fechaDeAniversario.message}</p>
              )}
            </FormControl>
          </InputGroup>
          {errorMessage && <ErrorMessage error={errorMessage} />}
          {isSubmitting && <Loader />}
          <FormControl>
            <Button
              disabled={isSubmitting || !isDirty}
              buttonType={
                isSubmitting || !isDirty
                  ? BUTTON_TYPE_CLASSES.disabled
                  : BUTTON_TYPE_CLASSES.base
              }
            >
              ACTUALIZAR DATOS
            </Button>
          </FormControl>
        </form>
      </Container>
      {successMessage && (
        <Modal>
          <p>{successMessage}</p>
          <Button onClick={handleClick} type='button'>
            Ok
          </Button>
        </Modal>
      )}
    </BackgroundGradientContainer>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });
  const datosLeal = await getDatosLeal(session.user.userId);

  if (!session || session.user.role !== 'LEAL') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: { session, datosLeal },
  };
}
