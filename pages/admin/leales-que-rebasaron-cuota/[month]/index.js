import LealesQueRebasaronCuotaDisplay from '@/components/admin/leales-que-rebasaron-cuota-display/leales-que-rebasaron-cuota-display';
import Button from '@/components/button';
import BackgroundGradientContainer from '@/components/layout/background-gradient-container';
import Container from '@/components/layout/container';
import { getLealesQueRebasaronCuota } from '@/lib/db';
import moment from 'moment';
import 'moment/locale/es';
import { getSession } from 'next-auth/react';

export default function LealesQueRebasaronCuotaByMonthPage({
  lealesQueRebasaronCuota,
  month,
}) {
  moment.locale('es');

  return (
    <BackgroundGradientContainer>
      <Container>
        <h1>
          Leales que rebasaron la cuota en{' '}
          {moment(month).format('MMMM [de] YYYY')}
        </h1>
        <LealesQueRebasaronCuotaDisplay
          lealesQueRebasaronCuota={lealesQueRebasaronCuota}
          month={month}
        />
        <div>
          <Button
            href='
            /admin/leales-que-rebasaron-cuota'
          >
            Volver
          </Button>
        </div>
      </Container>
    </BackgroundGradientContainer>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });
  const month = context.params.month;

  if (!session || session.user.role !== 'ADMIN') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const empresa = session?.user?.empresa;
  const lealesQueRebasaronCuota = await getLealesQueRebasaronCuota(
    month,
    empresa
  );

  return {
    props: { session, lealesQueRebasaronCuota, month },
  };
}
