import { useContext } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';

import ReactSwitch from 'react-switch';
import InfoMessage from '../ui/info-message';
import Button from '../button';
import FormSection from '../forms/form-section';
import FormControl from '../forms/form-control';
import FormGroup from '../forms/form-group';
import OrdenDeCompraField from './orden-de-compra-field';

import { VisitaActualContext } from '@/store/visitaActual.context';

export default function ClienteEnBase2({ prevHandler }) {
  const { visitaActual, setVisitaActual, currentStage, nextStage } =
    useContext(VisitaActualContext);

  const promociones = [
    {
      promo: '10 cajas + 1 caja Iberia 90g',
      sku: 'Iberia 90g',
      desc: 'Compra 10 cajas + 1 caja de regalo',
      implementada: false,
    },
    {
      promo: '-3% descuento Iberia 1Kg',
      sku: 'Iberia 1Kg',
      desc: '3% descuento en 25 cajas acumuladas',
      implementada: false,
    },
    {
      promo: 'Plan de Fidelización',
      sku: 'Total portafolio',
      desc: 'Posibilidad puntos leales 35000',
      implementada: true,
    },
    {
      promo: 'Kit Sell Out',
      sku: 'Total portafolio',
      desc: 'Cuota para lograr Kit',
      implementada: false,
    },
  ];

  const defaultValues = {
    promociones: promociones,
    cuentaConInventario: false,
    hayOrdenDeCompra: false,
    comentarios2: '',
    ordenDeCompra: [],
  };

  const {
    register,
    handleSubmit,
    watch,
    control,
    getValues,
    setValue,
    errors,
  } = useForm({
    defaultValues,
    shouldUnregister: true,
  });

  const { fields } = useFieldArray({
    control,
    name: 'promociones',
  });

  const onSubmit = (data) => {
    setVisitaActual({ ...visitaActual, ...data });
    nextStage();
  };

  const hayOrden = watch('hayOrdenDeCompra');

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <InfoMessage
        titulo='Noticia importante de fidelizacion'
        contenido='Aquí va el contenido de la noticia importante.'
      />
      <FormSection titulo='Promoción del mes'>
        {fields.map((promocion, index) => (
          <FormGroup key={promocion.id}>
            <h4 {...register(`promociones.${index}.promo`)}>
              {promocion.promo}
            </h4>
            <p>
              <span>{promocion.sku}</span>
            </p>
            <p>{promocion.desc}</p>
            <FormControl>
              <label>¿Implementada?</label>
              <Controller
                name={`promociones.${index}.implementada`}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <ReactSwitch checked={value} onChange={onChange} />
                )}
              />
            </FormControl>
          </FormGroup>
        ))}
      </FormSection>
      <FormSection titulo='Cuneta'>
        <FormControl>
          <label>¿Cuenta con inventario?</label>
          <Controller
            name={`cuentaConInventario`}
            control={control}
            render={({ field: { onChange, value } }) => (
              <ReactSwitch checked={value} onChange={onChange} />
            )}
          />
        </FormControl>
        <FormControl>
          <label>¿Orden de compra?</label>
          <Controller
            name={`hayOrdenDeCompra`}
            control={control}
            render={({ field: { onChange, value } }) => (
              <ReactSwitch checked={value} onChange={onChange} />
            )}
          />
        </FormControl>
        {hayOrden && (
          <OrdenDeCompraField
            {...{
              control,
              register,
              defaultValues,
              errors,
              getValues,
              setValue,
            }}
          />
        )}
      </FormSection>
      <FormControl>
        <label>Comentarios:</label>
        <textarea
          {...register('comentarios2', {
            required: 'Por favor ingresa un comentario.',
          })}
          rows={4}
          required
        />
      </FormControl>
      <Button type='button' onClick={prevHandler}>
        Anterior
      </Button>
      <Button type='submit'>Siguiente</Button>
    </form>
  );
}
