import Image from 'next/image';
import Link from 'next/link';

import { useSession, signOut } from 'next-auth/react';

import classes from './main-header.module.scss';
import Button from '../button';

export default function MainHeader({ children }) {
  const session = useSession();

  function logoutHandler() {
    signOut();
  }

  return (
    <header className={classes.header}>
      <div className={classes.logo}>
        <Link href={'/'}>
          <Image
            src={'/images/perfect-logo.png'}
            width={40}
            height={40}
            alt='perfect logo'
          />
        </Link>
      </div>
      <nav className={classes.nav}>
        <ul>
          {session.status === 'authenticated' ? (
            <li>
              <Button onClick={logoutHandler}>Cerrar Sesion</Button>
            </li>
          ) : (
            <Link href='/'>
              <li>Por favor inicia sesion</li>
            </Link>
          )}
        </ul>
      </nav>
    </header>
  );
}
