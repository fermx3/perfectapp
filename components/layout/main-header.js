import Image from 'next/image';
import Link from 'next/link';

import { useSession, signOut } from 'next-auth/react';
import { selectIsMenuOpen } from '@/store/mobileMenu/mobileMenu.selector';
import { useSelector, useDispatch } from 'react-redux';

import classes from './main-header.module.scss';
import Button, { BUTTON_TYPE_CLASSES } from '../button';
import { toggleMenu } from '@/store/mobileMenu/mobileMenu.reducer';

export default function MainHeader() {
  const session = useSession();
  const isMenuOpen = useSelector(selectIsMenuOpen);
  const dispatch = useDispatch();
  const userId = session.data?.user?.userId;
  const role = session.data?.user?.role;

  function logoutHandler() {
    signOut();
    if (isMenuOpen) {
      dispatch(toggleMenu());
    }
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
            priority
          />
        </Link>
      </div>
      <nav className={classes.nav}>
        <ul>
          {role === 'LEAL' && (
            <>
              <li>
                <Link href={`/leal/${userId}`}>Mi perfil</Link>
              </li>
              <li>
                <Link href={'/cambiar-password'}>Cambiar contraseña</Link>
              </li>
            </>
          )}
          {session.status === 'authenticated' ? (
            <li>
              <Button
                buttonType={BUTTON_TYPE_CLASSES.link}
                onClick={logoutHandler}
              >
                Cerrar sesión
              </Button>
            </li>
          ) : (
            <Link href='/login'>
              <li>Por favor inicia sesion</li>
            </Link>
          )}
        </ul>
      </nav>
      <div className={classes.mobileNav}>
        {session.status === 'authenticated' ? (
          isMenuOpen ? (
            <Image
              src='/images/icons/close-circle.svg'
              width={50}
              height={50}
              alt='close icon'
              onClick={() => dispatch(toggleMenu())}
            />
          ) : (
            <Image
              src='/images/icons/hamburger.png'
              width={50}
              height={50}
              alt='hamburger icon'
              onClick={() => dispatch(toggleMenu())}
            />
          )
        ) : (
          <Button href='/login'>Inicia Sesión</Button>
        )}
      </div>
      {isMenuOpen && (
        <div className={classes.dropdown}>
          <nav>
            <ul>
              {session.status === 'authenticated' && (
                <>
                  <li>
                    <h4>Usuario: {userId}</h4>
                  </li>
                  {role === 'LEAL' && (
                    <>
                      <li>
                        <Button
                          href={`/leal/${userId}`}
                          onClick={() => dispatch(toggleMenu())}
                        >
                          Mi perfil
                        </Button>
                      </li>
                      <li>
                        <Button
                          href={'/cambiar-password'}
                          onClick={() => dispatch(toggleMenu())}
                        >
                          Cambiar contraseña
                        </Button>
                      </li>
                    </>
                  )}
                  <li>
                    <Button onClick={logoutHandler}>Cerrar sesión</Button>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
