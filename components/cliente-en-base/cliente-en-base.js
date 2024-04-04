import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import FormControl from '../forms/form-control';

import { VisitaActualContext } from '@/store/visitaActual.context';
import Button from '../button';
import InfoMessage from '../ui/info-message';
import FormSection from '../forms/form-section';
import FormGroup from '../forms/form-group';
import CompetidoresField from './competidores-field';

export default function ClienteEnBase1() {
  const { visitaActual, setVisitaActual, currentStage, nextStage } =
    useContext(VisitaActualContext);

  const defaultValues = {
    competidores: [
      {
        nombre: '',
        productos: [{ gramos: 100, precio: 0, hasPromo: false, pop: false }],
      },
    ],
    comentarios1: '',
  };

  const {
    register,
    handleSubmit,
    watch,
    control,
    getValues,
    setValue,
    errors,
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
    setVisitaActual({ ...visitaActual, ...data });
    nextStage();
  };

  console.log('visitaActual: ', visitaActual);

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
          }}
        />
      </FormSection>
      {/* <FormSection titulo='Assessment Promoción - Propuesta'>
        {competidores &&
          competidores.map((competidor) => {
            return <FormGroup titulo={competidor.nombre}></FormGroup>;
          })}
      </FormSection> */}
      <InfoMessage
        titulo='Informacion de Categoria'
        contenido='Aquí va el contenido de la noticia importante.'
      />
      <FormControl>
        <label>Comentarios:</label>
        <textarea
          {...register('comentarios1', {
            required: 'Por favor ingresa un comentario.',
          })}
          rows={4}
          required
        />
      </FormControl>

      <Button>Siguiente</Button>
    </form>
  );
}
