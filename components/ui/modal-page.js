import Image from 'next/image';
import Markdown from 'react-markdown';

import classes from './modal-page.module.scss';
import { useDispatch } from 'react-redux';
import {
  toggleAvisoDePrivacidad,
  toggleTerminosYCondiciones,
} from '@/store/footer/footer.reducer';

export default function ModalPage({ titulo, contenido }) {
  const dispatch = useDispatch();

  return (
    <>
      <Image
        src='/images/icons/close-circle.svg'
        width={50}
        height={50}
        alt='close icon'
        className={classes.closeModal}
        onClick={() =>
          titulo === 'Aviso de privacidad'
            ? dispatch(toggleAvisoDePrivacidad())
            : dispatch(toggleTerminosYCondiciones())
        }
      />
      <div className={classes.container}>
        <div className={classes.header}>
          <h2>{titulo}</h2>
        </div>
        <div className={classes.body}>
          <Markdown>{contenido}</Markdown>
        </div>
      </div>
    </>
  );
}
