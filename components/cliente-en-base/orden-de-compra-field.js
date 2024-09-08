import { useState } from 'react';
import { useFieldArray } from 'react-hook-form';

import Button from '../button';
import FormControl, { INPUT_TYPE_CLASSES } from '../forms/form-control';
import FormGroup from '../forms/form-group';
import InputGroup from '../forms/input-group';

export default function OrdenDeCompraField({
  control,
  register,
  errors,
  getValues,
  setValue,
  rawSkus,
  valorDePuntos,
  cuotaDelMes,
  promocionesDisponibles,
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'ordenDeCompra',
  });
  const [searchValue, setSearchValue] = useState('');

  const skus = rawSkus.map((v) => {
    let puntos = 0;
    let objetivo = 0;
    let promo = 'No hay promo';

    puntos = Number(valorDePuntos[v.sku]);
    objetivo = Number(cuotaDelMes[v.sku]);

    promocionesDisponibles.map(
      (promocion) => v.sku === promocion.sku && (promo = promocion.desc)
    );

    return { ...v, cajas: 0, puntos, objetivo, promo };
  });

  const ordenDeCompra = getValues('ordenDeCompra');
  return (
    <>
      <FormControl label='Producto' inputType={INPUT_TYPE_CLASSES.fullWidth}>
        <input
          type='search'
          placeholder='Busqueda por nombre de producto'
          onChange={(event) => setSearchValue(event.target.value)}
          value={searchValue}
        />
      </FormControl>
      {searchValue !== '' && (
        <ul>
          {skus
            .filter((sku) => {
              const searchTerm = searchValue.toLowerCase();
              const producto = sku.producto.toLowerCase();
              return searchTerm && producto.includes(searchTerm);
            })
            .map((sku, index) => (
              <>
                {!ordenDeCompra.some(
                  (item) => item.producto === sku.producto
                ) && (
                  <li key={sku.index}>
                    <div>
                      <p>{sku.producto}</p>
                      <Button
                        type='button'
                        onClick={() => {
                          append({ ...sku, cajas: 1 });
                        }}
                      >
                        +
                      </Button>
                    </div>
                  </li>
                )}
              </>
            ))}
        </ul>
      )}
      <InputGroup>
        {fields.map((orden, index) => (
          <FormGroup key={orden.id}>
            <h4 {...register(`ordenDeCompra.${index}.producto`)}>
              {orden.producto}
            </h4>
            <div>
              <p {...register(`ordenDeCompra.${index}.puntos`)}>
                Puntos: {orden.puntos} x caja
              </p>
            </div>
            <div>
              <p {...register(`ordenDeCompra.${index}.objetivo`)}>
                Objetivo: {orden.objetivo} pallets
              </p>
            </div>
            <div>
              <p>Promocion:</p>
              <p {...register(`ordenDeCompra.${index}.promo`)}>{orden.promo}</p>
            </div>
            <FormControl
              label='Cajas:'
              error={errors.ordenDeCompra?.[index]?.cajas?.message}
            >
              <input
                type='number'
                min={1}
                {...register(`ordenDeCompra.${index}.cajas`, {
                  valueAsNumber: true,
                  required: 'Por favor llena este campo',
                })}
              />
            </FormControl>
            <Button
              type='button'
              onClick={() => {
                setValue(
                  `ordenDeCompra.${index}.cajas`,
                  ordenDeCompra[index].cajas + 1
                );
              }}
            >
              +
            </Button>
            <Button
              type='button'
              onClick={() => {
                if (ordenDeCompra[index].cajas === 1) {
                  remove(index);
                } else {
                  setValue(
                    `ordenDeCompra.${index}.cajas`,
                    ordenDeCompra[index].cajas - 1
                  );
                }
              }}
            >
              -
            </Button>
          </FormGroup>
        ))}
      </InputGroup>
    </>
  );
}
