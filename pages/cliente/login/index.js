import LoginForm from '@/components/cliente/login-form';

import classes from './index.module.scss';

export default function ClientePage() {
  return (
    <>
      <header className={classes.header}>
        <h1>Cliente Leal</h1>
      </header>
      <main className={classes.main}>
        <LoginForm />
      </main>
    </>
  );
}
