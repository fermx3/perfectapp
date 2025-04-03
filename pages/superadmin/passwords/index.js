import Button from '@/components/button';
import FormControl from '@/components/forms/form-control';
import FormGroup from '@/components/forms/form-group';
import BackgroundGradientContainer from '@/components/layout/background-gradient-container';
import Container from '@/components/layout/container';
import PasswordModal from '@/components/password-modal/password-modal';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader';
import { getSession } from 'next-auth/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function PasswordsManagerPage() {
  const [user, setUser] = useState(null);
  const [isError, setIsError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [passwordSuccessMessage, setPasswordSuccessMessage] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      userId: '',
    },
  });

  const onSubmit = async (data) => {
    setIsError(null);
    setUser(null);
    setPasswordSuccessMessage(false);
    const response = await fetch(
      `/api/superadmin/buscar-usuario?userId=${data.userId}`
    );

    if (response.ok) {
      const user = await response.json();
      setUser(user);
    } else {
      const error = await response.json();
      setIsError(error.error.message || 'Error desconocido');
    }

    // reset();
  };

  return (
    <>
      <BackgroundGradientContainer>
        <Container>
          <h1>Administrar contraseñas</h1>
          <p>Administra las contraseñas de los usuarios</p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl error={errors.userId?.message}>
              <input
                type='text'
                {...register('userId', {
                  required: 'Por favor introduce un número de usuario.',
                })}
                placeholder='Buscar usuario por id'
              />
              {isError && <ErrorMessage error={isError} />}
            </FormControl>
            {isSubmitting ? <Loader /> : <Button>Buscar</Button>}
          </form>
          {user && (
            <Container>
              <FormGroup>
                <h3>{user.user._id}</h3>
                <p>{user.user.userInfo.nombre}</p>
                <p>{user.user.role}</p>
                <Button type='button' onClick={() => setIsModalOpen(true)}>
                  Cambiar contraseña
                </Button>
                {passwordSuccessMessage && <p>{passwordSuccessMessage}</p>}
              </FormGroup>
            </Container>
          )}
        </Container>
      </BackgroundGradientContainer>
      {isModalOpen && (
        <PasswordModal
          setIsModalOpen={setIsModalOpen}
          user={user}
          setPasswordSuccessMessage={setPasswordSuccessMessage}
        />
      )}
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });

  if (!session || session.user.role !== 'SUPERADMIN') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const empresa = session?.user?.empresa;

  return {
    props: {
      session,
    },
  };
}
