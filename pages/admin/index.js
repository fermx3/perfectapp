import Link from 'next/link';

export default function AdminPage() {
  return (
    <>
      <header>
        <h1>Página de Administración</h1>
        <h3>Bienvenido Sonambulo</h3>
      </header>
      <main>
        <nav>
          <ul>
            <li>
              <Link href={'/admin/crear-cliente'}>Crear Cliente</Link>
            </li>
            <li>
              <Link href={'/admin'}>Crear Operador</Link>
            </li>
            <li>
              <Link href={'/admin'}>Crear Usuario</Link>
            </li>
          </ul>
        </nav>
      </main>
    </>
  );
}
