import { useFieldArray, Controller } from 'react-hook-form';

import FormControl from '../forms/form-control';
import Button from '../button';
import ReactSwitch from 'react-switch';

export default function ProductosField({
  nestIndex,
  control,
  register,
  getValues,
}) {
  const { fields, remove, append } = useFieldArray({
    control,
    name: `competidores.${nestIndex}.productos`,
  });

  const competidor = getValues(`competidores.${nestIndex}`);

  return (
    <>
      {fields.map((producto, k) => {
        return (
          <div key={producto.id}>
            <h5>Producto {k + 1}</h5>
            <FormControl>
              <label>Gramos</label>
              <input
                type='number'
                {...register(
                  `competidores.${nestIndex}.productos.${k}.gramos`,
                  { required: 'Este campo es requerido', valueAsNumber: true }
                )}
                required
              />
            </FormControl>
            <FormControl>
              <label>Precio</label>
              <input
                type='number'
                {...register(
                  `competidores.${nestIndex}.productos.${k}.precio`,
                  { required: 'Este campo es requerido', valueAsNumber: true }
                )}
                required
              />
            </FormControl>
            <FormControl>
              <label>¿Tiene descuento?</label>
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
                <FormControl>
                  <label>Precio Con Promo</label>
                  <input
                    type='number'
                    {...register(
                      `competidores.${nestIndex}.productos.${k}.precioConPromo`,
                      { valueAsNumber: true }
                    )}
                  />
                </FormControl>
                <FormControl>
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
                Quitar Producto
              </Button>
            )}
          </div>
        );
      })}
      <FormControl>
        <Button type='button' onClick={() => append()}>
          Agregar Producto
        </Button>
      </FormControl>
    </>
  );
}
