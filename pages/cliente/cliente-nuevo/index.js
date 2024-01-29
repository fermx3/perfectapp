import Button from '@/components/button';
import { useState } from 'react';

export default function ClienteNuevoPage() {
  const [username, setUsername] = useState('');

  return (
    <>
      <header>
        <h1>cliente nuevo</h1>
      </header>
      <main>
        <h2>¿Cuentas con numero de Cliente Upfield?</h2>
        <form>
          <div>
            <label htmlFor='username'>Número de Cliente Upfield:</label>
            <input
              type='number'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <Button href={`/cliente/${username}/registro`}>Registrar</Button>
          </div>
        </form>
        <div>
          <Button
            onClick={() =>
              alert(
                'Solicita a un asesor de negocios Execution Force el pre registro para ingresar a la app'
              )
            }
          >
            NO tengo numero de Cliente Upfield
          </Button>
        </div>
      </main>
    </>
  );
}
