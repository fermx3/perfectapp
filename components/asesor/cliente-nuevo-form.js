import { Controller, useForm } from 'react-hook-form';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { zodResolver } from '@hookform/resolvers/zod';

import { canales, centrales, clienteNuevoSchema } from '@/lib/schemas/schemas';
import { nivelesDeLeales } from '@/lib/schemas/schemas';

import FormControl from '../forms/form-control';
import Button, { BUTTON_TYPE_CLASSES } from '../button';
import Loader from '../ui/loader';
import InputGroup from '../forms/input-group';
import Modal from '../ui/modal';

import classes from './cliente-nuevo-form.module.scss';
import SelectInput from '../forms/select-input';

export default function ClienteNuevoForm({ asesores, session }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitted },
    reset,
    setError,
    control,
  } = useForm({
    defaultValues: {
      nombre: '',
      canal: '',
      central: '',
      ubicacion: '',
      nivelDeCliente: '',
      comentarios: '',
    },
    resolver: zodResolver(clienteNuevoSchema),
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const router = useRouter();

  const handleClick = function () {
    router.replace('/login');
  };

  async function crearCliente(data) {
    const response = await fetch('/api/asesor/cliente-nuevo', {
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

      if (errors.nombre) {
        setError('nombre', {
          type: 'server',
          message: errors.nombre,
        });
      } else if (errors.nivelDeCliente) {
        setError('nivelDeCliente', {
          type: 'server',
          message: errors.nivelDeCliente,
        });
      } else if (errors.central) {
        setError('central', {
          type: 'server',
          message: errors.central,
        });
      } else if (errors.ubicacion) {
        setError('ubicacion', {
          type: 'server',
          message: errors.ubicacion,
        });
      } else if (errors.canal) {
        setError('canal', {
          type: 'server',
          message: errors.canal,
        });
      } else if (errors.comentarios) {
        setError('comentarios', {
          type: 'server',
          message: errors.comentarios,
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
      const result = await crearCliente(data);
      //Successfuly create user
      setSuccessMessage(result.message);
      if (result.message) {
        reset();
      }
    } catch (error) {
      setErrorMessage(
        // error.message ||
        'Algo salio mal, intenta de nuevo o contacta al administrador.'
      );
      //Fail on create user
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
        <InputGroup>
          <FormControl label={'Nombre'} error={errors.nombre?.message}>
            <input type='text' {...register('nombre')} />
          </FormControl>
          <FormControl label='Canal:' error={errors.canal?.message}>
            <Controller
              name={'canal'}
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, value } }) => (
                <SelectInput
                  defaultValue={'Selecciona un canal'}
                  options={canales}
                  value={value}
                  onChange={onChange}
                />
              )}
            />
          </FormControl>
        </InputGroup>
        <InputGroup>
          <FormControl label='CEDAS:' error={errors.central?.message}>
            <Controller
              name={'central'}
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, value } }) => (
                <SelectInput
                  defaultValue={'Selecciona un CEDAS'}
                  options={centrales}
                  value={value}
                  onChange={onChange}
                />
              )}
            />
          </FormControl>
          <FormControl label='Ubicación' error={errors.ubicacion?.message}>
            <input
              type='text'
              {...register('ubicacion')}
              placeholder='Nave y local'
            />
          </FormControl>
        </InputGroup>
        <InputGroup>
          <FormControl label='*Grupo:' error={errors.grupo?.message}>
            <input
              type='text'
              {...register('grupo')}
              placeholder='Grupo al que pertenece'
            />
          </FormControl>
          <FormControl
            label='Nivel de cliente:'
            error={errors.nivelDeCliente?.message}
          >
            <Controller
              name={'nivelDeCliente'}
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, value } }) => (
                <SelectInput
                  defaultValue={'Selecciona un nivel de cliente'}
                  options={nivelesDeLeales}
                  value={value}
                  onChange={onChange}
                />
              )}
            />
          </FormControl>
        </InputGroup>
        <FormControl label='*Comentarios:' error={errors.comentarios?.message}>
          <textarea {...register('comentarios')} rows={4} />
        </FormControl>
        <p className={classes.opcionales}>*Campos opcionales</p>
        <FormControl>
          {isSubmitting && <Loader />}
          <Button
            disabled={isSubmitting}
            buttonType={
              isSubmitting
                ? BUTTON_TYPE_CLASSES.disabled
                : BUTTON_TYPE_CLASSES.base
            }
          >
            ENVIAR
          </Button>
        </FormControl>
      </form>
      {(successMessage || errorMessage) && (
        <Modal>
          <p style={{ marginBottom: '1rem' }}>
            {successMessage || errorMessage}
          </p>
          <Button type='button' onClick={handleClick}>
            Ok
          </Button>
        </Modal>
      )}
    </>
  );
}
