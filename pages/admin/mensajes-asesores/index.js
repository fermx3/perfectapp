import Button, { BUTTON_TYPE_CLASSES } from '@/components/button';
import FormControl from '@/components/forms/form-control';
import FormGroup from '@/components/forms/form-group';
import InputGroup from '@/components/forms/input-group';
import BackgroundGradientContainer from '@/components/layout/background-gradient-container';
import Container from '@/components/layout/container';
import { getMensajesAsesores } from '@/lib/db';
import { actualizarMensajesSchema } from '@/lib/schemas/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Loader from '@/components/ui/loader';
import Image from 'next/image';
import Modal from '@/components/ui/modal';

export default function MensajesAsesoresPage({ mensajesAsesores }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitted },
    reset,
    resetField,
    setError,
  } = useForm({
    defaultValues: {
      infoDeCategoria: {
        titulo: mensajesAsesores.infoDeCategoria?.titulo || '',
        contenido: mensajesAsesores.infoDeCategoria?.contenido || '',
      },
      infoDeComunicacion: {
        titulo: mensajesAsesores.infoDeComunicacion?.titulo || '',
        contenido: mensajesAsesores.infoDeComunicacion?.contenido || '',
      },
      infoDeFidelizacion: {
        titulo: mensajesAsesores.infoDeFidelizacion?.titulo || '',
        contenido: mensajesAsesores.infoDeFidelizacion?.contenido || '',
      },
    },
    resolver: zodResolver(actualizarMensajesSchema),
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const router = useRouter();

  const handleClick = function () {
    router.reload();
  };

  async function actualizarMensajes(data) {
    const response = await fetch('/api/admin/mensajes-asesores', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const responseData = await response.json();

    // if (!response.ok) {
    //   throw new Error(responseData.error.message || 'Something went wrong!');
    // }

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
      const result = await actualizarMensajes(data);
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
        <h1>Mensajes para Asesores</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup titulo='Info de Categoria'>
            <InputGroup>
              <FormControl label='Titulo'>
                <input type='text' {...register('infoDeCategoria.titulo')} />
              </FormControl>
              <FormControl label='Contenido'>
                <input type='text' {...register('infoDeCategoria.contenido')} />
              </FormControl>
              <Button
                type='button'
                buttonType={BUTTON_TYPE_CLASSES.secondary}
                onClick={() => {
                  resetField('infoDeCategoria', {
                    defaultValue: { titulo: '', contenido: '' },
                  });
                }}
              >
                <Image
                  src='/images/icons/delete.png'
                  width={20}
                  height={20}
                  alt=''
                />
              </Button>
            </InputGroup>
          </FormGroup>
          <FormGroup titulo='Info de Fidelizacion'>
            <InputGroup>
              <FormControl label='Titulo'>
                <input type='text' {...register('infoDeFidelizacion.titulo')} />
              </FormControl>
              <FormControl label='Contenido'>
                <input
                  type='text'
                  {...register('infoDeFidelizacion.contenido')}
                />
              </FormControl>
              <Button
                type='button'
                buttonType={BUTTON_TYPE_CLASSES.secondary}
                onClick={() => {
                  resetField('infoDeFidelizacion', {
                    defaultValue: { titulo: '', contenido: '' },
                  });
                }}
              >
                <Image
                  src='/images/icons/delete.png'
                  width={20}
                  height={20}
                  alt=''
                />
              </Button>
            </InputGroup>
          </FormGroup>
          <FormGroup titulo='Info de Comunicacion'>
            <InputGroup>
              <FormControl label='Titulo'>
                <input type='text' {...register('infoDeComunicacion.titulo')} />
              </FormControl>
              <FormControl label='Contenido'>
                <input
                  type='text'
                  {...register('infoDeComunicacion.contenido')}
                />
              </FormControl>
              <Button
                type='button'
                buttonType={BUTTON_TYPE_CLASSES.secondary}
                onClick={() => {
                  resetField('infoDeComunicacion', {
                    defaultValue: { titulo: '', contenido: '' },
                  });
                }}
              >
                <Image
                  src='/images/icons/delete.png'
                  width={20}
                  height={20}
                  alt=''
                />
              </Button>
            </InputGroup>
          </FormGroup>
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
                Actualizar mensajes
              </Button>
            </FormControl>
          </InputGroup>
        </form>
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

  const mensajesAsesores = await getMensajesAsesores();

  if (!session || session.user.role !== 'ADMIN') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: { session, mensajesAsesores },
  };
}
