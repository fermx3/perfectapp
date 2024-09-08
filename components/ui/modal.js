import { useEffect } from 'react';

import classes from './modal.module.scss';
import ModalBackground from './modal-background';

export default function Modal({ children, transparent }) {
  const scrollY = window.scrollY;

  useEffect(() => {
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    const scrollTo = document.body.style.top;

    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      window.scrollBy({
        left: 0,
        top: parseInt(scrollTo || '0') * -1,
        behavior: 'instant',
      });
    };
  }, [scrollY]);

  return (
    <ModalBackground>
      <div
        className={classes.modal}
        style={
          transparent && {
            background: 'transparent',
            boxShadow: 'unset',
            padding: '0',
            width: 'unset',
            height: 'unset',
          }
        }
      >
        {children}
      </div>
    </ModalBackground>
  );
}
