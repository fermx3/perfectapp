import { motion } from 'framer-motion';
import { useEffect } from 'react';

import HomeMenu, { HOMEMENU_TYPE_CLASSES } from './home-menu';
import Button, { BUTTON_TYPE_CLASSES } from '../button';

import classes from './menu-modal.module.scss';
import { useDispatch } from 'react-redux';
import { toggleMenu } from '@/store/menu/menu.reducer';

export default function MenuModal({ session, logoutHandler }) {
  const userId = session.data?.user?.userId;
  const role = session.data?.user?.role;

  const dispatch = useDispatch();

  return (
    <motion.div
      className={classes.dropdown}
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      key='dropdown'
    >
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
              <li className={classes.cerrarSesion}>
                <Button
                  onClick={logoutHandler}
                  buttonType={BUTTON_TYPE_CLASSES.base}
                >
                  Cerrar sesión
                </Button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </motion.div>
  );
}
