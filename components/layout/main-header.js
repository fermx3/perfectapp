import Image from 'next/image';
import Link from 'next/link';

import { useSession, signOut } from 'next-auth/react';
import { selectIsMenuOpen } from '@/store/mobileMenu/mobileMenu.selector';
import { useSelector, useDispatch } from 'react-redux';

import classes from './main-header.module.scss';
import Button from '../button';
import { toggleMenu } from '@/store/mobileMenu/mobileMenu.reducer';
import Container from './container';

export default function MainHeader({ children }) {
  const session = useSession();
  const isMenuOpen = useSelector(selectIsMenuOpen);
  const dispatch = useDispatch();

  function logoutHandler() {
    signOut();
    dispatch(toggleMenu());
  }

  return (
    <header className={classes.header}>
      <div className={classes.logo}>
        <Link href={'/'}>
          <Image
            src={'/images/perfect-logo.png'}
            width={170}
            height={55}
            alt='perfectapp logo'
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
            <Link href='/login'>
              <li>Por favor inicia sesion</li>
            </Link>
          )}
        </ul>
      </nav>
      <div className={classes.mobileNav}>
        {isMenuOpen ? (
          <Image
            src='/images/icons/close-circle.svg'
            width={50}
            height={50}
            onClick={() => dispatch(toggleMenu())}
          />
        ) : (
          <Image
            src='/images/icons/hamburger.png'
            width={50}
            height={50}
            onClick={() => dispatch(toggleMenu())}
          />
        )}
      </div>
      {isMenuOpen && (
        <div className={classes.dropdown}>
          <nav>
            <ul>
              {session.status === 'authenticated' ? (
                <li>
                  <Button onClick={logoutHandler}>Cerrar Sesion</Button>
                </li>
              ) : (
                <Link href='/login' onClick={() => dispatch(toggleMenu())}>
                  <li>Por favor inicia sesion</li>
                </Link>
              )}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
