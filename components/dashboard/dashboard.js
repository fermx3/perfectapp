import classes from './dashboard.module.scss';

export default function Dashboard({
  cuota,
  puntos,
  promocionesDisponibles,
  avance,
}) {
  const cuotaTotal = cuota
    ? Object.values(cuota).reduce((a, b) => Number(a) + Number(b), 0)
    : 0;

  const avanceTotal = avance
    ? Object.values(cuota).reduce((a, b) => Number(a) + Number(b), 0)
    : 0;
  // const skus = cuota ? Object.keys(cuota).length : 0;

  console.log(avance);

  return (
    <div className={classes.dashboard}>
      <div>
        <h5>Cuota del mes:</h5>
        <p>{cuotaTotal} pallets</p>
        <ul>
          {Object.keys(cuota).map((key, i) => (
            <li key={i}>
              {key}: {cuota[key]}
            </li>
          ))}
        </ul>
      </div>
      {/* <div>
        <h5>SKUs:</h5>
        <p>{skus}</p>
      </div> */}
      {/* <div>
        <h5>Puntos de venta:</h5>
        <p>Sin Info</p>
      </div> */}
      <div>
        <h5>Avance de compra:</h5>
        <p>{avanceTotal}</p>
      </div>
      <div>
        <h5>Puntos Leales:</h5>
        <p>{puntos ? puntos : 0}</p>
      </div>
      <div>
        <h5>Promociones del mes:</h5>
        {promocionesDisponibles ? (
          <ul>
            {promocionesDisponibles.map((promo) => (
              <li>{promo}</li>
            ))}
          </ul>
        ) : (
          <p>No hay promociones.</p>
        )}
      </div>
    </div>
  );
}
