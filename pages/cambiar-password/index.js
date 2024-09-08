import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';

import { zodResolver } from '@hookform/resolvers/zod';
import { cambiarPasswordSchema } from '@/lib/schemas/schemas';

import Container from '@/components/layout/container';
import FormControl, {
  INPUT_TYPE_CLASSES,
} from '@/components/forms/form-control';
import Button, { BUTTON_TYPE_CLASSES } from '@/components/button';
import ErrorMessage from '@/components/ui/error-message';
import Modal from '@/components/ui/modal';
import Loader from '@/components/ui/loader';
import BackgroundGradientContainer from '@/components/layout/background-gradient-container';

export default function CambiarPassPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm({
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
    resolver: zodResolver(cambiarPasswordSchema),
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const router = useRouter();

  async function changePassword(data) {
    const response = await fetch('api/auth/changePass', {
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
      if (errors.oldPassword) {
        setError('oldPassword', {
          type: 'server',
          message: errors.oldPassword,
        });
      }
      if (errors.newPassword) {
        setError('newPassword', {
          type: 'server',
          message: errors.newPassword,
        });
      }
      if (errors.confirmNewPassword) {
        setError('confirmNewPassword', {
          type: 'server',
          message: errors.confirmNewPassword,
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
      const result = await changePassword(data);
      // successfuly changed password
      setSuccessMessage(result.message);
    } catch (error) {
      console.log(error);
      if (error.message === 'La contraseña es incorrecta') {
        setError('oldPassword', {
          type: 'server',
          message: error.message,
        });
      } else {
        setErrorMessage(
          error.message ||
            'Algo salio mal, intenta de nuevo o contacta al administrador.'
        );
      }
      //fail on change password
    }
  };

  const handleClick = function () {
    reset();
    router.replace('/login');
  };

  return (
    <BackgroundGradientContainer>
      <Container md>
        <h1>Cambia tu contraseña</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl
            label='Contraseña actual:'
            inputType={INPUT_TYPE_CLASSES.fullWidth}
          >
            <input
              type='password'
              placeholder='Escribe tu contraseña actual'
              {...register('oldPassword')}
            />
            {errors.oldPassword && <p>{errors.oldPassword.message}</p>}
          </FormControl>
          <FormControl
            label='Nueva contraseña:'
            inputType={INPUT_TYPE_CLASSES.fullWidth}
          >
            <input
              type='password'
              placeholder='Escribe tu nueva contraseña'
              {...register('newPassword')}
            />
            {errors.newPassword && <p>{errors.newPassword.message}</p>}
          </FormControl>
          <FormControl
            label='Confirma tu contraseña nueva:'
            inputType={INPUT_TYPE_CLASSES.fullWidth}
          >
            <input
              type='password'
              placeholder='Confirma tu nueva contraseña'
              {...register('confirmNewPassword')}
            />
            {errors.confirmNewPassword && (
              <p>{errors.confirmNewPassword.message}</p>
            )}
          </FormControl>
          {errorMessage && <ErrorMessage error={errorMessage} />}
          {isSubmitting && <Loader />}
          <FormControl>
            <Button
              type='button'
              disabled={isSubmitting}
              buttonType={
                isSubmitting
                  ? BUTTON_TYPE_CLASSES.disabled
                  : BUTTON_TYPE_CLASSES.secondary
              }
              href={'/login'}
            >
              VOLVER
            </Button>
            <Button
              disabled={isSubmitting}
              buttonType={
                isSubmitting
                  ? BUTTON_TYPE_CLASSES.disabled
                  : BUTTON_TYPE_CLASSES.base
              }
            >
              CAMBIAR CONTRASEÑA
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

  if (!session || session.user.role !== 'LEAL') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
