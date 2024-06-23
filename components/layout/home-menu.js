import Link from 'next/link';

import classes from './home-menu.module.scss';
import { useRouter } from 'next/router';

export const HOMEMENU_TYPE_CLASSES = {
  base: 'base',
  mobile: 'mobile',
};

const getHomeMenu = (homeMenuType = HOMEMENU_TYPE_CLASSES.base) =>
  ({
    [HOMEMENU_TYPE_CLASSES.base]: classes.homeMenu,
    [HOMEMENU_TYPE_CLASSES.mobile]: classes.mobileHomeMenu,
  }[homeMenuType]);

export default function HomeMenu({ homeMenuType, onClick }) {
  const customHomeMenu = getHomeMenu(homeMenuType);
  const router = useRouter();

  if (router.pathname === '/' || '/login') {
    return (
      <div className={customHomeMenu}>
        <Link href={'/'} onClick={onClick && onClick}>
          Home
        </Link>
        <Link href={'/#nosotros'} onClick={onClick && onClick}>
          Nosotros
        </Link>
        <Link href={'/#soluciones'} onClick={onClick && onClick}>
          Soluciones
        </Link>
        <Link href={'/#ayuda'} onClick={onClick && onClick}>
          Ayuda
        </Link>
      </div>
    );
  } else {
    return null;
  }
}
