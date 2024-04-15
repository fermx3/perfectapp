import { useFieldArray } from 'react-hook-form';

import FormControl from '../forms/form-control';
import FormGroup from '../forms/form-group';
import Button from '../button';
import ProductosField from './productos-field';
import FormError from '../ui/form-error';
import { competidores } from '@/lib/schemas/schemas';

export default function CompetidoresField({
  control,
  register,
  setValue,
  getValues,
  errors,
  watch,
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'competidores',
  });

  return (
    <>
      {fields.map((competidor, index) => (
        <FormGroup titulo={`Competidor ${index + 1}`} key={competidor.id}>
          <FormControl>
            <select
              {...register(`competidores.${index}.nombre`, {
                required: 'Por favor completa este campo',
              })}
            >
              <option value={null} selected disabled hidden>
                Nombre del competidor
              </option>
              {competidores.map((option) => (
                <option value={option} key={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.competidores?.[index]?.nombre && (
              <FormError>{errors.competidores[index].nombre.message}</FormError>
            )}
          </FormControl>
          <ProductosField
            nestIndex={index}
            {...{ control, register, getValues, watch, errors }}
          />
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
            append({
              nombre: '',
              productos: [
                { gramos: '', precio: '', hasPromo: false, pop: false },
              ],
            });
          }}
        >
          Agregar competidor
        </Button>
      </FormControl>
    </>
  );
}
