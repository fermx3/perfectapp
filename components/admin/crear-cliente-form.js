import { useState } from 'react';

import Button from '../button';

async function createCliente(userId, password, tipoDeCliente) {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ userId, password, tipoDeCliente }),
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
    tipoDeCliente: 'Básico',
  });

  async function submitHandler(event) {
    event.preventDefault();

    const enteredUserId = formInput.userId;
    const enteredPassword = formInput.password;
    const enteredTipoDeCliente = formInput.tipoDeCliente;

    // Add validation

    try {
      const result = await createCliente(
        enteredUserId,
        enteredPassword,
        enteredTipoDeCliente
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
          <label htmlFor='tipoDeCliente'>Tipo de cliente:</label>
          <select
            onChange={(event) =>
              setFormInput({ ...formInput, tipoDeCliente: event.target.value })
            }
          >
            {tiposDeClientes.map((object) => {
              return <option value={object}>{object}</option>;
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
