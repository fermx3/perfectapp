import LoginForm from '@/components/cliente/login-form';
import Logo from '@/components/logo/logo';

import classes from './index.module.scss';

export default function ClientePage() {
  return (
    <>
      {/* <header className={classes.header}>
        <Logo horizontal priority />
      </header> */}
      <main className={classes.main}>
        <LoginForm />
      </main>
    </>
  );
}
