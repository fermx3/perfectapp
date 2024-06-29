import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';

import { zodResolver } from '@hookform/resolvers/zod';
import { contactoSchema } from '@/lib/schemas/schemas';

import Container from '@/components/layout/container';
import InputGroup from '@/components/forms/input-group';
import FormControl from '@/components/forms/form-control';
import Modal from '@/components/ui/modal';
import Button from '@/components/button';

import classes from './contact-form.module.scss';
import Loader from '@/components/ui/loader';

export default function ContactForm() {
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    defaultValues: {
      nombre: '',
      email: '',
      telefono: '',
      empresa: '',
      ubicacion: '',
      giro: '',
      necesidad: '',
    },
    resolver: zodResolver(contactoSchema),
  });

  const handleClick = function () {
    router.replace('/');
  };

  async function sendContacto(data) {
    const response = await fetch('/api/contacto/send-contacto', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const responseData = await response.json();
    if (!response.ok) {
      throw new Error(responseData.message || 'Algo salió mal!');
    }
    if (responseData.errors) {
      if (errors.nombre) {
        setError('nombre', {
          type: 'server',
          message: errors.nombre,
        });
      } else if (errors.email) {
        setError('email', {
          type: 'server',
          message: errors.email,
        });
      } else if (errors.telefono) {
        setError('telefono', {
          type: 'server',
          message: errors.telefono,
        });
      } else if (errors.empresa) {
        setError('empresa', {
          type: 'server',
          message: errors.empresa,
        });
      } else if (errors.ubicacion) {
        setError('ubicacion', {
          type: 'server',
          message: errors.ubicacion,
        });
      } else if (errors.giro) {
        setError('giro', {
          type: 'server',
          message: errors.giro,
        });
      } else if (errors.necesidad) {
        setError('necesidad', {
          type: 'server',
          message: errors.necesidad,
        });
      }
    }
    return responseData;
  }

  const onSubmit = async (data) => {
    setSuccessMessage('');
    setErrorMessage('');
    //submit to server
    try {
      const result = await sendContacto(data);
      //succesfuly updated data
      setSuccessMessage(result.message);
      reset();
    } catch (error) {
      console.log(error);
      setErrorMessage(
        error.message ||
          'Algo salio mal, intenta de nuevo o contacta al administrador.'
      );
    }
  };

  return (
    <Container>
      <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
        <InputGroup>
          <FormControl label='Nombre:' error={errors.nombre?.message}>
            <input type='text' {...register('nombre')} />
          </FormControl>
          <FormControl
            label='Correo electrónico:'
            error={errors.email?.message}
          >
            <input type='email' {...register('email')} />
          </FormControl>
        </InputGroup>
        <InputGroup>
          <FormControl label='Teléfono' error={errors.telefono?.message}>
            <input type='text' {...register('telefono')} />
          </FormControl>
          <FormControl label='Empresa' error={errors.empresa?.message}>
            <input type='text' {...register('empresa')} />
          </FormControl>
        </InputGroup>
        <InputGroup>
          <FormControl
            label='¿De dónde nos visitas?'
            error={errors.ubicacion?.message}
          >
            <input type='text' {...register('ubicacion')} />
          </FormControl>
          <FormControl label='Giro de tu empresa' error={errors.giro?.message}>
            <input type='text' {...register('giro')} />
          </FormControl>
        </InputGroup>
        <InputGroup>
          <FormControl
            label='¿Cuál es tu necesidad?'
            error={errors.necesidad?.message}
          >
            <textarea rows='4' {...register('necesidad')} />
          </FormControl>
        </InputGroup>
        {isSubmitting && <Loader />}
        <FormControl>
          <Button>Enviar</Button>
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
    </Container>
  );
}
