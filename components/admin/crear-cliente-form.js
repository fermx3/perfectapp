import { useForm } from 'react-hook-form';

import FormControl from '../forms/form-control';
import Button, { BUTTON_TYPE_CLASSES } from '../button';

async function createCliente(userId, password, nivelDeCliente, nombre, role) {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({
      userId,
      password,
      nivelDeCliente,
      nombre,
      role,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong!');
  }

  return data;
}

export default function CrearClienteForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    getValues,
  } = useForm({
    defaultValues: {
      userId: '',
      password: '',
      confirmPassword: '',
      nivelDeCliente: '',
      nombre: '',
    },
  });

  const tiposDeClientes = ['Básico', 'Oro', 'Platino'];

  const onSubmit = async (data) => {
    // submit to server
    try {
      const result = await createCliente(
        data.userId,
        data.password,
        data.nivelDeCliente,
        data.nombre,
        'LEAL'
      );
      console.log(result); //Successfuly create user
    } catch (error) {
      console.log(error); //Fail on create user
    }

    reset();
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl>
          <input
            type='number'
            {...register('userId', {
              required: 'Por favor introduce un numero de cliente.',
              minLength: {
                value: 5,
                message:
                  'El numero de usuario debe ser de al menos 5 caracteres.',
              },
            })}
            placeholder='Numero de cliente'
          />
          {errors.userId && <p>{errors.userId.message}</p>}
        </FormControl>
        <FormControl>
          <input
            type='text'
            {...register('password', {
              required: 'Por favor introduce una contraseña.',
              minLength: {
                value: 8,
                message: 'La contraseña debe ser de al menos 8 caracteres.',
              },
            })}
            placeholder='Contraseña'
          />
          {errors.password && <p>{errors.password.message}</p>}
        </FormControl>
        <FormControl>
          <input
            type='password'
            {...register('confirmPassword', {
              required: 'Por favor confirma la contraseña.',
              validate: (value) =>
                value === getValues('password') ||
                'Las contraseñas deben coincidir.',
            })}
            placeholder='Confirmar Contraseña'
          />
          {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
        </FormControl>
        <FormControl>
          <input
            type='text'
            {...register('nombre', {
              required: 'Por favor introduce un nombre para el Leal.',
            })}
            placeholder='Nombre'
          />
          {errors.nombre && <p>{errors.nombre.message}</p>}
        </FormControl>
        <FormControl>
          <label>Nivel de cliente:</label>
          <select
            {...register('nivelDeCliente', {
              required: 'Por favor, selecciona un nivel de cliente.',
            })}
            placeholder='Nivel de cliente'
          >
            {tiposDeClientes.map((option) => (
              <option value={option} key={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.nivelDeCliente && <p>{errors.nivelDeCliente.message}</p>}
        </FormControl>
        <FormControl>
          <Button
            disable={isSubmitting}
            buttonType={
              isSubmitting
                ? BUTTON_TYPE_CLASSES.disabled
                : BUTTON_TYPE_CLASSES.base
            }
          >
            Crear Leal
          </Button>
        </FormControl>
      </form>
    </>
  );
}
