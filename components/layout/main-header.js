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

  const optionsVariants = {
    open: { opacity: 1, y: 0, scale: 1 },
    closed: { opacity: 0, y: -15, scale: 0.95 },
  };

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
            <motion.div
              className={classes.optionsIcon}
              onClick={() => dispatch(toggleSettings())}
              whileHover={{ scale: 1.1, width: 100 }}
              title='Opciones'
            >
              <motion.div
                whileTap={{ rotate: 180, opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Image
                  src={
                    isSettingsOpen
                      ? '/images/icons/close-circle.svg'
                      : '/images/icons/settings.svg'
                  }
                  alt='settings icon'
                  width={30}
                  height={30}
                />
              </motion.div>
              {isSettingsOpen ? <p>Cerrar</p> : <p>Opciones</p>}
            </motion.div>
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
          <AnimatePresence>
            <div className={classes.optionsMenuContainer}>
              {isSettingsOpen && (
                <motion.div
                  className={classes.optionsMenu}
                  variants={optionsVariants}
                  initial='closed'
                  animate='open'
                  exit='closed'
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
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
                        <>
                          <div>
                            <Button
                              href={'/cambiar-password'}
                              buttonType={BUTTON_TYPE_CLASSES.link}
                              onClick={() => dispatch(toggleSettings())}
                            >
                              Cambiar contraseña
                            </Button>
                          </div>
                          <div>
                            <Button
                              href={'/leal/actualizar-datos'}
                              buttonType={BUTTON_TYPE_CLASSES.link}
                              onClick={() => dispatch(toggleSettings())}
                            >
                              Actualiza tus datos
                            </Button>
                          </div>
                        </>
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
                </motion.div>
              )}
            </div>
          </AnimatePresence>
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
