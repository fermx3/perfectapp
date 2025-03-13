import classes from './modal-close-btn.module.scss';
import Image from 'next/image';

export default function ModalCloseBtn({ handleClose }) {
  return (
    <Image
      className={classes.closeIcon}
      src='/images/icons/close-circle.svg'
      alt='Cerrar'
      onClick={handleClose}
      width={34}
      height={34}
    />
  );
}
