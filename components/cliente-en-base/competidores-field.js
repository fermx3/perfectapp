import { useFieldArray } from 'react-hook-form';

import FormControl from '../forms/form-control';
import FormGroup from '../forms/form-group';
import Button from '../button';
import ProductosField from './productos-field';

export default function CompetidoresField({
  control,
  register,
  setValue,
  getValues,
  errors,
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'competidores',
  });

  console.log(errors);
  return (
    <>
      {fields.map((competidor, index) => (
        <FormGroup titulo={`Competidor ${index + 1}`} key={competidor.id}>
          <FormControl>
            <select
              {...register(`competidores.${index}.nombre`, {
                required: 'Por favor, selecciona un competidor.',
              })}
              required
            >
              <option value={null} selected disabled hidden>
                Nombre del competidor
              </option>
              {['Chipilo', 'Chilchota', 'Lala', 'Otra'].map((option) => (
                <option value={option} key={option}>
                  {option}
                </option>
              ))}
            </select>
          </FormControl>
          <ProductosField nestIndex={index} {...{ control, register }} />
          {index > 0 && (
            <Button
              type='button'
              onClick={() => {
                remove(index);
              }}
            >
              Quitar competidor
            </Button>
          )}
        </FormGroup>
      ))}
      <FormControl>
        <Button
          type='button'
          onClick={() => {
            append();
          }}
        >
          Agregar competidor
        </Button>
      </FormControl>
    </>
  );
}
