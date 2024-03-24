import { useState } from 'react';
import { useFieldArray } from 'react-hook-form';

import Button, { BUTTON_TYPE_CLASSES } from '../button';
import FormControl from '../forms/form-control';
import FormGroup from '../forms/form-group';

export default function OrdenDeCompraField({
  control,
  register,
  errors,
  getValues,
  setValue,
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'ordenDeCompra',
  });
  const [searchValue, setSearchValue] = useState('');

  const skus = [
    {
      producto: 'Iberia 90g',
      cajas: 0,
      promocion: false,
      puntos: 1800,
      objetivo: 180,
    },
    {
      producto: 'Iberia 225g',
      cajas: 0,
      promocion: false,
      puntos: 500,
      objetivo: 50,
    },
    {
      producto: 'Iberia 1Kg',
      cajas: 0,
      promocion: true,
      puntos: 1000,
      objetivo: 100,
    },
    {
      producto: 'Iberia 500g',
      cajas: 0,
      promocion: false,
      puntos: 400,
      objetivo: 40,
    },
    {
      producto: 'Iberia 170g',
      cajas: 0,
      promocion: false,
      puntos: 350,
      objetivo: 35,
    },
    {
      producto: 'Primavera 110g',
      cajas: 0,
      promocion: false,
      puntos: 350,
      objetivo: 35,
    },
    {
      producto: 'Primavera 360g',
      cajas: 0,
      promocion: false,
      puntos: 150,
      objetivo: 35,
    },
  ];

  const ordenDeCompra = getValues('ordenDeCompra');
  console.log('ordenField', ordenDeCompra);

  return (
    <>
      <FormControl>
        <label>Producto</label>
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
      {fields.map((orden, index) => (
        <FormGroup key={orden.id}>
          <h4 {...register(`ordenDeCompra.${index}.producto`)}>
            {orden.producto}
          </h4>
          <div>
            <p>Puntos:</p>
            <p>{orden.puntos}</p>
          </div>
          <div>
            <p>Objetivo:</p>
            <p>{orden.objetivo}</p>
          </div>
          <div>
            <p>Promocion???:</p>
            <p>{orden.promocion ? 'si' : 'no'}</p>
          </div>
          <FormControl>
            <label>Cajas:</label>
            <input
              type='number'
              {...register(`ordenDeCompra.${index}.cajas`, {
                valueAsNumber: true,
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
    </>
  );
}
