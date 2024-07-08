import { Controller, useFieldArray } from 'react-hook-form';

import FormControl from '../forms/form-control';
import FormGroup from '../forms/form-group';
import Button from '../button';

import { nivelesDeLeales } from '@/lib/schemas/schemas';
import ReactSwitch from 'react-switch';

export default function NivelDeClienteField({
  nestIndex,
  control,
  register,
  getValues,
  watch,
  errors,
  gramajes,
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `promociones.${nestIndex}.nivelDeCliente`,
  });

  return (
    <>
      {fields.map((nivel, k) => {
        return (
          <FormControl key={nivel.id} label={nivel.name}>
            <input
              type='hidden'
              {...register(`promociones.${nestIndex}.nivelDeCliente.${k}.name`)}
              value={nivel.name.toLowerCase()}
            />
            <Controller
              name={`promociones.${nestIndex}.nivelDeCliente.${k}.selected`}
              control={control}
              render={({ field: { onChange, value } }) => (
                <ReactSwitch checked={value} onChange={onChange} />
              )}
            />
          </FormControl>
        );
      })}
    </>
  );
}
