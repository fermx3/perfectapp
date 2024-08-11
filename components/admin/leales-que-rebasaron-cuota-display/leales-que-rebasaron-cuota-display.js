import Button, { BUTTON_TYPE_CLASSES } from '@/components/button';
import { useForm } from 'react-hook-form';

import classes from './leales-que-rebasaron-cuota-display.module.scss';
import Loader from '@/components/ui/loader';
import { useRouter } from 'next/router';

export default function LealesQueRebasaronCuotaDisplay({
  lealesQueRebasaronCuota,
  month,
  confirmaDuplicacion,
}) {
  const lealesQueDuplicaranPuntos =
    lealesQueRebasaronCuota.filter(
      (leal) =>
        !leal.mesesCuotaRebasada?.includes(month) && leal.puntosGenerados > 0
    ) || [];

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    control,
  } = useForm({
    defaultValues: {
      lealesQueRebasaronCuota: lealesQueDuplicaranPuntos,
    },
  });

  const onSubmit = async (data) => {
    const response = await fetch(`/api/admin/duplicar-puntos`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      alert('Puntos duplicados correctamente');
      router.push('/admin/leales-que-rebasaron-cuota');
    } else {
      alert('Error al duplicar puntos');
    }
  };

  if (lealesQueRebasaronCuota.length === 0) {
    return <p>Ningun leal ha rebasado la cuota este mes</p>;
  }

  return (
    <div className={classes.moduleContainer}>
      <ul className={classes.grid}>
        {lealesQueRebasaronCuota.map((leal) => {
          const yaDuplicoPuntos = leal.mesesCuotaRebasada?.includes(month);
          return (
            <li
              key={leal._id}
              className={yaDuplicoPuntos ? classes.rebasado : classes.leal}
            >
              <h3>{leal._id}</h3>
              <p>Puntos generados: {leal.puntosGenerados}</p>
              {yaDuplicoPuntos && (
                <p className={classes.yaDuplicoMessage}>
                  Ya ha duplicado sus puntos
                </p>
              )}
              {confirmaDuplicacion && (
                <p>Puntos duplicados: {leal.puntosGenerados * 2}</p>
              )}
            </li>
          );
        })}
      </ul>
      {!confirmaDuplicacion && (
        <Button
          buttonType={
            lealesQueDuplicaranPuntos.length !== 0
              ? BUTTON_TYPE_CLASSES.secondary
              : BUTTON_TYPE_CLASSES.disabled
          }
          href={`/admin/leales-que-rebasaron-cuota/${month}/duplicar-puntos`}
        >
          Duplicar puntos
        </Button>
      )}
      {confirmaDuplicacion && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Button
            buttonType={
              isSubmitting || lealesQueDuplicaranPuntos.length === 0
                ? BUTTON_TYPE_CLASSES.disabled
                : BUTTON_TYPE_CLASSES.primary
            }
          >
            Confirmar duplicación
          </Button>
          {isSubmitting && <Loader />}
        </form>
      )}
    </div>
  );
}
