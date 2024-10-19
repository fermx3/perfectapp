import { getSession } from 'next-auth/react';
import { Form, useFieldArray, useForm } from 'react-hook-form';

import BackgroundGradientContainer from '@/components/layout/background-gradient-container';
import Container from '@/components/layout/container';
import { getBannersLeales } from '@/lib/db';
import FormControl from '@/components/forms/form-control';
import InputGroup from '@/components/forms/input-group';
import FormGroup from '@/components/forms/form-group';
import Image from 'next/image';

import classes from './index.module.scss';
import Button, { BUTTON_TYPE_CLASSES } from '@/components/button';
import ButtonGroup from '@/components/button-group';
import Loader from '@/components/ui/loader';
import { useState } from 'react';
import Modal from '@/components/ui/modal';
import UploadImage from '@/components/blob/upload-image-form';
import ImagePicker from '@/components/forms/image-pícker';
import { actualizarBannersSchema } from '@/lib/schemas/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import FormError from '@/components/ui/form-error';

export default function BannersLealesPage({ bannersLeales }) {
  const [blob, setBlob] = useState(null);

  const defaultValues = { bannersLeales: bannersLeales };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitted },
    reset,
    resetField,
    setError,
    setValue,
    control,
    watch,
  } = useForm({
    defaultValues,
    resolver: zodResolver(actualizarBannersSchema),
  });

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'bannersLeales',
  });

  const bannersLealesWatch = watch('bannersLeales');

  const onSubmit = async (data) => {
    console.log('data', data);

    const response = await fetch('/api/admin/actualizar-banners', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const responseData = await response.json();

    alert(responseData.message);

    if (!response.ok) {
      throw new Error(responseData.error.message || 'Something went wrong!');
    }

    if (responseData.errors) {
      responseData.errors.forEach((error) => {
        setError(error.name, { type: 'manual', message: error.message });
      });
    }
  };

  async function handleDelete(index) {
    const bannerUrl = bannersLealesWatch[index].src;
    // Delete the image from the server
    const response = await fetch(`/api/images/delete?url=${bannerUrl}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      console.error('Error deleting image');
      return;
    } else {
      // Update the state
      setBlob(null);
      setValue(`bannersLeales[${index}].src`, '');
    }
  }

  console.log('errors', errors);

  return (
    <BackgroundGradientContainer>
      <Container>
        <header>
          <h1>Banners Leales</h1>
          <p>Aquí puedes agregar, editar o eliminar banners de leales.</p>
        </header>
        <main>
          <form onSubmit={handleSubmit(onSubmit)}>
            {fields.map((banner, index) => (
              <FormGroup key={index} locked={banner.locked ? true : null}>
                {banner.locked && (
                  <Image
                    src='/images/icons/locked.svg'
                    alt='Bloqueado'
                    width={30}
                    height={30}
                    className={classes.lockedIcon}
                  />
                )}
                {bannersLealesWatch[index].src && !banner.locked && (
                  <Image
                    src='/images/icons/delete.png'
                    alt='Banner'
                    width={30}
                    height={30}
                    className={classes.deleteIcon}
                    onClick={() => handleDelete(index)}
                  />
                )}
                <InputGroup>
                  <div className={classes.image}>
                    {bannersLealesWatch[index].src ? (
                      <Image
                        src={bannersLealesWatch[index].src}
                        fill
                        alt={banner.alt}
                      />
                    ) : (
                      <ImagePicker
                        name='bannerImage'
                        index={index}
                        setValue={setValue}
                        blob={blob}
                        setBlob={setBlob}
                        label='Sube una imagen JPEG o PNG. Tamaño recomendado: 1200 x 460'
                      />
                    )}
                  </div>
                  {errors.bannersLeales?.[index]?.src && (
                    <FormError>
                      {errors.bannersLeales?.[index]?.src?.message}
                    </FormError>
                  )}
                  <FormControl
                    label='Título:'
                    error={errors.bannersLeales?.[index]?.titulo?.message}
                  >
                    <input
                      type='text'
                      {...register(`bannersLeales.${index}.titulo`)}
                      placeholder='Nombre del banner'
                      readOnly={banner.locked ? true : false}
                    />
                  </FormControl>
                  <FormControl
                    label='URL:'
                    error={errors.bannersLeales?.[index]?.url?.message}
                  >
                    <input
                      type='text'
                      {...register(`bannersLeales.${index}.url`)}
                      placeholder='Dejar en blanco para que el banner no sea clickeable'
                      readOnly={banner.locked ? true : false}
                    />
                  </FormControl>
                </InputGroup>
                <InputGroup>
                  <FormControl
                    label='Descripción corta:'
                    error={errors.bannersLeales?.[index]?.alt?.message}
                  >
                    <input
                      type='text'
                      {...register(`bannersLeales.${index}.alt`)}
                      placeholder='Descripción del banner'
                      readOnly={banner.locked ? true : false}
                    />
                  </FormControl>
                </InputGroup>
                <Button
                  type='button'
                  buttonType={
                    banner.locked
                      ? BUTTON_TYPE_CLASSES.disabled
                      : BUTTON_TYPE_CLASSES.secondary
                  }
                  onClick={() => remove(index)}
                >
                  <Image
                    src='/images/icons/delete.png'
                    width={24}
                    height={24}
                    alt='Eliminar'
                  />
                  Eliminar
                </Button>
              </FormGroup>
            ))}
            <ButtonGroup
              options={[
                {
                  name: 'Agregar',
                  onClick: () =>
                    append({ src: '', _id: '', url: '', alt: '', titulo: '' }),
                  type: 'button',
                  buttonType: 'secondary',
                },
                { name: 'Guardar', type: 'submit' },
              ]}
            />
            {isSubmitting && <Loader />}
          </form>
        </main>
      </Container>
      {isSubmitting && <Loader />}
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
  const bannersLeales = await getBannersLeales(empresa);

  return {
    props: { session, bannersLeales },
  };
}
