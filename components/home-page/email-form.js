import { motion } from 'framer-motion';
import Image from 'next/image';
import { useForm } from 'react-hook-form';

import { emailSchema } from '@/lib/schemas/schemas';
import { zodResolver } from '@hookform/resolvers/zod';

import classes from './email-form.module.scss';
import Loader from '../ui/loader';
import { useState } from 'react';

export default function EmailForm() {
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    defaultValues: {
      email: '',
    },
    resolver: zodResolver(emailSchema),
  });

  async function sendEmail(data) {
    const response = await fetch('/api/send-email', {
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
      if (errors.email) {
        setError('email', {
          type: 'server',
          message: errors.email,
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
      const result = await sendEmail(data);
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
    <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
      <input
        type='email'
        placeholder='DEJA TU MAIL AQUÍ'
        {...register('email')}
      />
      <motion.button
        whileHover={{
          scale: 1.07,
          x: 5,
        }}
        whileTap={{
          scale: 0.87,
        }}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <Loader />
        ) : (
          <Image
            src='/images/icons/flecha-der.svg'
            width={512 / 30}
            height={512 / 30}
            alt=''
          />
        )}
      </motion.button>
      {errors.email && <p>{errors.email.message}</p>}
      {successMessage && <p>{successMessage}</p>}
      {errorMessage && <p>{errorMessage}</p>}
    </form>
  );
}
