import Button from '@/components/button';

export default function RegistroClientePage() {
  return (
    <>
      <header>
        <h1>Registrar con numero de cliente</h1>
      </header>
      <main>
        <h2>Completa los datos:</h2>
        <form>
          <div>
            <label htmlFor='telefono'>Telefono de Whatsapp:</label>
            <input type='number' />
          </div>
          <div>
            <label htmlFor='email'>email:</label>
            <input type='email' />
          </div>
          <div>
            <label htmlFor='aniversario'>Aniversario:</label>
            <input type='date' />
          </div>
          <div>
            <label htmlFor='cumpleanos'>Cumpleaños del encargado:</label>
            <input type='date' />
          </div>
          <div>
            <Button href={`/cliente/`}>Completar datos</Button>
          </div>
        </form>
      </main>
    </>
  );
}
