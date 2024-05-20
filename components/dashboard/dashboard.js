import classes from './dashboard.module.scss';

export default function Dashboard({ cuota, puntos, promocionesDisponibles }) {
  const cuotaTotal = Object.values(cuota).reduce(
    (a, b) => Number(a) + Number(b),
    0
  );
  const skus = Object.keys(cuota).length;

  return (
    <div className={classes.dashboard}>
      <div>
        <h5>Cuota del mes:</h5>
        <p>{cuotaTotal} pallets</p>
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
        <p>?</p>
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
