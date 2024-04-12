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
import FormError from '../ui/form-error';

export default function ClienteEnBase1() {
  const dispatch = useDispatch();
  const visitaActual = useSelector(selectVisitaActual);

  const defaultValues = {
    competidores: visitaActual.competidores || [
      {
        nombre: '',
        productos: [{ gramos: '', precio: '', hasPromo: false, pop: false }],
      },
    ],
    comentarios1: visitaActual.comentarios1 || '',
  };

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
        />
      </FormSection>
      <InfoMessage
        titulo='Informacion de Categoria'
        contenido='Aquí va el contenido de la noticia importante.'
      />
      <FormControl inputType={INPUT_TYPE_CLASSES.fullWidth}>
        <label>Comentarios:</label>
        <textarea
          {...register('comentarios1', {
            required: 'Por favor ingresa un comentario.',
          })}
          rows={4}
        />
      </FormControl>
      {errors.comentarios1 && (
        <FormError>{errors.comentarios1.message}</FormError>
      )}
      <Button>Siguiente</Button>
    </form>
  );
}
