import CrearClienteForm from '@/components/admin/crear-cliente-form';

export default function CrearClientePage() {
  return (
    <>
      <header>
        <h1>Crear cliente</h1>
        <p>
          Escribe los datos para crear un cliente nuevo en la base de datos.
        </p>
      </header>
      <main>
        <CrearClienteForm />
      </main>
    </>
  );
}
