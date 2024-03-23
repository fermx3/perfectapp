import { useState } from 'react';
import { useFieldArray } from 'react-hook-form';

import Button from '../button';
import FormControl from '../forms/form-control';
import FormGroup from '../forms/form-group';

export default function OrdenDeCompraField({ control, register, errors }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'ordenDeCompra',
  });
  const [value, setValue] = useState('');

  const skus = [
    {
      producto: 'Iberia 90g',
      cajas: 0,
      promocion: false,
      puntos: 1800,
      objevito: 180,
    },
    {
      producto: 'Iberia 225g',
      cajas: 0,
      promocion: false,
      puntos: 500,
      objevito: 50,
    },
    {
      producto: 'Iberia 1Kg',
      cajas: 0,
      promocion: false,
      puntos: 1000,
      objevito: 100,
    },
    {
      producto: 'Iberia 500g',
      cajas: 0,
      promocion: false,
      puntos: 400,
      objevito: 40,
    },
    {
      producto: 'Iberia 170g',
      cajas: 0,
      promocion: false,
      puntos: 350,
      objevito: 35,
    },
    {
      producto: 'Primavera 110g',
      cajas: 0,
      promocion: false,
      puntos: 350,
      objevito: 35,
    },
    {
      producto: 'Primavera 360g',
      cajas: 0,
      promocion: false,
      puntos: 150,
      objevito: 35,
    },
  ];

  return (
    <>
      <FormControl>
        <label>Nombre del cliente</label>
        <input
          type='search'
          placeholder='Busqueda por nombre'
          onChange={(event) => setValue(event.target.value)}
          value={value}
        />
      </FormControl>
      {value !== '' && (
        <ul>
          {skus
            .filter((sku) => {
              const searchTerm = value.toLowerCase();
              const producto = sku.producto.toLowerCase();
              return searchTerm && producto.includes(searchTerm);
            })
            .map((sku) => (
              <li key={sku.producto}>
                <Button>{sku.producto}</Button>
              </li>
            ))}
        </ul>
      )}
      {fields.map((orden, index) => (
        <FormGroup key={orden.id}></FormGroup>
      ))}
    </>
  );
}
