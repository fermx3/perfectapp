import LayoutCliente from '@/components/cliente/layout-cliente';

import classes from './index.module.scss';

export default function PromocionesClientePage() {
  return (
    <LayoutCliente>
      <main className={classes.main}>
        <div className={classes.section}>
          <h2>Promociones del mes</h2>
        </div>
      </main>
    </LayoutCliente>
  );
}
