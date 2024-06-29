import Button, { BUTTON_TYPE_CLASSES } from '@/components/button';
import ContactForm from '@/components/home-page/contact-form/contact-form';
import BackgroundGradientContainer from '@/components/layout/background-gradient-container';
import Container from '@/components/layout/container';

export default function ContactoPage() {
  return (
    <BackgroundGradientContainer>
      <Container>
        <h1>Contacto</h1>
        <ContactForm />
        <Button href='/' buttonType={BUTTON_TYPE_CLASSES.link}>
          {' < Volver al inicio'}
        </Button>
      </Container>
    </BackgroundGradientContainer>
  );
}
