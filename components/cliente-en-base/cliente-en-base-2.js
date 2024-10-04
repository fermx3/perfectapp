import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import ReactSwitch from 'react-switch';
import InfoMessage from '../ui/info-message';
import Button from '../button';
import FormSection from '../forms/form-section';
import FormControl, { INPUT_TYPE_CLASSES } from '../forms/form-control';
import FormGroup from '../forms/form-group';
import OrdenDeCompraField from './orden-de-compra-field';

import {
  setVisitaActual,
  nextStage,
} from '@/store/visitaActual/visitaActual.reducer';
import { selectVisitaActual } from '@/store/visitaActual/visitaActual.selector';
import InputGroup from '../forms/input-group';
import InventarioField from './inventario-field';
import ButtonGroup from '../button-group';
import SelectInput from '../forms/select-input';

export default function ClienteEnBase2({
  prevHandler,
  opcionesDeNoCompra,
  distribuidores,
  infoFidelizacion,
  skus,
  valorDePuntos,
  cuotaDelMes,
  promocionesDisponibles,
}) {
  const dispatch = useDispatch();
  const visitaActual = useSelector(selectVisitaActual);

  const promocionesObj = promocionesDisponibles.reduce(
    (a, i) => [
      ...a,
      { promo: i.desc, sku: i.sku, grupo: i.grupo, implementada: false },
    ],
    []
  );

  const defaultValues = {
    promociones: visitaActual.promociones || promocionesObj,
    cuentaConInventario: visitaActual.cuentaConInventario || false,
    inventario: visitaActual.inventario || [],
    hayOrdenDeCompra: visitaActual.hayOrdenDeCompra || false,
    porqueNoCompra: visitaActual.porqueNoCompra || '',
    comentarios2: visitaActual.comentarios2 || '',
    ordenDeCompra: visitaActual.ordenDeCompra || [],
    distribuidor: visitaActual.distribuidor || '',
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
  const hayInventario = watch('cuentaConInventario');

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {infoFidelizacion && (
        <InfoMessage
          titulo={infoFidelizacion.titulo}
          contenido={infoFidelizacion.contenido}
        />
      )}
      <FormSection titulo='Promoción del mes'>
        <InputGroup>
          {fields.map((promocion, index) => (
            <FormGroup key={promocion.id}>
              <h4 {...register(`promociones.${index}.promo`)}>
                {promocion.promo}
              </h4>
              <p>
                <span {...register(`promociones.${index}.sku`)}>
                  sku: {promocion.sku}
                </span>
              </p>
              {promocion.grupo && (
                <p>
                  <span {...register(`promociones.${index}.grupo`)}>
                    grupo: {promocion.grupo}
                  </span>
                </p>
              )}
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
        {hayInventario && (
          <InventarioField
            {...{
              control,
              register,
              defaultValues,
              errors,
              getValues,
              setValue,
            }}
            rawSkus={skus}
          />
        )}
        <FormControl label='¿Orden de compra?'>
          <Controller
            name={`hayOrdenDeCompra`}
            control={control}
            render={({ field: { onChange, value } }) => (
              <ReactSwitch checked={value} onChange={onChange} />
            )}
          />
        </FormControl>
        {!hayOrden && (
          <FormControl error={errors.porqueNoCompra?.message}>
            <Controller
              name={`porqueNoCompra`}
              control={control}
              rules={{
                required: {
                  value: true,
                  message: 'Por favor escribe una razón por la que no compra.',
                },
              }}
              render={({ field: { onChange, value } }) => (
                <SelectInput
                  defaultValue='Selecciona una opción.'
                  options={opcionesDeNoCompra}
                  value={value}
                  onChange={onChange}
                />
              )}
            />
          </FormControl>
        )}
        {hayOrden && (
          <>
            <FormControl
              label='Distribuidor:'
              error={errors.distribuidor?.message}
            >
              <select
                {...register('distribuidor', {
                  required: 'Por favor selecciona un distribuidor.',
                })}
                placeholder='Distribuidor'
              >
                {distribuidores.map((option) => (
                  <option value={option} key={option}>
                    {option}
                  </option>
                ))}
              </select>
            </FormControl>
            <OrdenDeCompraField
              {...{
                control,
                register,
                defaultValues,
                errors,
                getValues,
                setValue,
              }}
              rawSkus={skus}
              valorDePuntos={valorDePuntos}
              cuotaDelMes={cuotaDelMes}
              promocionesDisponibles={promocionesDisponibles}
            />
          </>
        )}
      </FormSection>
      <FormControl
        label='Comentarios:'
        inputType={INPUT_TYPE_CLASSES.fullWidth}
        error={errors.comentarios2?.message}
      >
        <textarea
          {...register('comentarios2', {
            required: 'Por favor ingresa un comentario.',
          })}
          rows={4}
        />
      </FormControl>
      <ButtonGroup
        options={[
          {
            name: 'Anterior',
            onClick: prevHandler,
            type: 'button',
            buttonType: 'secondary',
          },
          { name: 'Siguiente', type: 'submit' },
        ]}
      />
    </form>
  );
}
