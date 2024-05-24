import { useFieldArray, Controller } from 'react-hook-form';
import Image from 'next/image';

import FormControl, { INPUT_TYPE_CLASSES } from '../forms/form-control';
import Button from '../button';
import ReactSwitch from 'react-switch';
import InputGroup from '../forms/input-group';

export default function ProductosField({
  nestIndex,
  control,
  register,
  getValues,
  watch,
  errors,
  gramajes,
}) {
  const { fields, remove, append } = useFieldArray({
    control,
    name: `competidores.${nestIndex}.productos`,
  });

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
              <select
                {...register(
                  `competidores.${nestIndex}.productos.${k}.gramos`,
                  {
                    required: 'Por favor completa este campo',
                  }
                )}
              >
                <option value={null} selected disabled hidden>
                  Nombre del competidor
                </option>
                {gramajes.map((option) => (
                  <option value={option} key={option}>
                    {option}
                  </option>
                ))}
              </select>
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
                {...register(
                  `competidores.${nestIndex}.productos.${k}.precio`,
                  {
                    required: 'Por favor llena este campo',
                    min: {
                      value: 1,
                      message: 'El valor debe ser igual o mayor a 1',
                    },
                    valueAsNumber: true,
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
                      ?.precioConPromo.message
                  }
                >
                  <input
                    type='number'
                    min={0}
                    {...register(
                      `competidores.${nestIndex}.productos.${k}.precioConPromo`,
                      {
                        required: 'Por favor llena este campo',
                        min: {
                          value: 1,
                          message: 'El valor debe ser igual o mayor a 1',
                        },
                        valueAsNumber: true,
                      }
                    )}
                  />
                </FormControl>
                <FormControl label='Razón de promo'>
                  <select
                    {...register(
                      `competidores.${nestIndex}.productos.${k}.precioConPromoReason`
                    )}
                  >
                    {[
                      'Mayor gramaje',
                      'Cruce categoria',
                      'Regalo en compra',
                      'Puntos',
                      'Participa',
                    ].map((option) => (
                      <option value={option} key={option}>
                        {option}
                      </option>
                    ))}
                  </select>
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
            {k > 0 && (
              <Button type='button' onClick={() => remove(k)}>
                <Image src='/images/icons/delete.png' width={20} height={20} />
              </Button>
            )}
          </InputGroup>
        );
      })}
      <FormControl>
        <Button
          type='button'
          onClick={() =>
            append({ gramos: '', precio: '', hasPromo: false, pop: false })
          }
        >
          Agregar Producto
        </Button>
      </FormControl>
    </>
  );
}
