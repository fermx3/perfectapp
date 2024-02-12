import { useState } from 'react';

import Button from '../button';

async function createCliente(userId, password, nivelDeCliente, role) {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ userId, password, nivelDeCliente, role }),
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

export default function CrearClienteForm() {
  const [formInput, setFormInput] = useState({
    userId: '',
    password: '',
    nivelDeCliente: 'Básico',
  });

  async function submitHandler(event) {
    event.preventDefault();

    const enteredUserId = formInput.userId;
    const enteredPassword = formInput.password;
    const enterednivelDeCliente = formInput.nivelDeCliente;

    // Add validation

    try {
      const result = await createCliente(
        enteredUserId,
        enteredPassword,
        enterednivelDeCliente,
        'CLIENTE'
      );
      console.log(result); //Successfuly create user
    } catch (error) {
      console.log(error); //Fail on create user
    }
  }

  const tiposDeClientes = ['Básico', 'Oro', 'Platino'];

  return (
    <>
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
          <label htmlFor='nivelDeCliente'>Tipo de cliente:</label>
          <select
            onChange={(event) =>
              setFormInput({ ...formInput, nivelDeCliente: event.target.value })
            }
          >
            {tiposDeClientes.map((object) => {
              return (
                <option value={object} key={object}>
                  {object}
                </option>
              );
            })}
          </select>
        </div>
        <div>
          <Button>Crear Cliente</Button>
        </div>
      </form>
    </>
  );
}
