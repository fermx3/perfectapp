import { useFieldArray, Controller } from 'react-hook-form';
import Image from 'next/image';

import FormControl, { INPUT_TYPE_CLASSES } from '../forms/form-control';
import Button from '../button';
import ReactSwitch from 'react-switch';
import InputGroup from '../forms/input-group';
import SelectInput from '../forms/select-input';

const razonesDePromo = [
  'Mayor gramaje',
  'Cruce categoria',
  'Regalo en compra',
  'Puntos',
  'Participa',
];

export default function ProductosField({
  nestIndex,
  control,
  register,
  getValues,
  watch,
  errors,
  gramajes,
  skusFormatted,
  numberOfSkus,
}) {
  const { fields, remove, append } = useFieldArray({
    control,
    name: `competidores.${nestIndex}.productos`,
  });

  const numberOfGrams =
    nestIndex < numberOfSkus
      ? skusFormatted.find(
          (sku) => sku.nombre === getValues(`competidores.${nestIndex}.nombre`)
        )?.productos?.length
      : 0;

  const competidor = watch(`competidores.${nestIndex}`);

  return (
    <>
      {fields.map((producto, k) => {
        return (
          <InputGroup key={producto.id}>
            <h5>Producto {k + 1}</h5>
            <FormControl
              label='Gramos'
              error={
                errors.competidores?.[nestIndex]?.productos?.[k]?.gramos
                  ?.message
              }
            >
              <Controller
                name={`competidores.${nestIndex}.productos.${k}.gramos`}
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: 'Por favor selecciona un gramaje',
                  },
                }}
                render={({ field: { onChange, value } }) => (
                  <SelectInput
                    defaultValue='Selecciona un gramaje'
                    options={gramajes}
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
            </FormControl>
            <FormControl
              prefix='$'
              label='Precio'
              error={
                errors.competidores?.[nestIndex]?.productos?.[k]?.precio
                  ?.message
              }
            >
              <input
                type='number'
                min={0}
                step={0.01}
                {...register(
                  `competidores.${nestIndex}.productos.${k}.precio`,
                  {
                    required: 'Por favor llena este campo',
                    valueAsNumber: true,
                  },
                  {
                    min: {
                      value: 0.1,
                      message: 'El valor debe ser igual o mayor a 0.1',
                    },
                  }
                )}
              />
            </FormControl>
            <FormControl
              inputType={INPUT_TYPE_CLASSES.fullWidth}
              label='¿Tiene descuento?'
            >
              <Controller
                name={`competidores.${nestIndex}.productos.${k}.hasPromo`}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <ReactSwitch checked={value} onChange={onChange} />
                )}
              />
            </FormControl>
            {competidor.productos[k].hasPromo && (
              <>
                <FormControl
                  prefix='$'
                  label='Precio Con Promo'
                  error={
                    errors.competidores?.[nestIndex]?.productos?.[k]
                      ?.precioConPromo?.message
                  }
                >
                  <input
                    type='number'
                    min={0}
                    step={0.01}
                    {...register(
                      `competidores.${nestIndex}.productos.${k}.precioConPromo`,
                      {
                        required: 'Por favor llena este campo',
                        min: {
                          value: 0.1,
                          message: 'El valor debe ser igual o mayor a 0.1',
                        },
                        valueAsNumber: true,
                      }
                    )}
                  />
                </FormControl>
                <FormControl
                  label='Razón de promo'
                  error={
                    errors.competidores?.[nestIndex]?.productos?.[k]
                      ?.precioConPromoReason?.message
                  }
                >
                  <Controller
                    name={`competidores.${nestIndex}.productos.${k}.precioConPromoReason`}
                    control={control}
                    rules={{
                      // required: true,
                      validate: (value) =>
                        value !== '' || 'Por favor selecciona una razón',
                    }}
                    render={({ field: { onChange, value } }) => (
                      <SelectInput
                        defaultValue='Selecciona una razón'
                        options={razonesDePromo}
                        value={value}
                        onChange={onChange}
                      />
                    )}
                  />
                </FormControl>
                <FormControl>
                  <label>PoP</label>
                  <Controller
                    name={`competidores.${nestIndex}.productos.${k}.pop`}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <ReactSwitch checked={value} onChange={onChange} />
                    )}
                  />
                </FormControl>
              </>
            )}
            {k > numberOfGrams - 1 && (
              <Button type='button' onClick={() => remove(k)}>
                <Image
                  src='/images/icons/delete.png'
                  width={20}
                  height={20}
                  alt=''
                />
              </Button>
            )}
          </InputGroup>
        );
      })}
      <FormControl>
        <Button
          type='button'
          onClick={() =>
            append({
              gramos: '',
              precio: '',
              hasPromo: false,
              precioConPromoReason: '',
              pop: false,
            })
          }
        >
          Agregar Producto
        </Button>
      </FormControl>
    </>
  );
}
