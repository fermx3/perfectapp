import { useFieldArray, Controller } from 'react-hook-form';

import FormControl from '../forms/form-control';
import FormGroup from '../forms/form-group';
import Button from '../button';
import ReactSwitch from 'react-switch';

export default function ImplementacionExhibicionField({
  control,
  register,
  setValue,
  getValues,
  errors,
  productos,
  periodoNegociado,
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'exhibiciones',
  });

  return (
    <>
      {fields.map((exhibicion, index) => (
        <FormGroup titulo={`Exhibición ${index + 1}`} key={exhibicion.id}>
          <FormControl
            label='Producto:'
            error={errors.exhibiciones?.[index]?.producto?.message}
          >
            <select
              {...register(`exhibiciones.${index}.producto`, {
                required: 'Por favor, selecciona una exhibición.',
              })}
            >
              <option value={null} selected disabled hidden>
                Producto
              </option>
              {productos.map((option) => (
                <option value={option} key={option}>
                  {option}
                </option>
              ))}
            </select>
          </FormControl>
          <FormControl
            label='Periodo Negociado:'
            error={errors.exhibiciones?.[index]?.periodoNegociado?.message}
          >
            <select
              {...register(`exhibiciones.${index}.periodoNegociado`, {
                required: 'Por favor, selecciona un periodo.',
              })}
            >
              <option value={null} selected disabled hidden>
                Selecciona un Periodo Negociado
              </option>
              {periodoNegociado.map((option) => (
                <option value={option} key={option}>
                  {option}
                </option>
              ))}
            </select>
          </FormControl>
          <FormControl label='PoP'>
            <Controller
              name={`exhibiciones.${index}.pop`}
              control={control}
              render={({ field: { onChange, value } }) => (
                <ReactSwitch checked={value} onChange={onChange} />
              )}
              value={false}
            />
          </FormControl>
          <Button type='button' onClick={() => remove(index)}>
            Quitar exhibición
          </Button>
        </FormGroup>
      ))}
      <Button
        type='button'
        onClick={() =>
          append({ periodoNegociado: '', pop: false, producto: '' })
        }
      >
        Agregar exhibición
      </Button>
    </>
  );
}
