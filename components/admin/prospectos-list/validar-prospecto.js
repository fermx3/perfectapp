import Button, { BUTTON_TYPE_CLASSES } from '@/components/button';
import Modal from '@/components/ui/modal';
import ModalBackground from '@/components/ui/modal-background';

import { Controller, useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { validarProspectoSchema } from '@/lib/schemas/schemas';

import classes from './validar-prospecto.module.scss';
import InputGroup from '@/components/forms/input-group';
import FormControl from '@/components/forms/form-control';
import SelectInput from '@/components/forms/select-input';
import {
  canales,
  centrales,
  nivelesDeLeales,
  frecuencias,
} from '@/lib/schemas/schemas';
import ReactSwitch from 'react-switch';
import Loader from '@/components/ui/loader';
import { useRouter } from 'next/router';
import Image from 'next/image';

export default function ValidarProspecto({
  prospecto,
  handleClose,
  zonas,
  skus,
}) {
  const frecuenciasObj = frecuencias.reduce((acc, frecuencia) => {
    // frecuencia = frecuencia.toLowerCase();
    acc[frecuencia] = false;
    return acc;
  }, {});

  const router = useRouter();

  const defaultValues = {
    nombre: prospecto.nombre,
    canal: prospecto.canal,
    central: prospecto.central,
    ubicacion: prospecto.ubicacion,
    grupo: prospecto.grupo,
    nivelDeCliente: prospecto.nivelDeCliente,
    frecuencia: frecuenciasObj,
    zona: '',
    cuota: skus.reduce((acc, sku) => {
      acc[sku.sku] = 0;
      return acc;
    }, {}),
    id: prospecto._id,
  };

  // console.log(defaultValues);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues,
    resolver: zodResolver(validarProspectoSchema),
  });

  async function validarProspecto(data) {
    const response = await fetch('/api/admin/validar-prospecto', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.error.message || 'Something went wrong!');
    }

    if (responseData.errors) {
      const errors = responseData.errors;

      if (errors.nombre) {
        setError('nombre', {
          type: 'server',
          message: errors.nombre,
        });
      } else if (errors.nivelDeCliente) {
        setError('nivelDeCliente', {
          type: 'server',
          message: errors.nivelDeCliente,
        });
      } else if (errors.central) {
        setError('central', {
          type: 'server',
          message: errors.central,
        });
      } else if (errors.ubicacion) {
        setError('ubicacion', {
          type: 'server',
          message: errors.ubicacion,
        });
      } else if (errors.grupo) {
        setError('grupo', {
          type: 'server',
          message: errors.grupo,
        });
      } else if (errors.zona) {
        setError('zona', {
          type: 'server',
          message: errors.zona,
        });
      } else if (errors.frecuencia) {
        setError('frecuencia', {
          type: 'server',
          message: errors.frecuencia,
        });
      } else if (errors.cuota) {
        setError('cuota', {
          type: 'server',
          message: errors.cuota,
        });
      }
    }

    return responseData;
  }

  const onSubmit = async (data) => {
    try {
      const result = await validarProspecto(data);
      alert(result.message);
      if (result.errors) {
        throw new Error('Algo salio mal, intenta de nuevo.');
      }
      handleClose();
      router.reload();
    } catch (error) {
      console.error(error);
      // error.message ||
      alert(
        error.message ||
          'Algo salio mal, intenta de nuevo o contacta al administrador.'
      );
    }
  };

  return (
    <ModalBackground>
      <Modal>
        <div className={classes.container}>
          <h2>Validar: {prospecto.nombre}</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <InputGroup>
              <FormControl label='Nombre:' error={errors.nombre?.message}>
                <input
                  type='text'
                  {...register('nombre', { required: true })}
                />
              </FormControl>
            </InputGroup>
            <InputGroup>
              <FormControl label='Canal:' error={errors.canal?.message}>
                <Controller
                  name={'canal'}
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field: { onChange, value } }) => (
                    <SelectInput
                      defaultValue={'Selecciona un canal'}
                      options={canales}
                      value={value}
                      onChange={onChange}
                    />
                  )}
                />
              </FormControl>
            </InputGroup>
            <InputGroup>
              <FormControl label='Central:' error={errors.central?.message}>
                <Controller
                  name={'central'}
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field: { onChange, value } }) => (
                    <SelectInput
                      defaultValue={'Selecciona un CEDAS'}
                      options={centrales}
                      value={value}
                      onChange={onChange}
                    />
                  )}
                />
              </FormControl>
            </InputGroup>
            <InputGroup>
              <FormControl label='Ubicación:' error={errors.ubicacion?.message}>
                <input
                  type='text'
                  {...register('ubicacion', { required: true })}
                />
              </FormControl>
            </InputGroup>
            <InputGroup>
              <FormControl label='Grupo:' error={errors.grupo?.message}>
                <input type='text' {...register('grupo', { required: true })} />
              </FormControl>
            </InputGroup>
            <InputGroup>
              <FormControl
                label='Nivel de cliente:'
                error={errors.nivelDeCliente?.message}
              >
                <Controller
                  name={'nivelDeCliente'}
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field: { onChange, value } }) => (
                    <SelectInput
                      defaultValue={'Selecciona un nivel de cliente'}
                      options={nivelesDeLeales}
                      value={value}
                      onChange={onChange}
                    />
                  )}
                />
              </FormControl>
            </InputGroup>
            <InputGroup>
              <FormControl label='Asignar a zona:' error={errors.zona?.message}>
                <Controller
                  name={'zona'}
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field: { onChange, value } }) => (
                    <SelectInput
                      defaultValue={
                        'Selecciona una zona para asignar al prospecto'
                      }
                      options={zonas}
                      value={value}
                      onChange={onChange}
                    />
                  )}
                />
              </FormControl>
            </InputGroup>
            <h3>Dias de visita:</h3>
            <InputGroup>
              {frecuencias.map((frecuencia) => (
                <FormControl key={frecuencia} label={frecuencia}>
                  <Controller
                    name={`frecuencia.${frecuencia}`}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <ReactSwitch
                        onChange={onChange}
                        checked={value}
                        onColor='#00a8ff'
                        offColor='#d3d3d3'
                      />
                    )}
                  />
                </FormControl>
              ))}
            </InputGroup>
            <h3>Cuota del mes (en cajas):</h3>
            <InputGroup>
              {skus.map((sku) => (
                <FormControl key={sku.sku} label={sku.producto}>
                  <input
                    type='number'
                    {...register(`cuota.${sku.sku}`, { valueAsNumber: true })}
                  />
                </FormControl>
              ))}
            </InputGroup>
            <input type='hidden' {...register('id')} />
            {isSubmitting && <Loader />}
            <InputGroup className={classes.buttons}>
              <FormControl>
                <Button
                  type='button'
                  buttonType={
                    isSubmitting
                      ? BUTTON_TYPE_CLASSES.disabled
                      : BUTTON_TYPE_CLASSES.secondary
                  }
                  disabled={isSubmitting}
                  onClick={handleClose}
                >
                  Cancelar
                </Button>
                <Button
                  type='submit'
                  buttonType={
                    isSubmitting
                      ? BUTTON_TYPE_CLASSES.disabled
                      : BUTTON_TYPE_CLASSES.primary
                  }
                  disabled={isSubmitting}
                >
                  Validar
                </Button>
              </FormControl>
            </InputGroup>
          </form>
        </div>
        <Image
          className={classes.closeIcon}
          src='/images/icons/close-circle.svg'
          alt='Cerrar'
          onClick={handleClose}
          width={34}
          height={34}
        />
      </Modal>
    </ModalBackground>
  );
}
