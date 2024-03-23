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
import Button from '../button';
import Container from '../layout/container';

export default function LoginForm() {
  const [isError, setIsError] = useState();

  const { setCurrentUser } = useContext(UserContext);

  const { register, handleSubmit, watch } = useForm({
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
        <h1>Loading...</h1>
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
          <label>Numero de usuario:</label>
          <input type='text' {...register('userId')} required />
        </FormControl>
        <FormControl>
          <label>Contraseña:</label>
          <input type='password' {...register('password')} required />
        </FormControl>
        <FormControl>
          <Button>Iniciar Sesión</Button>
        </FormControl>
        {isError && <ErrorMessage error={isError} />}
        <FormControl type='button' label='Ingresar' />
      </form>
      <div className={classes.formFooter}>
        <p>¿No tienes cuenta?</p>
        <Link href='/cliente/cliente-nuevo'>Registrate aquí</Link>
      </div>
    </div>
  );
}
