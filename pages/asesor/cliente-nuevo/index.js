import ClienteNuevoForm from '@/components/asesor/cliente-nuevo-form';
import BackgroundGradientContainer from '@/components/layout/background-gradient-container';
import Container from '@/components/layout/container';

export default function ClienteNuevoPage() {
  return (
    <BackgroundGradientContainer>
      <Container>
        <h1>Alta de cliente</h1>
        <ClienteNuevoForm />
      </Container>
    </BackgroundGradientContainer>
  );
}
