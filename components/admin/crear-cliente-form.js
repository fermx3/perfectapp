import { useState } from 'react';

import FormControl from '../forms/form-control';

async function createCliente(userId, password, nivelDeCliente, nombre, role) {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({
      userId,
      password,
      nivelDeCliente,
      nombre,
      role,
    }),
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
    nombre: '',
  });

  async function submitHandler(event) {
    event.preventDefault();

    const enteredUserId = formInput.userId;
    const enteredPassword = formInput.password;
    const enterednivelDeCliente = formInput.nivelDeCliente;
    const enterednombre = formInput.nombre;

    // Add validation

    try {
      const result = await createCliente(
        enteredUserId,
        enteredPassword,
        enterednivelDeCliente,
        enterednombre,
        'LEAL'
      );
      console.log(result); //Successfuly create user
    } catch (error) {
      console.log(error); //Fail on create user
    }

    //reset form
    setFormInput({
      userId: '',
      password: '',
      nivelDeCliente: 'Básico',
      nombre: '',
    });
  }

  const tiposDeClientes = ['Básico', 'Oro', 'Platino'];

  return (
    <>
      <form onSubmit={submitHandler}>
        <FormControl
          id='userId'
          label='Numero de cliente:'
          type='number'
          value={formInput.userId}
          onChange={(event) =>
            setFormInput({ ...formInput, userId: event.target.value })
          }
        />
        <FormControl
          id='password'
          label='Contraseña:'
          type='password'
          value={formInput.password}
          onChange={(event) =>
            setFormInput({ ...formInput, password: event.target.value })
          }
        />
        <FormControl
          id='nombre'
          label='Nombre del cliente:'
          type='text'
          value={formInput.nombre}
          onChange={(event) =>
            setFormInput({ ...formInput, nombre: event.target.value })
          }
        />
        <FormControl
          id='nivelDeCliente'
          label='Tipo de cliente:'
          type='select'
          options={tiposDeClientes}
          onChange={(event) =>
            setFormInput({ ...formInput, nivelDeCliente: event.target.value })
          }
        />
        <FormControl type='button' label='Crear Cliente' />
      </form>
    </>
  );
}
