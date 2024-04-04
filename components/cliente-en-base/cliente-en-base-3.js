import { useState, useContext } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';

import Button from '../button';
import InfoMessage from '../ui/info-message';
import FormControl from '../forms/form-control';
import FormSection from '../forms/form-section';
import FormGroup from '../forms/form-group';
import ReactSwitch from 'react-switch';

import { VisitaActualContext } from '@/store/visitaActual.context';
import ImplementacionMaterialesField from './implementacion-materiales-field';
import ImplementacionExhibicionField from './implementacion-exhibicion-field';

export default function ClienteEnBase3({ submitHandler, prevHandler }) {
  const { visitaActual, setVisitaActual, nextStage } =
    useContext(VisitaActualContext);

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

  const implementacionMateriales = [
    'Stopper',
    'Display',
    'Electro 1',
    'Electro 2',
  ];

  const productos = ['Iberia 90g', 'Iberia 1kg', 'Iberia 110g'];

  const periodoNegociado = ['1 semana', '2 semanas', '3 semanas'];

  const defaultValues = {
    planDeComunicacion: planDeComunicacion,
    materiales: [{ material: '', pop: false }],
    comentarios3: '',
  };

  const {
    register,
    handleSubmit,
    watch,
    control,
    getValues,
    setValue,
    errors,
  } = useForm({ defaultValues, shouldUnregister: true });

  const { fields } = useFieldArray({
    control,
    name: 'planDeComunicacion',
  });

  const onSubmit = (data) => {
    setVisitaActual({ ...visitaActual, ...data });
    nextStage();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <InfoMessage
        titulo='Noticia importante de comunicación'
        contenido='Aquí va el contenido de la noticia importante.'
      />
      <FormSection titulo='Plan de comunicación del mes'>
        {fields.map((item, index) => (
          <FormGroup key={item.id}>
            <h4 {...register(`planDeComunicacion.${index}.materiales`)}>
              {item.materiales}
            </h4>
            <p>{item.actividades}</p>
            <p>
              <span>{item.periodo}</span>
            </p>
            <FormControl>
              <label>Alcance</label>
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
      </FormSection>
      <FormSection titulo='Implementación'>
        <ImplementacionMaterialesField
          implementacionMateriales={implementacionMateriales}
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
          productos={productos}
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

      <FormControl>
        <label>Comentarios:</label>
        <textarea
          {...register('comentarios3', {
            required: 'Por favor ingresa un comentario.',
          })}
          rows={4}
          required
        />
      </FormControl>
      <Button type='button' onClick={prevHandler}>
        Anterior
      </Button>
      <Button type='submit'>Guardar y revisar</Button>
    </form>
  );
}
