import LayoutCliente from '@/components/cliente/layout-cliente';
import classes from './index.module.scss';

export default function PanelDeCliente() {
  return (
    <LayoutCliente>
      <main className={classes.main}>
        <div>
          <section className={classes.section}>
            <h2>Cliente Platino</h2>
          </section>
          <section className={classes.section}>
            <h2>Cuotas del mes</h2>
          </section>
          <section className={classes.section}>
            <h2>Canjear</h2>
          </section>
        </div>
        <section className={classes.section}>
          <h2>Dashboard</h2>
        </section>
      </main>
    </LayoutCliente>
  );
}
