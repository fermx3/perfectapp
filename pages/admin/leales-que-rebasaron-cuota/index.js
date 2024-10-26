import LealesQueRebasaronCuotaDisplay from '@/components/admin/leales-que-rebasaron-cuota-display/leales-que-rebasaron-cuota-display';
import Button from '@/components/button';
import FormControl from '@/components/forms/form-control';
import InputGroup from '@/components/forms/input-group';
import BackgroundGradientContainer from '@/components/layout/background-gradient-container';
import Container from '@/components/layout/container';
import { getLealesQueRebasaronCuota } from '@/lib/db';
import moment from 'moment';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function LealesQueRebasaronCuotaPage({
  lealesQueRebasaronCuota,
  currentMonth,
}) {
  const [month, setMonth] = useState(currentMonth);
  const [monthEntered, setMonthEntered] = useState(null);

  const router = useRouter();

  return (
    <BackgroundGradientContainer>
      <Container>
        <h1>Leales que han rebasado la cuota en el mes corriente</h1>
        <LealesQueRebasaronCuotaDisplay
          lealesQueRebasaronCuota={lealesQueRebasaronCuota}
          month={month}
        />
        <div>
          <h2>Ver otro mes</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setMonth(monthEntered);
              router.push(`/admin/leales-que-rebasaron-cuota/${monthEntered}`);
            }}
          >
            <InputGroup>
              <FormControl>
                <input
                  type='month'
                  max={currentMonth}
                  value={monthEntered}
                  onChange={(e) => setMonthEntered(e.target.value)}
                  placeholder='AAAA-MM'
                />
              </FormControl>
              <Button>Ver</Button>
            </InputGroup>
          </form>
        </div>
      </Container>
    </BackgroundGradientContainer>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });

  const currentMonth = moment().format('YYYY-MM');

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
    currentMonth,
    empresa
  );

  return {
    props: { session, lealesQueRebasaronCuota, currentMonth },
  };
}
