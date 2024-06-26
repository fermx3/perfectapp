import moment from 'moment';

import Container from './container';
import Button, { BUTTON_TYPE_CLASSES } from '../button';
import Modal from '../ui/modal';
import ModalPage from '../ui/modal-page';

import { useDispatch, useSelector } from 'react-redux';
import {
  selectAvisoDePrivacidad,
  selectAvisoDePrivacidadOpen,
  selectTerminosYCondiciones,
  selectTerminosYCondicionesOpen,
} from '@/store/footer/footer.selector';

import classes from './main-footer.module.scss';
import {
  toggleAvisoDePrivacidad,
  toggleTerminosYCondiciones,
} from '@/store/footer/footer.reducer';

export default function MainFooter({ className }) {
  const avisoDePrivacidadOpen = useSelector(selectAvisoDePrivacidadOpen);
  const terminosYCondicionesOpen = useSelector(selectTerminosYCondicionesOpen);
  const avisoDePrivacidad = useSelector(selectAvisoDePrivacidad);
  const terminosYCondiciones = useSelector(selectTerminosYCondiciones);

  const dispatch = useDispatch();

  return (
    <>
      <footer className={`${classes.mainFooter} ${className}`}>
        <Container md>
          <div>
            <p>COPYRIGHT © {moment().format('YYYY')} PERFECTAPP.</p>
            <p>TODOS LOS DERECHOS RESERVADOS.</p>
          </div>
          <div className={classes.links}>
            <div>
              <Button
                buttonType={BUTTON_TYPE_CLASSES.link}
                onClick={() => dispatch(toggleAvisoDePrivacidad())}
              >
                AVISO DE PRIVACIDAD
              </Button>
            </div>
            <div className={classes.line} />
            <div>
              <Button
                buttonType={BUTTON_TYPE_CLASSES.link}
                onClick={() => dispatch(toggleTerminosYCondiciones())}
              >
                CONDICIONES DE USO
              </Button>
            </div>
          </div>
        </Container>
      </footer>
      {avisoDePrivacidadOpen && (
        <Modal>
          <ModalPage
            titulo='Aviso de privacidad'
            contenido={avisoDePrivacidad}
            clickHandler={() => dispatch(toggleAvisoDePrivacidad())}
          />
        </Modal>
      )}
      {terminosYCondicionesOpen && (
        <Modal>
          <ModalPage
            titulo='Términos y condiciones'
            contenido={terminosYCondiciones}
            clickHandler={() => dispatch(toggleTerminosYCondiciones())}
          />
        </Modal>
      )}
    </>
  );
}
