import { useFieldArray, Controller } from 'react-hook-form';

import FormControl from '../forms/form-control';
import FormGroup from '../forms/form-group';
import Button from '../button';
import ReactSwitch from 'react-switch';

export default function ImplementacionMaterialesField({
  control,
  register,
  setValue,
  getValues,
  errors,
  implementacionMateriales,
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'materiales',
  });

  return (
    <>
      {fields.map((material, index) => (
        <FormGroup titulo={`Material ${index + 1}`} key={material.id}>
          <FormControl error={errors.materiales?.[index]?.material?.message}>
            <select
              {...register(`materiales.${index}.material`, {
                required: 'Por favor, selecciona un material.',
              })}
            >
              <option value={null} selected disabled hidden>
                Nombre del material
              </option>
              {implementacionMateriales.map((option) => (
                <option value={option} key={option}>
                  {option}
                </option>
              ))}
            </select>
          </FormControl>
          <FormControl label='Pop'>
            <Controller
              name={`materiales.${index}.pop`}
              control={control}
              render={({ field: { onChange, value } }) => (
                <ReactSwitch checked={value} onChange={onChange} />
              )}
              value={false}
            />
          </FormControl>
          <Button type='button' onClick={() => remove(index)}>
            Quitar material
          </Button>
        </FormGroup>
      ))}
      <Button
        type='button'
        onClick={() => append({ material: '', pop: false })}
      >
        Agregar material
      </Button>
    </>
  );
}
