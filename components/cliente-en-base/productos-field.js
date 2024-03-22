import { useFieldArray } from 'react-hook-form';

import FormControl from '../forms/form-control';
import Button from '../button';

export default function ProductosField({ nestIndex, control, register }) {
  const { fields, remove, append } = useFieldArray({
    control,
    name: `competidores.${nestIndex}.productos`,
  });
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
              <label>Precio Con Promo (opcional)</label>
              <input
                type='number'
                {...register(
                  `competidores.${nestIndex}.productos.${k}.precioConPromo`,
                  { valueAsNumber: true }
                )}
              />
            </FormControl>
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
