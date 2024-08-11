import Link from 'next/link';

import { getSession } from 'next-auth/react';
import Container from '@/components/layout/container';
import LinksGroup from '@/components/ui/links-group';
import { getLealesQueRebasaronCuota, getOrdenesSinValidar } from '@/lib/db';
import moment from 'moment';

export default function AdminPage({
  lealesQueRebasaronCuotaNumber,
  ordenesSinValidarNumber,
}) {
  const links = [
    {
      titulo: 'Mensajes de Asesores',
      link: '/admin/mensajes-asesores',
      desc: 'Cambia los mensjes que ven los Asesores.',
    },
    {
      titulo: 'Cambiar valor de puntos por cliente',
      link: '#',
      desc: 'Cambia el valor de los puntos por cliente.',
    },
    {
      titulo: 'Cambiar promociones del mes',
      link: '/admin/promociones-del-mes',
      desc: 'Modifica las promocones del mes por tipo de cliente.',
    },
    {
      titulo: 'Validar prospectos',
      link: '#',
      desc: 'Validar prospectos que han sido agregados por asesores.',
    },
    {
      titulo: 'Validar ventas',
      link: '/admin/ordenes-pendientes',
      desc: 'Validar ventas que han sido agregadas por asesores.',
      notificaciones: ordenesSinValidarNumber,
    },
    {
      titulo: 'Leales que rebasaron cuota',
      link: '/admin/leales-que-rebasaron-cuota',
      desc: 'Muestra los leales que rebasaron cuota y permite duplicar los puntos del mes.',
      notificaciones: lealesQueRebasaronCuotaNumber || null,
    },
  ];

  return (
    <Container>
      <header>
        <h1>Página de Administración</h1>
        <h3>Bienvenido</h3>
      </header>
      <main>
        <LinksGroup
          links={links.sort((a, b) => a.link.localeCompare(b.link))}
        />
      </main>
    </Container>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });

  const lastMonth = moment().subtract(1, 'months').format('YYYY-MM');

  const lealesQueRebasaronCuotaNumber = (
    await getLealesQueRebasaronCuota(lastMonth)
  ).length;

  const ordenesSinValidarNumber = (await getOrdenesSinValidar()).length;

  if (!session || session.user.role !== 'ADMIN') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: { session, lealesQueRebasaronCuotaNumber, ordenesSinValidarNumber },
  };
}
