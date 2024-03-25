import Button from '@/components/button';

export default function ClientePage() {
  return (
    <>
      <header>
        <h1>Página para clientes</h1>
      </header>
      <main>
        <h2>Bienvenido a la seccion de clientes.</h2>
        <Button href='/login'>Ingresa a tu cuenta</Button>
      </main>
    </>
  );
}
