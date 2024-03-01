import { useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import FormControl from '../forms/form-control';

import { signIn } from 'next-auth/react';

import classes from './login-form.module.scss';
import ErrorMessage from '../ui/error-message';

export default function LoginForm() {
  const [formInput, setFormInput] = useState({
    userId: '',
    password: '',
  });

  const [isError, setIsError] = useState();

  const router = useRouter();
  const session = useSession();

  if (session.status === 'authenticated') {
    switch (session.data.user.role) {
      case 'LEAL':
        router.replace(`/cliente/${session.data.user.userId}`);
        break;
      case 'ASESOR':
        router.replace(`/asesor`);
        break;
      case 'ADMIN':
        router.replace(`/admin`);
        break;
      default:
        router.replace('/login-error');
    }
  }

  async function submitHandler(event) {
    event.preventDefault();
    setIsError(undefined);

    const enteredUserId = formInput.userId;
    const enteredPassword = formInput.password;

    // Add validation

    try {
      const result = await signIn('credentials', {
        redirect: false,
        userId: enteredUserId,
        password: enteredPassword,
      });

      if (result.error) {
        setIsError(result.error);
      }

      console.log(result); //Successfuly logged in user
    } catch (error) {
      console.log(error); //Fail on loggin user
    }
  }

  return (
    <div className={classes.formContainer}>
      <h2>Inicia Sesión</h2>
      <form onSubmit={submitHandler} className={classes.form}>
        <FormControl
          id='userId'
          label='Numero de usuario:'
          type='number'
          onChange={(event) =>
            setFormInput({ ...formInput, userId: event.target.value })
          }
        />
        <FormControl
          id='password'
          label='Contraseña:'
          type='password'
          onChange={(event) =>
            setFormInput({ ...formInput, password: event.target.value })
          }
        />
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
