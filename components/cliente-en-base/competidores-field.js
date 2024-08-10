import { Controller, useFieldArray } from 'react-hook-form';

import FormControl from '../forms/form-control';
import FormGroup from '../forms/form-group';
import Button from '../button';
import ProductosField from './productos-field';
import SelectInput from '../forms/select-input';

export default function CompetidoresField({
  control,
  register,
  setValue,
  getValues,
  errors,
  watch,
  competidores,
  gramajes,
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'competidores',
  });

  return (
    <>
      {fields.map((competidor, index) => (
        <FormGroup titulo={`Competidor ${index + 1}`} key={competidor.id}>
          <FormControl error={errors.competidores?.[index]?.nombre?.message}>
            <Controller
              name={`competidores.${index}.nombre`}
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, value } }) => (
                <SelectInput
                  defaultValue='Selecciona un competidor'
                  options={competidores}
                  value={value}
                  onChange={onChange}
                />
              )}
            />
          </FormControl>
          <ProductosField
            nestIndex={index}
            {...{ control, register, getValues, watch, errors }}
            gramajes={gramajes}
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
                {
                  gramos: '',
                  precio: '',
                  hasPromo: false,
                  precioConPromoReason: 'Puntos',
                  pop: false,
                },
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
