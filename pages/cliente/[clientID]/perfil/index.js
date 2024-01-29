import LayoutCliente from '@/components/cliente/layout-cliente';

import classes from './index.module.scss';

export default function PromocionesClientePage() {
  return (
    <LayoutCliente>
      <main className={classes.main}>
        <div className={classes.section}>
          <h2>Datos del cliente</h2>
        </div>
        <div className={classes.section}>
          <h2>Datos del negocio</h2>
        </div>
      </main>
    </LayoutCliente>
  );
}
