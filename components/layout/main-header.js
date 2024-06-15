import Image from 'next/image';
import Link from 'next/link';
import { Nunito } from 'next/font/google';

import { useSession, signOut } from 'next-auth/react';
import { selectIsMenuOpen } from '@/store/mobileMenu/mobileMenu.selector';
import { useSelector, useDispatch } from 'react-redux';

import classes from './main-header.module.scss';
import Button, { BUTTON_TYPE_CLASSES } from '../button';
import { toggleMenu } from '@/store/mobileMenu/mobileMenu.reducer';
import { useRouter } from 'next/router';
import HomeMenu, { HOMEMENU_TYPE_CLASSES } from './home-menu';

export default function MainHeader({ className }) {
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
    <div className={`${classes.header} ${className}`}>
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
        {session.status === 'authenticated' && role !== 'LEAL' && (
          <div>
            <Button
              href={
                role === 'ADMIN'
                  ? `/${role.toLowerCase()}`
                  : `/${role.toLowerCase()}/${userId}`
              }
            >
              Mi perfil
            </Button>
          </div>
        )}
        {router.pathname === '/' && <HomeMenu />}
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
        {session.status !== 'authenticated' && (
          <Button href='/login'>Inicia sesión</Button>
        )}
        {isMenuOpen ? (
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
        )}
      </div>
      {isMenuOpen && (
        <div className={classes.dropdown}>
          <nav>
            <HomeMenu
              homeMenuType={HOMEMENU_TYPE_CLASSES.mobile}
              onClick={() => dispatch(toggleMenu())}
            />
            <ul className={classes.buttons}>
              {session.status === 'authenticated' && (
                <>
                  <li>
                    <h4>Usuario: {userId}</h4>
                  </li>
                  <li>
                    <Button
                      href={`/leal/${userId}`}
                      onClick={() => dispatch(toggleMenu())}
                    >
                      Mi perfil
                    </Button>
                  </li>
                  {role === 'LEAL' && (
                    <li>
                      <Button
                        href={'/cambiar-password'}
                        onClick={() => dispatch(toggleMenu())}
                      >
                        Cambiar contraseña
                      </Button>
                    </li>
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
    </div>
  );
}
