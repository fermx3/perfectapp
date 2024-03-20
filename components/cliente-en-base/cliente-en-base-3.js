import { useState, useContext } from 'react';

import Button from '../button';
import InfoMessage from '../ui/info-message';

import { ClienteEnBaseContext } from '@/store/clienteEnBase.context';
import FormSection from '../forms/form-section';
import FormControl from '../forms/form-control';

export default function ClienteEnBase3({ submitHandler, prevHandler }) {
  const { visitaActual } = useContext(ClienteEnBaseContext);

  const [clienteEnBase, setClienteEnBase] = useState({
    cuentaConInventario: visitaActual.cuentaConInventario
      ? visitaActual.cuentaConInventario
      : false,
    ordenDeCompra: visitaActual.ordenDeCompra
      ? visitaActual.ordenDeCompra
      : false,
    comentarios3: visitaActual.comentarios3,
  });

  return (
    <form onSubmit={(event) => submitHandler(event, clienteEnBase)}>
      <InfoMessage
        titulo='Noticia importante de comunicación'
        contenido='Aquí va el contenido de la noticia importante.'
      />
      <FormSection titulo='Plan de comunicación del mes'></FormSection>
      <FormSection titulo='Implementación'></FormSection>
      <FormSection titulo='Implementación'></FormSection>
      <FormControl
        type='textarea'
        label='Comentarios'
        value={clienteEnBase.comentarios3}
        onChange={(e) =>
          setClienteEnBase({ ...clienteEnBase, comentarios3: e.target.value })
        }
      />
      <Button type='button' onClick={prevHandler}>
        Anterior
      </Button>
      <Button type='submit'>Guardar y enviar</Button>
    </form>
  );
}
