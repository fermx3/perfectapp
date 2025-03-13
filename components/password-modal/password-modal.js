import { useForm } from 'react-hook-form';
import Button from '../button';
import FormControl from '../forms/form-control';
import Modal from '../ui/modal';
import ModalCloseBtn from '../ui/modal-close-btn';
import Loader from '../ui/loader';
import { set } from 'mongoose';

export default function PasswordModal({
  user,
  setIsModalOpen,
  setPasswordSuccessMessage,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      newPassword: '',
    },
  });

  const onSubmit = async (data) => {
    const response = await fetch('/api/superadmin/cambiar-password', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: user.user._id,
        newPassword: data.newPassword,
      }),
    });

    if (response.ok) {
      const result = await response.json();
      setPasswordSuccessMessage(result.message);
      reset();
      setIsModalOpen(false);
    } else {
      const error = await response.json();
      console.log(error);
    }
  };

  return (
    <>
      <Modal>
        <h1>
          Cambiar contraseña del usuario {user.user._id} -{' '}
          {user.user.userInfo.nombre}
        </h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl>
            <input
              type='text'
              {...register('newPassword')}
              placeholder='Nueva contraseña'
            />
          </FormControl>

          <Button>Cambiar</Button>
          {isSubmitting && <Loader />}
        </form>
      </Modal>
      <ModalCloseBtn handleClose={() => setIsModalOpen(false)} />
    </>
  );
}
