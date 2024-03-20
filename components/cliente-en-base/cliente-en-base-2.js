import { useContext, useState } from 'react';

import InfoMessage from '../ui/info-message';
import Button from '../button';
import FormSection from '../forms/form-section';
import FormControl from '../forms/form-control';

import { ClienteEnBaseContext } from '@/store/clienteEnBase.context';

export default function ClienteEnBase2({ submitHandler, prevHandler }) {
  const { visitaActual } = useContext(ClienteEnBaseContext);

  const [clienteEnBase, setClienteEnBase] = useState({
    cuentaConInventario: visitaActual.cuentaConInventario
      ? visitaActual.cuentaConInventario
      : false,
    ordenDeCompra: visitaActual.ordenDeCompra
      ? visitaActual.ordenDeCompra
      : false,
    comentarios2: visitaActual.comentarios2,
  });

  function handleInventario(inventarioChecked) {
    setClienteEnBase({
      ...clienteEnBase,
      cuentaConInventario: !inventarioChecked,
    });
  }

  function handleOrden(ordenChecked) {
    setClienteEnBase({
      ...clienteEnBase,
      ordenDeCompra: !ordenChecked,
    });
  }

  return (
    <form onSubmit={(event) => submitHandler(event, clienteEnBase)}>
      <InfoMessage
        titulo='Noticia importante de fidelizacion'
        contenido='Aquí va el contenido de la noticia importante.'
      />
      <FormSection titulo='Promoción del mes'></FormSection>
      <FormSection titulo='Cuneta'>
        <FormControl
          id='inventario'
          label='Cuenta con inventario'
          type='switch'
          value={clienteEnBase.cuentaConInventario}
          onChange={() => handleInventario(clienteEnBase.cuentaConInventario)}
        />
        <FormControl
          id='ordenDeCompra'
          label='Orden de compra'
          type='switch'
          value={clienteEnBase.ordenDeCompra}
          onChange={() => handleOrden(clienteEnBase.ordenDeCompra)}
        />
      </FormSection>
      <FormControl
        type='textarea'
        label='Comentarios'
        value={clienteEnBase.comentarios2}
        onChange={(e) =>
          setClienteEnBase({ ...clienteEnBase, comentarios2: e.target.value })
        }
      />
      <Button type='button' onClick={prevHandler}>
        Anterior
      </Button>
      <Button type='submit'>Siguiente</Button>
    </form>
  );
}
