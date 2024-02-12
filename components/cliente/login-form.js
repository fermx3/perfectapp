import { useState } from 'react';
import Link from 'next/link';

import { signIn } from 'next-auth/react';

import Button from '../button';

export default function LoginForm() {
  const [formInput, setFormInput] = useState({
    userId: '',
    password: '',
  });

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
    <>
      <h2>Login</h2>
      <form onSubmit={submitHandler}>
        <div>
          <label htmlFor='userId'>Numero de cliente:</label>
          <input
            type='text'
            id='userId'
            value={formInput.userId}
            onChange={(event) =>
              setFormInput({ ...formInput, userId: event.target.value })
            }
            required
          />
        </div>
        <div>
          <label htmlFor='password'>Contraseña:</label>
          <input
            type='password'
            id='password'
            value={formInput.password}
            onChange={(event) =>
              setFormInput({ ...formInput, password: event.target.value })
            }
            required
          />
        </div>
        <div>
          <Button>Ingresar</Button>
        </div>
      </form>
      <div>
        <p>¿No tienes tus datos?</p>
        <Link href='/cliente/cliente-nuevo'>
          Soy cliente nuevo en perfect app
        </Link>
      </div>
    </>
  );
}
