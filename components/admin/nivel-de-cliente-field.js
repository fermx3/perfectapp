import { Controller, useFieldArray } from 'react-hook-form';

import FormControl from '../forms/form-control';
import FormGroup from '../forms/form-group';
import Button from '../button';

import { nivelesDeLeales } from '@/lib/schemas/schemas';
import ReactSwitch from 'react-switch';
import SelectInput from '../forms/select-input';

export default function NivelDeClienteField({
  nestIndex,
  control,
  register,
  getValues,
  watch,
  errors,
  gramajes,
  grupos,
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `promociones.${nestIndex}.nivelDeCliente`,
  });

  const isPlatinum = watch(
    `promociones.${nestIndex}.nivelDeCliente.0.selected`
  );

  return (
    <>
      {fields.map((nivel, k) => {
        return (
          <FormControl key={nivel.id} label={nivel.name}>
            <input
              type='hidden'
              {...register(`promociones.${nestIndex}.nivelDeCliente.${k}.name`)}
              value={nivel.name?.toLowerCase()}
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
      {isPlatinum && (
        <FormControl
          label='Selecciona un grupo'
          error={errors.promociones?.[nestIndex]?.grupo?.message}
        >
          <Controller
            name={`promociones.${nestIndex}.grupo`}
            control={control}
            rules={{
              required: {
                value: true,
                message: 'Debes seleccionar un grupo',
              },
            }}
            render={({ field: { onChange, value } }) => (
              <SelectInput
                defaultValue={'Selecciona un grupo'}
                options={grupos}
                value={value}
                onChange={onChange}
              />
            )}
          />
        </FormControl>
      )}
    </>
  );
}
