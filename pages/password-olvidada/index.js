import { BUTTON_TYPE_CLASSES } from '@/components/button';
import ButtonGroup from '@/components/button-group';
import BackgroundGradientContainer from '@/components/layout/background-gradient-container';
import Container from '@/components/layout/container';

import classes from './index.module.scss';

export default function PasswordOlvidadaPage() {
  return (
    <BackgroundGradientContainer>
      <Container>
        <div className={classes.textContainer}>
          <h1>¿Olvidaste tu contraseña?</h1>
          <p>
            Ponte en contacto con uno de nuestros asesores o solicita asistencia
            via whatsapp o email.
          </p>
        </div>
        <ButtonGroup
          options={[
            {
              name: 'Volver al inicio',
              link: '/',
              buttonType: BUTTON_TYPE_CLASSES.secondary,
            },
            {
              image: '/images/icons/links/whatsapp.svg',
              link: 'https://wa.me/525569293104?text=No%20recuerdo%20mi%20contraseña',
              buttonType: BUTTON_TYPE_CLASSES.icon,
              tooltip: 'WhatsApp',
              newPage: true,
              // disabled: true,
            },
            {
              image: '/images/icons/links/mail.svg',
              link: 'mailto:hola@ruta-perfectapp.com?subject=No recuerdo mi contraseña',
              newPage: true,
              buttonType: BUTTON_TYPE_CLASSES.icon,
              tooltip: 'e-mail',
              newPage: true,
              // disabled: true,
            },
          ]}
        />
        {/* <p>Ingresa tu correo electrónico para recuperar tu contraseña</p>
            <form>
                <input type="email" placeholder="Correo electrónico" />
                <button>Enviar</button>
            </form> */}
      </Container>
    </BackgroundGradientContainer>
  );
}
