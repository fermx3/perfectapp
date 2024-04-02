import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { UserContext } from '@/store/user-context';

import Link from 'next/link';
import FormControl from '../forms/form-control';
import ErrorMessage from '../ui/error-message';

import { useForm } from 'react-hook-form';

import { signIn } from 'next-auth/react';

import classes from './login-form.module.scss';
import Button, { BUTTON_TYPE_CLASSES } from '../button';
import Container from '../layout/container';
import Loader from '../ui/loader';

export default function LoginForm() {
  const [isError, setIsError] = useState();

  const { setCurrentUser } = useContext(UserContext);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      userId: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      const result = await signIn('credentials', {
        redirect: false,
        userId: data.userId,
        password: data.password,
      });

      if (result.error) {
        setIsError(result.error);
      }

      console.log(result); //Successfuly logged in user
    } catch (error) {
      console.log(error); //Fail on loggin user
    }
  };

  const router = useRouter();
  const session = useSession();

  if (session.status === 'authenticated') {
    switch (session.data.user.role) {
      case 'LEAL':
        router.replace(`/cliente/${session.data.user.userId}`);
        break;
      case 'ASESOR':
        router.replace(`/asesor/${session.data.user.userId}`);
        break;
      case 'ADMIN':
        router.replace(`/admin`);
        break;
      default:
        router.replace('/login-error');
    }
    return (
      <Container md>
        <Loader />
        <h1>Cargando...</h1>
      </Container>
    );
  }

  if (session.data) {
    setCurrentUser(session.data.user);
  }

  return (
    <div className={classes.formContainer}>
      <h2>Inicia Sesión</h2>
      <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
        <FormControl>
          <input
            type='number'
            placeholder='Numero de usuario'
            {...register('userId', {
              required: 'Por favor introduce tu número de usuario.',
            })}
          />
          {errors.userId && <p>{errors.userId.message}</p>}
        </FormControl>
        <FormControl>
          <input
            type='password'
            placeholder='Contraseña'
            minLength={8}
            {...register('password', {
              required: 'Por favor introduce tu contraseña.',
            })}
          />
          {errors.password && <p>{errors.password.message}</p>}
        </FormControl>
        <FormControl>
          <Button
            disabled={isSubmitting}
            buttonType={
              isSubmitting
                ? BUTTON_TYPE_CLASSES.disabled
                : BUTTON_TYPE_CLASSES.base
            }
          >
            Iniciar Sesión
          </Button>
        </FormControl>
        {isSubmitting && <Loader />}
        {isError && <ErrorMessage error={isError} />}
      </form>
      <div className={classes.formFooter}>
        <Link href='/cliente/cliente-nuevo'>
          ¿No tienes cuenta? Registrate aquí
        </Link>
      </div>
    </div>
  );
}
