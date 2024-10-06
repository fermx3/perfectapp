import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller, useFieldArray } from 'react-hook-form';

import Button, { BUTTON_TYPE_CLASSES } from '../button';
import InfoMessage from '../ui/info-message';
import FormControl, { INPUT_TYPE_CLASSES } from '../forms/form-control';
import FormSection from '../forms/form-section';
import FormGroup from '../forms/form-group';
import ReactSwitch from 'react-switch';
import FormError from '../ui/form-error';

import { selectVisitaActual } from '@/store/visitaActual/visitaActual.selector';
import {
  setVisitaActual,
  nextStage,
} from '@/store/visitaActual/visitaActual.reducer';

import ImplementacionMaterialesField from './implementacion-materiales-field';
import ImplementacionExhibicionField from './implementacion-exhibicion-field';
import InputGroup from '../forms/input-group';
import ButtonGroup from '../button-group';
import { useState } from 'react';
import UploadedImagesGrid from '../blob/uploaded-images-grid';
import Image from 'next/image';
import Modal from '../ui/modal';
import UploadImage from '../blob/upload-image-form';

export default function ClienteEnBase3({
  prevHandler,
  skus,
  materialesDeComunicacion,
  infoComunicacion,
  userId,
  lealId,
}) {
  const dispatch = useDispatch();
  const visitaActual = useSelector(selectVisitaActual);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const planDeComunicacion = [
    {
      materiales: 'Stopper "Hazlo con"',
      actividades: 'Colocación en anaquel',
      periodo: 'Semana 2 y 3',
      alcance: true,
    },
    {
      materiales: 'Display "Es chido ser Leal"',
      actividades: 'Colocar en Punto de Venta',
      periodo: 'Semana 4 y 5',
      alcance: true,
    },
    {
      materiales: 'Electo "Aquí somos leales"',
      actividades: 'Colocar en Punto de Venta',
      periodo: 'Semana 1 y 2',
      alcance: true,
    },
  ];

  const periodoNegociado = ['1 semana', '2 semanas', '3 semanas'];

  const defaultValues = {
    planDeComunicacion: visitaActual.planDeComunicacion || planDeComunicacion,
    materiales: visitaActual.materiales || [{ material: '', pop: false }],
    exhibiciones: visitaActual.exhibiciones || [
      { periodoNegociado: '', pop: false, producto: '' },
    ],
    comentarios3: visitaActual.comentarios3 || '',
  };

  const {
    register,
    handleSubmit,
    watch,
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues,
    shouldUnregister: true,
  });

  const { fields } = useFieldArray({
    control,
    name: 'planDeComunicacion',
  });

  const onSubmit = (data) => {
    dispatch(setVisitaActual({ ...visitaActual, ...data }));
    dispatch(nextStage());
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        {infoComunicacion && (
          <InfoMessage
            titulo={infoComunicacion.titulo}
            contenido={infoComunicacion.contenido}
          />
        )}
        <FormSection titulo='Plan de comunicación del mes'>
          <InputGroup>
            {fields.map((item, index) => (
              <FormGroup key={item.id}>
                <h4 {...register(`planDeComunicacion.${index}.materiales`)}>
                  {item.materiales}
                </h4>
                <p>{item.actividades}</p>
                <p>
                  <span>{item.periodo}</span>
                </p>
                <FormControl label='Alcance'>
                  <Controller
                    name={`planDeComunicacion.${index}.alcance`}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <ReactSwitch checked={value} onChange={onChange} />
                    )}
                  />
                </FormControl>
              </FormGroup>
            ))}
          </InputGroup>
        </FormSection>
        <FormSection titulo='Implementación'>
          <ImplementacionMaterialesField
            implementacionMateriales={materialesDeComunicacion}
            {...{
              control,
              register,
              defaultValues,
              getValues,
              setValue,
              errors,
            }}
          />
        </FormSection>
        <FormSection titulo='Implementación'>
          <ImplementacionExhibicionField
            productos={skus}
            periodoNegociado={periodoNegociado}
            {...{
              control,
              register,
              defaultValues,
              getValues,
              setValue,
              errors,
            }}
          />
        </FormSection>
        {visitaActual.evidenciaComunicacion?.length > 0 && (
          <UploadedImagesGrid
            imagenes={visitaActual.evidenciaComunicacion}
            visitaActual={visitaActual}
            field='evidenciaComunicacion'
            canDelete
          />
        )}
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
            Añadir evidencia de comunicación
          </Button>
        </FormControl>
        <FormControl
          label='Comentarios:'
          inputType={INPUT_TYPE_CLASSES.fullWidth}
        >
          <textarea
            {...register('comentarios3', {
              required: 'Por favor ingresa un comentario.',
            })}
            rows={4}
          />
          {errors.comentarios3 && (
            <FormError>{errors.comentarios3.message}</FormError>
          )}
        </FormControl>
        <ButtonGroup
          options={[
            {
              name: 'Anterior',
              onClick: prevHandler,
              type: 'button',
              buttonType: 'secondary',
            },
            { name: 'Guardar y revisar', type: 'submit' },
          ]}
        />
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
            field='evidenciaComunicacion'
            setIsModalOpen={setIsModalOpen}
          />
        </Modal>
      )}
    </>
  );
}
