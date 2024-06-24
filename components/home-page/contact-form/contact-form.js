import { useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import Container from '@/components/layout/container';
import InputGroup from '@/components/forms/input-group';
import FormControl, {
  INPUT_TYPE_CLASSES,
} from '@/components/forms/form-control';

import classes from './contact-form.module.scss';
import Button from '@/components/button';

// Nombre
// Correo
// Teléfono
// Empresa
// ¿De dónde nos visitas?
// Giro de tu empresa
// ¿Cuál es tu necesidad?

export default function ContactForm() {
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
      nombre: '',
      email: '',
      telefono: '',
      empresa: '',
      ubicacion: '',
      // ¿De dónde nos visitas?
      giro: '',
      // Giro de tu empresa
      necesidad: '',
      // ¿Cuál es tu necesidad?
    },
    //   resolver: zodResolver(contactoSchema),
  });

  async function sendContacto(data) {
    //   const response = await fetch('/api/home/send-email', {
    //     method: 'POST',
    //     body: JSON.stringify(data),
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //   });
    //   const responseData = await response.json();
    //   if (!response.ok) {
    //     throw new Error(responseData.message || 'Algo salió mal!');
    //   }
    //   if (responseData.errors) {
    //     if (errors.email) {
    //       setError('email', {
    //         type: 'server',
    //         message: errors.email,
    //       });
    //     }
    //   }
    //   return responseData;
  }

  const onSubmit = async (data) => {
    setSuccessMessage('');
    setErrorMessage('');

    console.log(data);
    //   //submit to server
    //   try {
    //     const result = await sendEmail(data);
    //     //succesfuly updated data
    //     setSuccessMessage(result.message);
    //     reset();
    //   } catch (error) {
    //     console.log(error);
    //     setErrorMessage(
    //       error.message ||
    //         'Algo salio mal, intenta de nuevo o contacta al administrador.'
    //     );
    //   }
  };

  return (
    <Container>
      <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
        <h2>Contacto:</h2>
        <InputGroup>
          <FormControl label='Nombre:' inputType={INPUT_TYPE_CLASSES.fullWidth}>
            <input type='text' />
          </FormControl>
          <FormControl
            label='Correo electrónico:'
            inputType={INPUT_TYPE_CLASSES.fullWidth}
          >
            <input type='email' />
          </FormControl>
        </InputGroup>
        <InputGroup>
          <FormControl
            label='Teléfono'
            inputType={INPUT_TYPE_CLASSES.fullWidth}
          >
            <input type='text' />
          </FormControl>
          <FormControl label='Empresa' inputType={INPUT_TYPE_CLASSES.fullWidth}>
            <input type='text' />
          </FormControl>
        </InputGroup>
        <FormControl>
          <Button>Enviar</Button>
        </FormControl>
      </form>
    </Container>
  );
}
