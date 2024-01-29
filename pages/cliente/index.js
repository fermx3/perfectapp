import Button from '@/components/button';
import Link from 'next/link';
import { useState } from 'react';

export default function ClientePage() {
  const [usuario, setUsuario] = useState('');

  return (
    <>
      <header>
        <h1>Cliente</h1>
      </header>
      <main>
        <h2>Login</h2>
        <form>
          <div>
            <label htmlFor='username'>Nombre de usuario:</label>
            <input
              type='text'
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor='password'>Contraseña:</label>
            <input type='password' />
          </div>
          <div>
            <Button href={`/cliente/${usuario}`}>Ingresar</Button>
          </div>
        </form>
        <div>
          <p>¿No tienes tus datos?</p>
          <Link href='/cliente/cliente-nuevo'>
            Soy cliente nuevo en perfect app
          </Link>
        </div>
      </main>
    </>
  );
}
