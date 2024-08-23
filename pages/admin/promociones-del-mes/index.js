import Button, { BUTTON_TYPE_CLASSES } from '@/components/button';
import FormControl from '@/components/forms/form-control';
import FormGroup from '@/components/forms/form-group';
import InputGroup from '@/components/forms/input-group';
import BackgroundGradientContainer from '@/components/layout/background-gradient-container';
import Container from '@/components/layout/container';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import Loader from '@/components/ui/loader';
import { getPromociones, getSettings } from '@/lib/db';
import SelectInput from '@/components/forms/select-input';
import { nivelesDeLeales } from '@/lib/schemas/schemas';
import NivelDeClienteField from '@/components/admin/nivel-de-cliente-field';
import Image from 'next/image';
import Modal from '@/components/ui/modal';

export default function PromocionesDelMesPage({ promocionesDelMes, skus }) {
  const promociones = promocionesDelMes.reduce((acc, promo) => {
    acc.push({
      promo: promo.promo,
      sku: promo.sku,
      nivelDeCliente: nivelesDeLeales.map((nivel) => ({
        name: nivel.toLocaleLowerCase(),
        selected: promo.nivelDeCliente.includes(nivel.toLowerCase()),
      })),
    });
    return acc;
  }, []);

  const defaultValues = {
    promociones: promociones || [],
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitted },
    reset,
    setError,
    control,
    getValues,
    setValue,
    watch,
  } = useForm({
    defaultValues: defaultValues,
    shouldUnregister: true,
    // resolver: zodResolver(actualizarPromocionesSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'promociones',
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const skusOptions = Object.values(skus).map((sku) => sku.sku);

  const router = useRouter();

  const handleClick = function () {
    router.reload();
  };

  async function actualizarPromos(data) {
    // console.log(data);
    const response = await fetch('/api/admin/actualizar-promociones', {
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

    // if (responseData.errors) {
    //   const errors = responseData.errors;

    //   if (errors.nombre) {
    //     setError('nombre', {
    //       type: 'server',
    //       message: errors.nombre,
    //     });
    //   } else if (errors.nivelDeCliente) {
    //     setError('nivelDeCliente', {
    //       type: 'server',
    //       message: errors.nivelDeCliente,
    //     });
    //   } else if (errors.central) {
    //     setError('central', {
    //       type: 'server',
    //       message: errors.central,
    //     });
    //   } else if (errors.ubicacion) {
    //     setError('ubicacion', {
    //       type: 'server',
    //       message: errors.ubicacion,
    //     });
    //   } else if (errors.canal) {
    //     setError('canal', {
    //       type: 'server',
    //       message: errors.canal,
    //     });
    //   } else if (errors.comentarios) {
    //     setError('comentarios', {
    //       type: 'server',
    //       message: errors.comentarios,
    //     });
    //   }
    // }

    return responseData;
  }

  const onSubmit = async (data) => {
    setSuccessMessage('');
    setErrorMessage('');

    // submit to server
    try {
      const result = await actualizarPromos(data);
      //Successfuly create user
      setSuccessMessage(result.message);
      if (result.message) {
        reset();
      }
    } catch (error) {
      setErrorMessage(
        // error.message ||
        'Algo salio mal, intenta de nuevo o contacta al administrador.'
      );
      //Fail on create user
    }
  };

  return (
    <BackgroundGradientContainer>
      <Container>
        <h1>Promociones del mes</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          {fields.map((item, index) => (
            <FormGroup key={item.id}>
              <InputGroup>
                <FormControl
                  label='Promoción'
                  error={errors.promociones?.[index]?.promo?.message}
                >
                  <input
                    type='text'
                    placeholder='Escribe la promoción'
                    {...register(`promociones.${index}.promo`, {
                      required: 'Por favor completa este campo',
                    })}
                  />
                </FormControl>
                <FormControl
                  label='SKU'
                  error={errors.promociones?.[index]?.sku?.message}
                >
                  <Controller
                    name={`promociones.${index}.sku`}
                    control={control}
                    rules={{
                      required: true,
                    }}
                    render={({ field: { onChange, value } }) => (
                      <SelectInput
                        defaultValue={'Selecciona un SKU'}
                        options={skusOptions}
                        value={value}
                        onChange={onChange}
                      />
                    )}
                  />
                </FormControl>
                <FormControl label='Nivel de cliente'>
                  <NivelDeClienteField
                    nestIndex={index}
                    {...{ control, register, getValues, watch, errors }}
                  />
                </FormControl>
                <Button
                  type='button'
                  buttonType={BUTTON_TYPE_CLASSES.secondary}
                  onClick={() => remove(index)}
                >
                  <Image
                    src='/images/icons/delete.png'
                    width={20}
                    height={20}
                    alt=''
                  />
                </Button>
              </InputGroup>
            </FormGroup>
          ))}
          <InputGroup>
            <Button
              type='button'
              buttonType={BUTTON_TYPE_CLASSES.secondary}
              onClick={() =>
                append({
                  promo: '',
                  sku: '',
                  nivelDeCliente: nivelesDeLeales.map((nivel) => ({
                    name: nivel.toLocaleLowerCase(),
                    selected: false,
                  })),
                })
              }
            >
              Agregar promocion
            </Button>
          </InputGroup>
          {isSubmitting && <Loader />}
          <InputGroup>
            <FormControl>
              <Button
                disabled={isSubmitting}
                buttonType={
                  isSubmitting
                    ? BUTTON_TYPE_CLASSES.disabled
                    : BUTTON_TYPE_CLASSES.base
                }
              >
                ACTUALIZAR PROMOCIONES
              </Button>
            </FormControl>
          </InputGroup>
        </form>
      </Container>
      {(successMessage || errorMessage) && (
        <Modal>
          <p style={{ marginBottom: '1rem' }}>
            {successMessage || errorMessage}
          </p>
          <Button type='button' onClick={handleClick}>
            Ok
          </Button>
        </Modal>
      )}
    </BackgroundGradientContainer>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });

  if (!session || session.user.role !== 'ADMIN') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const empresa = session?.user?.empresa;

  const { promocionesDelMes } = await getPromociones(empresa);
  const { skus } = await getSettings(empresa);

  return {
    props: { session, promocionesDelMes, skus },
  };
}
