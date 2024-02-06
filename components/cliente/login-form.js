import { useState } from 'react';
import Link from 'next/link';

import Button from '../button';

async function createCliente(userId, password) {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ userId, password }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong!');
  }

  return data;
}

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
      const result = await createCliente(enteredUserId, enteredPassword);
      console.log(result); //Successfuly create user
    } catch (error) {
      console.log(error); //Fail on create user
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
