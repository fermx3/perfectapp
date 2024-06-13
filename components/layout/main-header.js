import Image from 'next/image';
import Link from 'next/link';

import { useSession, signOut } from 'next-auth/react';
import { selectIsMenuOpen } from '@/store/mobileMenu/mobileMenu.selector';
import { useSelector, useDispatch } from 'react-redux';

import classes from './main-header.module.scss';
import Button, { BUTTON_TYPE_CLASSES } from '../button';
import { toggleMenu } from '@/store/mobileMenu/mobileMenu.reducer';
import { useRouter } from 'next/router';

export default function MainHeader() {
  const session = useSession();
  const isMenuOpen = useSelector(selectIsMenuOpen);
  const dispatch = useDispatch();
  const userId = session.data?.user?.userId;
  const role = session.data?.user?.role;
  const router = useRouter();

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
        {role === 'LEAL' && (
          <>
            <div>
              <Link href={`/leal/${userId}`}>Mi perfil</Link>
            </div>
            <div>
              <Link href={'/cambiar-password'}>Cambiar contraseña</Link>
            </div>
          </>
        )}
        {router.pathname === '/' && (
          <div className={classes.homeMenu}>
            <div>
              <Link href={'#'}>Home</Link>
            </div>
            <div>
              <Link href={'#'}>Nosotros</Link>
            </div>
            <div>
              <Link href={'#'}>Soluciones</Link>
            </div>
            <div>
              <Link href={'#'}>Ayuda</Link>
            </div>
          </div>
        )}
        {session.status === 'authenticated' ? (
          <div>
            <Button
              buttonType={BUTTON_TYPE_CLASSES.link}
              onClick={logoutHandler}
            >
              Cerrar sesión
            </Button>
          </div>
        ) : (
          <div>
            <Button href='/login'>Ingresa a tu cuenta</Button>
          </div>
        )}
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
          <Button href='/login'>Inicia sesión</Button>
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
