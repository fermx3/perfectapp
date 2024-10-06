import { Form, useForm } from 'react-hook-form';
import FormControl, { INPUT_TYPE_CLASSES } from '../forms/form-control';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';

import Button, { BUTTON_TYPE_CLASSES } from '../button';
import InfoMessage from '../ui/info-message';
import FormSection from '../forms/form-section';
import CompetidoresField from './competidores-field';

import {
  setVisitaActual,
  nextStage,
} from '@/store/visitaActual/visitaActual.reducer';
import { selectVisitaActual } from '@/store/visitaActual/visitaActual.selector';
import UploadImage from '../blob/upload-image-form';
import Modal from '../ui/modal';
import Image from 'next/image';

import classes from './cliente-en-base.module.scss';
import UploadedImagesGrid from '../blob/uploaded-images-grid';

export default function ClienteEnBase1({
  competidores,
  gramajes,
  infoDeCategoria,
  skus,
  userId,
  lealId,
}) {
  const dispatch = useDispatch();
  const visitaActual = useSelector(selectVisitaActual);

  // Format skus for easier access
  const skusFormatted = skus.reduce((acc, sku) => {
    const [nombre, gramos] = sku.producto.split(' ');
    const existingSku = acc.find((item) => item.nombre === nombre);

    if (existingSku) {
      existingSku.productos.push({
        gramos: gramos,
        precio: '',
        hasPromo: false,
        precioConPromoReason: '',
        pop: false,
      });
    } else {
      acc.push({
        nombre,
        productos: [
          {
            gramos: gramos,
            precio: '',
            hasPromo: false,
            precioConPromoReason: '',
            pop: false,
          },
        ],
      });
    }

    return acc;
  }, []);

  const numberOfSkus = skusFormatted.length;

  // Set default values for form fields based on visitaActual
  const defaultValues = {
    competidores: visitaActual.competidores || skusFormatted,
    evidenciaPrecios: visitaActual.evidenciaPrecios || null,
    comentarios1: visitaActual.comentarios1 || '',
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    control,
    getValues,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues,
    shouldUnregister: true,
  });

  // function submitHandler(event, newData) {
  //   event.preventDefault();
  //   setVisitaActual({ ...visitaActual, ...newData });

  //   if (stage >= 2) {
  //     alert('Order Sent!');
  //     const finVisita = moment().format();
  //     //Upload to DB with finVisita
  //     setStage(0);
  //     setVisitaActual({});
  //     router.replace('/');
  //   } else {
  //     setStage(stage + 1);
  //   }
  // }

  const onSubmit = (data) => {
    dispatch(setVisitaActual({ ...visitaActual, ...data }));
    dispatch(nextStage());
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormSection titulo='Assessment Producto - Empaque - Precio'>
          <CompetidoresField
            {...{
              control,
              register,
              defaultValues,
              getValues,
              setValue,
              errors,
              watch,
              setError,
            }}
            competidores={competidores}
            gramajes={gramajes}
            numberOfSkus={numberOfSkus}
            skusFormatted={skusFormatted}
          />
          <FormControl>
            <Button
              buttonType={BUTTON_TYPE_CLASSES.secondary}
              type='button'
              onClick={() => setIsModalOpen(true)}
            >
              <Image
                src='/images/icons/camera.svg'
                alt='Añadir evidencia'
                width={20}
                height={20}
              />
              Añadir evidencia de precios
            </Button>
          </FormControl>
          {visitaActual.evidenciaPrecios?.length > 0 && (
            <UploadedImagesGrid
              imagenes={visitaActual.evidenciaPrecios}
              visitaActual={visitaActual}
              field='evidenciaPrecios'
            />
          )}
        </FormSection>
        {infoDeCategoria && (
          <InfoMessage
            titulo={infoDeCategoria.titulo}
            contenido={infoDeCategoria.contenido}
          />
        )}
        <FormControl
          label='Comentarios:'
          inputType={INPUT_TYPE_CLASSES.fullWidth}
          error={errors.comentarios1?.message}
        >
          <textarea
            {...register('comentarios1', {
              required: 'Por favor ingresa un comentario.',
            })}
            rows={4}
          />
        </FormControl>
        <Button>Siguiente</Button>
      </form>
      {isModalOpen && (
        <Modal>
          <Image
            src='/images/icons/close-circle.svg'
            alt='Cerrar'
            width={20}
            height={20}
            onClick={() => setIsModalOpen(false)}
            style={{
              cursor: 'pointer',
              position: 'absolute',
              top: '1rem',
              right: '1rem',
            }}
          />
          <UploadImage
            section='visitas'
            userId={userId}
            lealId={lealId}
            visitaActual={visitaActual}
            field='evidenciaPrecios'
          />
        </Modal>
      )}
    </>
  );
}
