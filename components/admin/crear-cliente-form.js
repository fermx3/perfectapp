import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import { crearLealSchema } from '@/lib/schemas/schemas';

import FormControl from '../forms/form-control';
import Button, { BUTTON_TYPE_CLASSES } from '../button';
import Loader from '../ui/loader';

export default function CrearClienteForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitted },
    reset,
    setError,
  } = useForm({
    defaultValues: {
      userId: '',
      password: '',
      confirmPassword: '',
      nivelDeCliente: '',
      nombre: '',
      role: 'LEAL',
    },
    resolver: zodResolver(crearLealSchema),
  });

  const [successMessage, setSuccessMessage] = useState('');

  async function createCliente(data) {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'Something went wrong!');
    }

    if (responseData.errors) {
      const errors = responseData.errors;

      if (errors.userId) {
        setError('userId', {
          type: 'server',
          message: errors.userId,
        });
      } else if (errors.password) {
        setError('password', {
          type: 'server',
          message: errors.password,
        });
      } else if (errors.confirmPassword) {
        setError('confirmPassword', {
          type: 'server',
          message: errors.confirmPassword,
        });
      } else if (errors.nombre) {
        setError('nombre', {
          type: 'server',
          message: errors.nombre,
        });
      } else if (errors.nivelDeCliente) {
        setError('nivelDeCliente', {
          type: 'server',
          message: errors.nivelDeCliente,
        });
      }
    }

    return responseData;
  }

  const tiposDeClientes = ['Básico', 'Oro', 'Platino'];

  const onSubmit = async (data) => {
    setSuccessMessage('');
    // submit to server
    try {
      const result = await createCliente(data);
      //Successfuly create user
      setSuccessMessage(result.message);
      if (result.message) {
        reset();
      }
    } catch (error) {
      console.log(error);
      //Fail on create user
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl>
          <input
            type='number'
            min={0}
            {...register('userId')}
            placeholder='Numero de cliente'
          />
          {errors.userId && <p>{errors.userId.message}</p>}
        </FormControl>
        <FormControl>
          <input
            type='text'
            {...register('password')}
            placeholder='Contraseña'
          />
          {errors.password && <p>{errors.password.message}</p>}
        </FormControl>
        <FormControl>
          <input
            type='password'
            {...register('confirmPassword')}
            placeholder='Confirmar Contraseña'
          />
          {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
        </FormControl>
        <FormControl>
          <input type='text' {...register('nombre')} placeholder='Nombre' />
          {errors.nombre && <p>{errors.nombre.message}</p>}
        </FormControl>
        <FormControl>
          <label>Nivel de cliente:</label>
          <select
            {...register('nivelDeCliente')}
            placeholder='Nivel de cliente'
          >
            {tiposDeClientes.map((option) => (
              <option value={option} key={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.nivelDeCliente && <p>{errors.nivelDeCliente.message}</p>}
        </FormControl>
        <input type='hidden' value='LEAL' {...register('role')} />
        <FormControl>
          {isSubmitting && <Loader />}
          <Button
            disable={isSubmitting}
            buttonType={
              isSubmitting
                ? BUTTON_TYPE_CLASSES.disabled
                : BUTTON_TYPE_CLASSES.base
            }
          >
            Crear Leal
          </Button>
          {successMessage && <p>{successMessage}</p>}
        </FormControl>
      </form>
    </>
  );
}
