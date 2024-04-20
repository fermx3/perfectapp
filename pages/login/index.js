import LoginForm from '@/components/login/login-form';

import classes from './index.module.scss';

export default function LoginPage() {
  return (
    <main className={classes.main}>
      <LoginForm />
    </main>
  );
}
