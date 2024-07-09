import { useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

import Image from 'next/image';
import Link from 'next/link';
import FormControl, { INPUT_TYPE_CLASSES } from '../forms/form-control';
import ErrorMessage from '../ui/error-message';

import { useForm } from 'react-hook-form';

import { signIn } from 'next-auth/react';

import classes from './login-form.module.scss';
import Button, { BUTTON_TYPE_CLASSES } from '../button';
import Container from '../layout/container';
import Loader from '../ui/loader';

export default function LoginForm() {
  const [isError, setIsError] = useState();

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
        router.replace(`/leal/${session.data.user.userId}`);
        break;
      case 'ASESOR':
        router.replace(`/asesor/${session.data.user.userId}`);
        break;
      case 'COORDINADOR':
        router.replace(`/asesor/${session.data.user.userId}`);
        break;
      case 'ADMIN':
        router.replace(`/admin`);
        break;
      case 'USUARIO':
        router.replace(`/usuario/${session.data.user.userId}`);
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

  return (
    <div className={classes.formContainer}>
      <div className={classes.formHeader}>
        <h2>Inicia sesión</h2>
        <p>¡Bienvenidos, Leales! Aqui estamos todos en confianza.</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
        <div className={classes.imgBreaker}>
          <div className={classes.horizontalLine}></div>
          <Image
            src={'/images/icons/login.png'}
            width={50}
            height={50}
            alt='login'
          />
          <div className={classes.horizontalLine}></div>
        </div>
        <FormControl inputType={INPUT_TYPE_CLASSES.login}>
          <Image src={'/images/icons/user.png'} width={13} height={13} alt='' />
          <input
            type='text'
            placeholder='Numero de usuario'
            {...register('userId', {
              required: 'Por favor introduce tu número de usuario.',
            })}
          />
          {errors.userId && <p>{errors.userId.message}</p>}
        </FormControl>
        <FormControl inputType={INPUT_TYPE_CLASSES.login}>
          <Image
            src={'/images/icons/password.png'}
            width={13}
            height={13}
            alt=''
          />
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
            Iniciar sesión
          </Button>
        </FormControl>
        {isSubmitting && <Loader />}
        {isError && <ErrorMessage error={isError} />}
      </form>
      <div className={classes.formFooter}>
        <Link href='/password-olvidada'>¿Olvidaste tu contraseña?</Link>
      </div>
    </div>
  );
}
