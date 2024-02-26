import { useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

import { signIn } from 'next-auth/react';

import Button from '../button';

import classes from './login-form.module.scss';
import FormControl from '../forms/form-control';

export default function LoginForm() {
  const [formInput, setFormInput] = useState({
    userId: '',
    password: '',
  });

  const router = useRouter();
  const session = useSession();

  if (session.status === 'authenticated') {
    router.replace(`/cliente/${session.data.user.userId}`);
  }

  async function submitHandler(event) {
    event.preventDefault();

    const enteredUserId = formInput.userId;
    const enteredPassword = formInput.password;

    // Add validation

    try {
      const result = await signIn('credentials', {
        redirect: false,
        userId: enteredUserId,
        password: enteredPassword,
      });
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
          label='Numero de cliente:'
          type='text'
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
        <FormControl type='button' label='Ingresar' />
      </form>
      <div className={classes.formFooter}>
        <p>¿No tienes cuenta?</p>
        <Link href='/cliente/cliente-nuevo'>Registrate aquí</Link>
      </div>
    </div>
  );
}
