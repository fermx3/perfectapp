import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { zodResolver } from '@hookform/resolvers/zod';
import { clienteEnBaseSchema2 } from '@/lib/schemas/schemas';

import ReactSwitch from 'react-switch';
import InfoMessage from '../ui/info-message';
import Button from '../button';
import FormSection from '../forms/form-section';
import FormControl, { INPUT_TYPE_CLASSES } from '../forms/form-control';
import FormGroup from '../forms/form-group';
import OrdenDeCompraField from './orden-de-compra-field';
import FormError from '../ui/form-error';

import {
  setVisitaActual,
  nextStage,
} from '@/store/visitaActual/visitaActual.reducer';
import { selectVisitaActual } from '@/store/visitaActual/visitaActual.selector';
import InputGroup from '../forms/input-group';

export default function ClienteEnBase2({ prevHandler }) {
  const dispatch = useDispatch();
  const visitaActual = useSelector(selectVisitaActual);

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
    promociones: visitaActual.promociones || promociones,
    cuentaConInventario: visitaActual.cuentaConInventario || false,
    hayOrdenDeCompra: visitaActual.hayOrdenDeCompra || false,
    comentarios2: visitaActual.comentarios2 || '',
    ordenDeCompra: visitaActual.ordenDeCompra || [],
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
    name: 'promociones',
  });

  const onSubmit = (data) => {
    dispatch(setVisitaActual({ ...visitaActual, ...data }));
    dispatch(nextStage());
  };

  const hayOrden = watch('hayOrdenDeCompra');

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <InfoMessage
        titulo='Noticia importante de fidelizacion'
        contenido='Aquí va el contenido de la noticia importante.'
      />
      <FormSection titulo='Promoción del mes'>
        <InputGroup>
          {fields.map((promocion, index) => (
            <FormGroup key={promocion.id}>
              <h4 {...register(`promociones.${index}.promo`)}>
                {promocion.promo}
              </h4>
              <p>
                <span>{promocion.sku}</span>
              </p>
              <p>{promocion.desc}</p>
              <FormControl label='¿Implementada?'>
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
        </InputGroup>
      </FormSection>
      <FormSection titulo='Cuneta'>
        <FormControl label='¿Cuenta con inventario?'>
          <Controller
            name={`cuentaConInventario`}
            control={control}
            render={({ field: { onChange, value } }) => (
              <ReactSwitch checked={value} onChange={onChange} />
            )}
          />
        </FormControl>
        <FormControl label='¿Orden de compra?'>
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
      <FormControl
        label='Comentarios:'
        inputType={INPUT_TYPE_CLASSES.fullWidth}
      >
        <textarea
          {...register('comentarios2', {
            required: 'Por favor ingresa un comentario.',
          })}
          rows={4}
        />
        {errors.comentarios2 && (
          <FormError>{errors.comentarios2.message}</FormError>
        )}
      </FormControl>
      <Button type='button' onClick={prevHandler}>
        Anterior
      </Button>
      <Button type='submit'>Siguiente</Button>
    </form>
  );
}
