import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import { crearLealSchema } from '@/lib/schemas/schemas';

import FormControl from '../forms/form-control';
import Button, { BUTTON_TYPE_CLASSES } from '../button';
import Loader from '../ui/loader';
import InputGroup from '../forms/input-group';

import {
  nivelesDeLeales,
  tiposDeCadena,
  tiposDeLeales,
  frecuencias,
} from '@/lib/schemas/schemas';
import InfoMessage from '../ui/info-message';
import ErrorMessage from '../ui/error-message';

export default function CrearClienteForm({ asesores }) {
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
      cadena: '',
      leales: '',
      frecuencia: '',
      asesorAsignado: '',
      role: 'LEAL',
    },
    resolver: zodResolver(crearLealSchema),
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  async function createCliente(data) {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log(data);

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.error.message || 'Something went wrong!');
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
      } else if (errors.cadena) {
        setError('cadena', {
          type: 'server',
          message: errors.cadena,
        });
      } else if (errors.leales) {
        setError('leales', {
          type: 'server',
          message: errors.leales,
        });
      } else if (errors.frecuencia) {
        setError('frecuencia', {
          type: 'server',
          message: errors.frecuencia,
        });
      } else if (errors.asesorAsignado) {
        setError('frecuencia', {
          type: 'server',
          message: errors.asesorAsignado,
        });
      }
    }

    return responseData;
  }

  const onSubmit = async (data) => {
    setSuccessMessage('');
    setErrorMessage('');
    // submit to server
    try {
      const result = await createCliente(data);
      //Successfuly create user
      setSuccessMessage(result.message);
      if (result.message) {
        reset();
      }
    } catch (error) {
      setErrorMessage(
        'Algo salio mal, intenta de nuevo o contacta al administrador.'
      );
      //Fail on create user
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputGroup>
          <FormControl>
            <input
              type='text'
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
          <FormControl label='Nivel de cliente:'>
            <select
              {...register('nivelDeCliente')}
              placeholder='Nivel de cliente'
            >
              {nivelesDeLeales.map((option) => (
                <option value={option} key={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.nivelDeCliente && <p>{errors.nivelDeCliente.message}</p>}
          </FormControl>
          <FormControl label='Cadena:'>
            <select {...register('cadena')} placeholder='Cadena'>
              {tiposDeCadena.map((option) => (
                <option value={option} key={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.cadena && <p>{errors.cadena.message}</p>}
          </FormControl>
          <FormControl label='Leales:'>
            <select {...register('leales')} placeholder='Leales'>
              {tiposDeLeales.map((option) => (
                <option value={option} key={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.leales && <p>{errors.leales.message}</p>}
          </FormControl>
          <FormControl label='Frecuencia:'>
            <select
              {...register('frecuencia')}
              placeholder='Frecuencia'
              multiple
            >
              {frecuencias.map((option) => (
                <option value={option} key={option}>
                  {option}
                </option>
              ))}
            </select>
            <p>Usa control o shift para seleccionar más de una</p>
            {errors.frecuencia && <p>{errors.frecuencia.message}</p>}
          </FormControl>
          <FormControl label='Asesor Asignado:'>
            <select
              {...register('asesorAsignado')}
              placeholder='Asesor Asignado'
              multiple
            >
              {asesores.map((option) => (
                <option value={option.userId} key={option.userId}>
                  {option.nombre}
                </option>
              ))}
            </select>
            <p>Usa control o shift para seleccionar más de una</p>
            {errors.asesorAsignado && <p>{errors.asesorAsignado.message}</p>}
          </FormControl>
        </InputGroup>
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
        </FormControl>
        {successMessage && <InfoMessage titulo={successMessage} />}
        {errorMessage && <ErrorMessage error={errorMessage} />}
      </form>
    </>
  );
}
