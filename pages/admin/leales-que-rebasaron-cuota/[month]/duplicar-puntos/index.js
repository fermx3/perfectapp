import LealesQueRebasaronCuotaDisplay from '@/components/admin/leales-que-rebasaron-cuota-display/leales-que-rebasaron-cuota-display';
import BackgroundGradientContainer from '@/components/layout/background-gradient-container';
import Container from '@/components/layout/container';
import InfoMessage from '@/components/ui/info-message';
import { getLealesQueRebasaronCuota } from '@/lib/db';
import { getSession } from 'next-auth/react';
import moment from 'moment';
import 'moment/locale/es';

export default function DuplicarPuntosPage({ lealesQueRebasaronCuota, month }) {
  moment.locale('es');
  const formattedMonth = moment(month).format('MMMM [de] YYYY');

  if (lealesQueRebasaronCuota.length === 0) {
    return (
      <BackgroundGradientContainer>
        <Container>
          <h1>
            No hay leales que rebasaron cuota en el mes {formattedMonth} para
            duplicar sus puntos.
          </h1>
        </Container>
      </BackgroundGradientContainer>
    );
  }

  return (
    <BackgroundGradientContainer>
      <Container>
        <h1>Duplicar puntos leal en el mes {formattedMonth}</h1>
        <p>
          Estas a punto de duplicar los puntos de los Leales que cumplieron su
          cuota en el mes {formattedMonth}, asegurate de que esta acción es
          correcta, recuerda que esta acción no se puede deshacer.
        </p>
        <InfoMessage
          titulo='Aviso'
          contenido='Se recomienda hacer este proceso a mes vencido.'
        />
        <div>
          <LealesQueRebasaronCuotaDisplay
            lealesQueRebasaronCuota={lealesQueRebasaronCuota}
            month={month}
            confirmaDuplicacion
          />
        </div>
      </Container>
    </BackgroundGradientContainer>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });
  const month = context.params.month;

  const lealesQueRebasaronCuota = await getLealesQueRebasaronCuota(month);

  if (!session || session.user.role !== 'ADMIN') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: { session, lealesQueRebasaronCuota, month },
  };
}
