import classes from './dashboard.module.scss';

export default function Dashboard({ cuota, puntos }) {
  const cuotaTotal = Object.values(cuota).reduce(
    (a, b) => Number(a) + Number(b),
    0
  );
  const skus = Object.keys(cuota).length;

  return (
    <div className={classes.dashboard}>
      <div>
        <h5>Cuota pallets:</h5>
        <p>{cuotaTotal}</p>
      </div>
      <div>
        <h5>SKUs:</h5>
        <p>{skus}</p>
      </div>
      <div>
        <h5>Puntos de venta:</h5>
        <p>Sin Info</p>
      </div>
      <div>
        <h5>Puntos Leales:</h5>
        <p>{puntos ? puntos : 0}</p>
      </div>
    </div>
  );
}
