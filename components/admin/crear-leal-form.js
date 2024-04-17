import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import { canales, centrales, crearLealSchema } from '@/lib/schemas/schemas';

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

export default function CrearLealForm({ asesores }) {
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
      role: 'LEAL',
      userInfo: {
        nivelDeCliente: '',
        nombre: '',
        cadena: '',
        leales: '',
        frecuencia: '',
        asesorAsignado: '',
        central: '',
        ubicacion: '',
        canal: '',
      },
    },
    resolver: zodResolver(crearLealSchema),
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  async function createLeal(data) {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });

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
      } else if (errors.userInfo.nombre) {
        setError('userInfo.nombre', {
          type: 'server',
          message: errors.userInfo.nombre,
        });
      } else if (errors.userInfo.nivelDeCliente) {
        setError('userInfo.nivelDeCliente', {
          type: 'server',
          message: errors.userInfo.nivelDeCliente,
        });
      } else if (errors.userInfo.cadena) {
        setError('userInfo.cadena', {
          type: 'server',
          message: errors.userInfo.cadena,
        });
      } else if (errors.userInfo.leales) {
        setError('userInfo.leales', {
          type: 'server',
          message: errors.userInfo.leales,
        });
      } else if (errors.userInfo.frecuencia) {
        setError('userInfo.frecuencia', {
          type: 'server',
          message: errors.userInfo.frecuencia,
        });
      } else if (errors.userInfo.asesorAsignado) {
        setError('userInfo.asesorAsignado', {
          type: 'server',
          message: errors.userInfo.asesorAsignado,
        });
      } else if (errors.userInfo.central) {
        setError('userInfo.central', {
          type: 'server',
          message: errors.userInfo.central,
        });
      } else if (errors.userInfo.ubicacion) {
        setError('userInfo.ubicacion', {
          type: 'server',
          message: errors.userInfo.ubicacion,
        });
      } else if (errors.userInfo.canal) {
        setError('userInfo.canal', {
          type: 'server',
          message: errors.userInfo.canal,
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
      const result = await createLeal(data);
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
  console.log(errors);
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
            <input
              type='text'
              {...register('userInfo.nombre')}
              placeholder='Nombre'
            />
            {errors.userInfo?.nombre && <p>{errors.userInfo.nombre.message}</p>}
          </FormControl>
          <FormControl label='Nivel de cliente:'>
            <select
              {...register('userInfo.nivelDeCliente')}
              placeholder='Nivel de cliente'
            >
              {nivelesDeLeales.map((option) => (
                <option value={option} key={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.userInfo?.nivelDeCliente && (
              <p>{errors.userInfo.nivelDeCliente.message}</p>
            )}
          </FormControl>
          <FormControl label='Cadena:'>
            <select {...register('userInfo.cadena')} placeholder='Cadena'>
              {tiposDeCadena.map((option) => (
                <option value={option} key={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.userInfo?.cadena && <p>{errors.userInfo.cadena.message}</p>}
          </FormControl>
          <FormControl label='Leales:'>
            <select {...register('userInfo.leales')} placeholder='Leales'>
              {tiposDeLeales.map((option) => (
                <option value={option} key={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.userInfo?.leales && <p>{errors.userInfo.leales.message}</p>}
          </FormControl>
          <FormControl label='CEDAS:'>
            <select {...register('userInfo.central')} placeholder='CEDAS'>
              {centrales.map((option) => (
                <option value={option} key={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.userInfo?.central && (
              <p>{errors.userInfo.central.message}</p>
            )}
          </FormControl>
          <FormControl>
            <input
              type='text'
              {...register('userInfo.ubicacion')}
              placeholder='Ubicacion'
            />
            {errors.userInfo?.ubicacion && (
              <p>{errors.userInfo.ubicacion.message}</p>
            )}
          </FormControl>
          <FormControl label='Canal:'>
            <select {...register('userInfo.canal')} placeholder='Canal'>
              {canales.map((option) => (
                <option value={option} key={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.userInfo?.canal && <p>{errors.userInfo.canal.message}</p>}
          </FormControl>
          <FormControl label='Frecuencia:'>
            <select
              {...register('userInfo.frecuencia')}
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
            {errors.userInfo?.frecuencia && (
              <p>{errors.userInfo.frecuencia.message}</p>
            )}
          </FormControl>
          <FormControl label='Asesor Asignado:'>
            <select
              {...register('userInfo.asesorAsignado')}
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
            {errors.userInfo?.asesorAsignado && (
              <p>{errors.userInfo.asesorAsignado.message}</p>
            )}
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
