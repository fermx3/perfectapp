import { useForm } from 'react-hook-form';
import Button, { BUTTON_TYPE_CLASSES } from '@/components/button';
import FormControl from '@/components/forms/form-control';
import FormGroup from '@/components/forms/form-group';
import InputGroup from '@/components/forms/input-group';
import Loader from '@/components/ui/loader';
import {
  cambiarValorDePuntosSchema,
  nivelesDeLeales,
} from '@/lib/schemas/schemas';
import { zodResolver } from '@hookform/resolvers/zod';

import BackgroundGradientContainer from '@/components/layout/background-gradient-container';
import Container from '@/components/layout/container';
import { getSession } from 'next-auth/react';
import { getAllValoresDePuntos } from '@/lib/db';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Modal from '@/components/ui/modal';

export default function CambiarValorPuntosPage({ valorDePuntos }) {
  const defaultValues = valorDePuntos;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitted },
    reset,
    resetField,
    setError,
  } = useForm({
    defaultValues,
    resolver: zodResolver(cambiarValorDePuntosSchema),
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const router = useRouter();

  const handleClick = function () {
    router.reload();
  };

  async function actualizarPuntos(data) {
    const response = await fetch('/api/admin/cambiar-valor-puntos', {
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

    // if (responseData.errors) {
    //   const errors = responseData.errors;

    //   if (errors.nombre) {
    //     setError('nombre', {
    //       type: 'server',
    //       message: errors.nombre,
    //     });
    //   } else if (errors.nivelDeCliente) {
    //     setError('nivelDeCliente', {
    //       type: 'server',
    //       message: errors.nivelDeCliente,
    //     });
    //   } else if (errors.central) {
    //     setError('central', {
    //       type: 'server',
    //       message: errors.central,
    //     });
    //   } else if (errors.ubicacion) {
    //     setError('ubicacion', {
    //       type: 'server',
    //       message: errors.ubicacion,
    //     });
    //   } else if (errors.canal) {
    //     setError('canal', {
    //       type: 'server',
    //       message: errors.canal,
    //     });
    //   } else if (errors.comentarios) {
    //     setError('comentarios', {
    //       type: 'server',
    //       message: errors.comentarios,
    //     });
    //   }
    // }

    return responseData;
  }

  const onSubmit = async (data) => {
    setSuccessMessage('');
    setErrorMessage('');

    // submit to server
    try {
      const result = await actualizarPuntos(data);
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
    <BackgroundGradientContainer>
      <Container>
        <header>
          <h1>Cambiar valor de los puntos por tipo de cliente</h1>
          <p>Cambia el valor de los puntos por tipo de cliente.</p>
        </header>
        <main>
          <form onSubmit={handleSubmit(onSubmit)}>
            {nivelesDeLeales.map((nivel, index) => (
              <FormGroup titulo={nivel} key={index}>
                <InputGroup>
                  {Object.keys(valorDePuntos[nivel.toLowerCase()]).map(
                    (key, i) => {
                      return (
                        <FormControl
                          label={key}
                          key={i}
                          error={errors[nivel.toLowerCase()]?.[key]?.message}
                        >
                          <input
                            type='number'
                            min={0}
                            {...register(`${nivel.toLowerCase()}.${key}`, {
                              valueAsNumber: true,
                            })}
                          />
                        </FormControl>
                      );
                    }
                  )}
                </InputGroup>
              </FormGroup>
            ))}
            {isSubmitting && <Loader />}
            <InputGroup>
              <FormControl>
                <Button
                  disabled={isSubmitting}
                  buttonType={
                    isSubmitting
                      ? BUTTON_TYPE_CLASSES.disabled
                      : BUTTON_TYPE_CLASSES.base
                  }
                >
                  Actualiza valor de puntos
                </Button>
              </FormControl>
            </InputGroup>
          </form>
        </main>
      </Container>
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
    </BackgroundGradientContainer>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });

  if (!session || session.user.role !== 'ADMIN') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const empresa = session?.user?.empresa;
  const valorDePuntos = await getAllValoresDePuntos(empresa);

  return {
    props: { session, valorDePuntos },
  };
}
