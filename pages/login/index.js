import LoginForm from '@/components/cliente/login-form';

import classes from './index.module.scss';

export default function LoginPage() {
  return (
    <main className={classes.main}>
      <LoginForm />
    </main>
  );
}
