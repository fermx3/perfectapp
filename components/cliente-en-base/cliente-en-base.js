import { useState, useContext } from 'react';
import FormControl from '../forms/form-control';

import { ClienteEnBaseContext } from '@/store/clienteEnBase.context';
import Button from '../button';

const getNoDeCompetidoresNumber = function (endNumber) {
  const competidoresNumber = [];
  for (let i = 1; i <= endNumber; i++) {
    competidoresNumber.push(i);
  }
  return competidoresNumber;
};

export default function ClienteEnBase1() {
  const { setVisitaActual, visitaActual } = useContext(ClienteEnBaseContext);

  const [clienteEnBase1, setClienteEnBase1] = useState({
    noDeCompetidores: null,
    competidores: [],
    comentarios1: '',
  });
  const [competidores, setCompetidores] = useState([]);

  console.log(clienteEnBase1);
  console.log(visitaActual);

  function submitHandler(event) {
    event.preventDefault();
    setVisitaActual({ ...visitaActual, ...clienteEnBase1 });
    console.log(clienteEnBase1);
  }

  return (
    <form onSubmit={submitHandler}>
      <div>
        <h4>Assessment Producto - Empaque - Precio</h4>
        <FormControl
          type='select'
          label='Numero de competidores'
          options={getNoDeCompetidoresNumber(10)}
          defaultOption='Selecciona un número'
          value={clienteEnBase1.noDeCompetidores}
          onChange={(e) =>
            setClienteEnBase1({
              ...clienteEnBase1,
              noDeCompetidores: Number(e.target.value),
            })
          }
        />
        {clienteEnBase1.noDeCompetidores &&
          [...Array(Number(clienteEnBase1.noDeCompetidores))].map(
            (value, index) => (
              <FormControl
                type='select'
                label={`Competidor ${index + 1}`}
                defaultOption='Nombre del competidor'
                options={['Chipilo', 'Chilchota', 'Lala', 'Otra']}
                key={index}
                value={clienteEnBase1.competidores[index]}
                onChange={(e) => {
                  const newArr = [...competidores];
                  newArr[index] = { competidor: e.target.value };
                  setCompetidores(newArr);
                  setClienteEnBase1({
                    ...clienteEnBase1,
                    competidores: newArr,
                  });
                }}
              />
            )
          )}
      </div>
      <div>
        <h4>Assessment Promoción - Propuesta</h4>
        {clienteEnBase1.noDeCompetidores &&
          clienteEnBase1.competidores.map((competidor) => {
            return <p>{competidor.competidor}</p>;
          })}
      </div>
      <div>
        <h4>ℹ️ Informacion de Categoria</h4>
      </div>
      <FormControl
        type='textarea'
        label='Comentarios'
        value={clienteEnBase1.comentarios1}
        onChange={(e) =>
          setClienteEnBase1({ ...clienteEnBase1, comentarios1: e.target.value })
        }
      />
      <Button>Siguiente</Button>
    </form>
  );
}
