import { useState } from 'react';
import { useFieldArray } from 'react-hook-form';

import Button from '../button';
import FormControl, { INPUT_TYPE_CLASSES } from '../forms/form-control';
import FormGroup from '../forms/form-group';
import InputGroup from '../forms/input-group';

export default function InventarioField({
  control,
  register,
  errors,
  getValues,
  setValue,
  rawSkus,
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'inventario',
  });
  const [searchValue, setSearchValue] = useState('');

  const skus = rawSkus.map((v) => ({ ...v, cajas: 0 }));

  const inventario = getValues('inventario');
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
                {!inventario.some((item) => item.producto === sku.producto) && (
                  <li key={sku.producto}>
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
            <h4 {...register(`inventario.${index}.producto`)}>
              {orden.producto}
            </h4>
            <FormControl
              label='Cajas:'
              error={errors.inventario?.[index]?.cajas?.message}
            >
              <input
                type='number'
                min={1}
                {...register(`inventario.${index}.cajas`, {
                  valueAsNumber: true,
                  required: 'Por favor llena este campo',
                })}
              />
            </FormControl>
            <Button
              type='button'
              onClick={() => {
                setValue(
                  `inventario.${index}.cajas`,
                  inventario[index].cajas + 1
                );
              }}
            >
              +
            </Button>
            <Button
              type='button'
              onClick={() => {
                if (inventario[index].cajas === 1) {
                  remove(index);
                } else {
                  setValue(
                    `inventario.${index}.cajas`,
                    inventario[index].cajas - 1
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
