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
  numberOfSkus,
  skusFormatted,
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'competidores',
  });

  return (
    <>
      {fields.map((competidor, index) => (
        <FormGroup
          titulo={
            index >= numberOfSkus
              ? `Competidor ${index - numberOfSkus + 1}`
              : competidor.nombre
          }
          key={competidor.id}
        >
          {index < numberOfSkus && (
            <p
              style={{
                color: '#3171f1',
                fontSize: '0.8rem',
                marginBottom: '1rem',
              }}
            >
              En el caso de que el leal no maneje el producto llenar con 0
              (cero) en el campo precio.
            </p>
          )}
          <FormControl error={errors.competidores?.[index]?.nombre?.message}>
            <Controller
              name={`competidores.${index}.nombre`}
              control={control}
              rules={{
                required: {
                  value: true,
                  message: 'Por favor selecciona un competidor',
                },
              }}
              render={({ field: { onChange, value } }) => (
                <SelectInput
                  defaultValue='Selecciona un competidor'
                  options={competidores}
                  value={value}
                  onChange={onChange}
                  locked={index < numberOfSkus}
                />
              )}
            />
          </FormControl>
          <ProductosField
            nestIndex={index}
            {...{ control, register, getValues, watch, errors }}
            gramajes={gramajes}
            numberOfSkus={numberOfSkus}
            skusFormatted={skusFormatted}
          />
          {index > numberOfSkus - 1 && (
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
                  precioConPromoReason: '',
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
