import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';

import { useSession, signOut } from 'next-auth/react';
import {
  selectIsMenuOpen,
  selectIsSettingsOpen,
} from '@/store/menu/menu.selector';
import { useSelector, useDispatch } from 'react-redux';

import classes from './main-header.module.scss';
import Button, { BUTTON_TYPE_CLASSES } from '../button';
import { toggleMenu, toggleSettings } from '@/store/menu/menu.reducer';
import { useRouter } from 'next/router';
import HomeMenu from './home-menu';
import MenuModal from './menu-modal';

export default function MainHeader({ className }) {
  const session = useSession();
  const isMenuOpen = useSelector(selectIsMenuOpen);
  const isSettingsOpen = useSelector(selectIsSettingsOpen);
  const dispatch = useDispatch();
  const userId = session.data?.user?.userId;
  const role = session.data?.user?.role;
  const router = useRouter();

  function logoutHandler() {
    signOut();
    if (isMenuOpen) {
      dispatch(toggleMenu());
    }
    if (isSettingsOpen) {
      dispatch(toggleSettings());
    }
  }

  return (
    <div className={classes.container}>
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
          <HomeMenu />
          {session.status === 'authenticated' ? (
            <div
              className={classes.optionsIcon}
              onClick={() => dispatch(toggleSettings())}
            >
              <Image src='/images/icons/settings.svg' width={30} height={30} />
            </div>
          ) : (
            <>
              {router.pathname !== '/login' && (
                <div>
                  <Button href='/login' buttonType={BUTTON_TYPE_CLASSES.link}>
                    Ingresa a tu cuenta
                  </Button>
                </div>
              )}
            </>
          )}
          {isSettingsOpen && (
            <div className={classes.optionsMenu}>
              {session.status === 'authenticated' && (
                <>
                  <div>
                    <Button
                      href={
                        role === 'ADMIN'
                          ? `/${role.toLowerCase()}`
                          : `/${role.toLowerCase()}/${userId}`
                      }
                      buttonType={BUTTON_TYPE_CLASSES.link}
                      onClick={() => dispatch(toggleSettings())}
                    >
                      Mi perfil
                    </Button>
                  </div>
                  {role === 'LEAL' && (
                    <div>
                      <Button
                        href={'/cambiar-password'}
                        buttonType={BUTTON_TYPE_CLASSES.link}
                        onClick={() => dispatch(toggleSettings())}
                      >
                        Cambiar contraseña
                      </Button>
                    </div>
                  )}
                </>
              )}

              <div>
                <Button
                  onClick={logoutHandler}
                  buttonType={BUTTON_TYPE_CLASSES.link}
                >
                  Cerrar sesión
                </Button>
              </div>
            </div>
          )}
        </nav>
        <div className={classes.mobileNav}>
          {session.status !== 'authenticated' &&
            router.pathname !== '/login' && (
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
        <AnimatePresence>
          {isMenuOpen && (
            <MenuModal
              session={session}
              userId={userId}
              logoutHandler={logoutHandler}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
