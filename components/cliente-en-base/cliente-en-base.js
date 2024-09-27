import { useForm } from 'react-hook-form';
import FormControl, { INPUT_TYPE_CLASSES } from '../forms/form-control';
import { useDispatch, useSelector } from 'react-redux';

import Button from '../button';
import InfoMessage from '../ui/info-message';
import FormSection from '../forms/form-section';
import CompetidoresField from './competidores-field';

import {
  setVisitaActual,
  nextStage,
} from '@/store/visitaActual/visitaActual.reducer';
import { selectVisitaActual } from '@/store/visitaActual/visitaActual.selector';

export default function ClienteEnBase1({
  competidores,
  gramajes,
  infoDeCategoria,
  skus,
}) {
  const dispatch = useDispatch();
  const visitaActual = useSelector(selectVisitaActual);

  // Format skus for easier access
  const skusFormatted = skus.reduce((acc, sku) => {
    const [nombre, gramos] = sku.producto.split(' ');
    const existingSku = acc.find((item) => item.nombre === nombre);

    if (existingSku) {
      existingSku.productos.push({
        gramos: gramos,
        precio: '',
        hasPromo: false,
        precioConPromoReason: '',
        pop: false,
      });
    } else {
      acc.push({
        nombre,
        productos: [
          {
            gramos: gramos,
            precio: '',
            hasPromo: false,
            precioConPromoReason: '',
            pop: false,
          },
        ],
      });
    }

    return acc;
  }, []);

  const numberOfSkus = skusFormatted.length;

  // Set default values for form fields based on visitaActual
  const defaultValues = {
    competidores: visitaActual.competidores || skusFormatted,
    comentarios1: visitaActual.comentarios1 || '',
  };

  // // Add empty competidor if there are none in defaultValues
  // if (defaultValues.competidores.length === 0) {
  //   defaultValues.competidores[numberOfSkus] = {
  //     nombre: '',
  //     productos: [
  //       {
  //         gramos: '',
  //         precio: '',
  //         hasPromo: false,
  //         precioConPromoReason: '',
  //         pop: false,
  //       },
  //     ],
  //   };
  // }

  const {
    register,
    handleSubmit,
    watch,
    control,
    getValues,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues,
    shouldUnregister: true,
  });

  // function submitHandler(event, newData) {
  //   event.preventDefault();
  //   setVisitaActual({ ...visitaActual, ...newData });

  //   if (stage >= 2) {
  //     alert('Order Sent!');
  //     const finVisita = moment().format();
  //     //Upload to DB with finVisita
  //     setStage(0);
  //     setVisitaActual({});
  //     router.replace('/');
  //   } else {
  //     setStage(stage + 1);
  //   }
  // }

  const onSubmit = (data) => {
    dispatch(setVisitaActual({ ...visitaActual, ...data }));
    dispatch(nextStage());
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormSection titulo='Assessment Producto - Empaque - Precio'>
        <CompetidoresField
          {...{
            control,
            register,
            defaultValues,
            getValues,
            setValue,
            errors,
            watch,
            setError,
          }}
          competidores={competidores}
          gramajes={gramajes}
          numberOfSkus={numberOfSkus}
          skusFormatted={skusFormatted}
        />
      </FormSection>
      {infoDeCategoria && (
        <InfoMessage
          titulo={infoDeCategoria.titulo}
          contenido={infoDeCategoria.contenido}
        />
      )}
      <FormControl
        label='Comentarios:'
        inputType={INPUT_TYPE_CLASSES.fullWidth}
        error={errors.comentarios1?.message}
      >
        <textarea
          {...register('comentarios1', {
            required: 'Por favor ingresa un comentario.',
          })}
          rows={4}
        />
      </FormControl>
      <Button>Siguiente</Button>
    </form>
  );
}
