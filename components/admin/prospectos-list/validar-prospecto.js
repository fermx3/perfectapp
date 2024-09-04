import Button, { BUTTON_TYPE_CLASSES } from '@/components/button';
import Modal from '@/components/ui/modal';
import ModalBackground from '@/components/ui/modal-background';

import { Controller, useForm } from 'react-hook-form';

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

export default function ValidarProspecto({ prospecto, handleClose }) {
  const frecuenciasObj = frecuencias.reduce((acc, frecuencia) => {
    // frecuencia = frecuencia.toLowerCase();
    acc[frecuencia] = false;
    return acc;
  }, {});

  const defaultValues = {
    nombre: prospecto.nombre,
    canal: prospecto.canal,
    central: prospecto.central,
    ubicacion: prospecto.ubicacion,
    grupo: prospecto.grupo,
    nivelDeCliente: prospecto.nivelDeCliente,
    frecuencia: frecuenciasObj,
  };

  //   console.log(defaultValues);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues,
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <ModalBackground>
      <Modal>
        <div className={classes.container}>
          <h2>Validar: {prospecto.nombre}</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <InputGroup>
              <FormControl label='Nombre:'>
                <input
                  type='text'
                  {...register('nombre', { required: true })}
                />
              </FormControl>
            </InputGroup>
            <InputGroup>
              <FormControl label='Canal:'>
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
              <FormControl label='Central:'>
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
              <FormControl label='Ubicación:'>
                <input
                  type='text'
                  {...register('ubicacion', { required: true })}
                />
              </FormControl>
            </InputGroup>
            <InputGroup>
              <FormControl label='Grupo:'>
                <input type='text' {...register('grupo', { required: true })} />
              </FormControl>
            </InputGroup>
            <InputGroup>
              <FormControl label='Nivel de cliente:'>
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
            <InputGroup>
              <FormControl>
                <Button
                  type='button'
                  buttonType={BUTTON_TYPE_CLASSES.secondary}
                  onClick={handleClose}
                >
                  Cancelar
                </Button>
                <Button type='submit' buttonType={BUTTON_TYPE_CLASSES.primary}>
                  Validar
                </Button>
              </FormControl>
            </InputGroup>
          </form>
        </div>
      </Modal>
    </ModalBackground>
  );
}
