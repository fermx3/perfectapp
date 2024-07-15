import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import classes from './dashboard.module.scss';

export default function Dashboard({
  cuota,
  puntos,
  promocionesDisponibles,
  avance,
  session,
  clientesQueCompraron,
  clientesTotales,
}) {
  const cuotaTotal = cuota
    ? Object.values(cuota).reduce((a, b) => Number(a) + Number(b), 0)
    : 0;

  function sum(obj) {
    return Object.keys(obj).reduce(
      (sum, key) => sum + parseFloat(obj[key] || 0),
      0
    );
  }

  const avanceTotal = sum(avance);

  const avanceTotalPorcentaje = function () {
    const cajasXPallet = {
      iberia90g: 405,
      iberia225g: 400,
      iberia1Kg: 112,
    };

    const avanceTotalPallets = {
      iberia90g: avance.iberia90g / cajasXPallet.iberia90g || 0,
      iberia225g: avance.iberia225g / cajasXPallet.iberia225g || 0,
      iberia1Kg: avance.iberia1Kg / cajasXPallet.iberia1Kg || 0,
    };

    const avanceTotalPalletsTotal = Object.values(avanceTotalPallets).reduce(
      (a, b) => a + b,
      0
    );

    if (cuotaTotal === 0) return 0;
    return ((avanceTotalPalletsTotal / cuotaTotal) * 100).toFixed(2);
  };

  // const avanceTotal = avance ? avance.reduce((a, b) => a + b.cajas, 0) : 0;

  // const total1kg = avance
  //   ? avance
  //       .filter((item) => item.producto === 'Iberia 1Kg')
  //       .reduce((a, b) => a + b.cajas, 0)
  //   : 0;

  // const total90g = avance
  //   ? avance
  //       .filter((item) => item.producto === 'Iberia 90g')
  //       .reduce((a, b) => a + b.cajas, 0)
  //   : 0;

  // const total225g = avance
  //   ? avance
  //       .filter((item) => item.producto === 'Iberia 225g')
  //       .reduce((a, b) => a + b.cajas, 0)
  //   : 0;

  // const bar = new ProgressBar.Line(container, {
  //   strokeWidth: 4,
  //   easing: 'easeInOut',
  //   duration: 1400,
  //   color: '#FFEA82',
  //   trailColor: '#eee',
  //   trailWidth: 1,
  //   svgStyle: { width: '100%', height: '100%' },
  //   text: {
  //     style: {
  //       // Text color.
  //       // Default: same as stroke color (options.color)
  //       color: '#999',
  //       position: 'absolute',
  //       right: '0',
  //       top: '30px',
  //       padding: 0,
  //       margin: 0,
  //       transform: null,
  //     },
  //     autoStyleContainer: false,
  //   },
  //   from: { color: '#FFEA82' },
  //   to: { color: '#ED6A5A' },
  //   step: (state, bar) => {
  //     bar.setText(Math.round(bar.value() * 100) + ' %');
  //   },
  // });

  const efectividad = clientesTotales
    ? ((clientesQueCompraron.length / clientesTotales.length) * 100).toFixed(2)
    : undefined;

  const percentage = 66;
  // const avanceTotal = avance[0].ordenesDeCompra.map((i) => <p>{i.cajas}</p>);
  // const skus = cuota ? Object.keys(cuota).length : 0;
  return (
    <>
      {/* {session.user.role === 'LEAL' ? ( */}
      <div className={classes.dashboardLeal}>
        <div className={classes.estadisticaContainer}>
          <div className={classes.cuadro}>
            <p>{cuotaTotal} pallets</p>
            <ul>
              {Object.keys(cuota).map((key, i) => {
                let keyTitle = '';
                switch (key) {
                  case 'iberia90g':
                    keyTitle = 'Iberia 90g';
                    break;
                  case 'iberia225g':
                    keyTitle = 'Iberia 225g';
                    break;
                  case 'iberia1Kg':
                    keyTitle = 'Iberia 1Kg';
                    break;
                  default:
                    keyTitle = key;
                    break;
                }
                return (
                  <li key={i}>
                    {keyTitle}: {cuota[key]}
                  </li>
                );
              })}
            </ul>
          </div>
          <h5>Cuota del mes</h5>
        </div>
        <div className={classes.estadisticaContainer}>
          <div className={classes.cuadro}>
            <p>{avanceTotal ? avanceTotal : 0} cajas</p>
            <ul>
              <li>Iberia 1Kg: {avance.iberia1Kg ? avance.iberia1Kg : 0}</li>
              <li>Iberia 225g: {avance.iberia225g ? avance.iberia225g : 0}</li>
              <li>Iberia 90g: {avance.iberia90g ? avance.iberia90g : 0}</li>
            </ul>
            <p>{avanceTotalPorcentaje()} %</p>
          </div>
          <h5>Avance de compra</h5>
        </div>
        <div className={classes.estadisticaContainer}>
          <div className={classes.cuadro}>
            {promocionesDisponibles.length !== 0 ? (
              <ul>
                {promocionesDisponibles.map((promo, index) => (
                  <li key={index}>{promo.desc}</li>
                ))}
              </ul>
            ) : (
              <p>No hay promociones.</p>
            )}
          </div>
          <h5>Promociones del mes</h5>
        </div>
        {puntos !== undefined && session.user.role !== 'LEAL' && (
          <div className={classes.estadisticaContainer}>
            <div className={classes.cuadro}>
              <p>{puntos}</p>
            </div>
            <h5>Puntos Leales</h5>
          </div>
        )}
        {clientesTotales && (
          <div className={classes.estadisticaContainerSM}>
            <div className={classes.cuadro}>
              <p>{clientesTotales.length}</p>
            </div>
            <h5>Clientes totales</h5>
          </div>
        )}
        {clientesQueCompraron && (
          <div className={classes.estadisticaContainerSM}>
            <div className={classes.cuadro}>
              <p>{clientesQueCompraron.length}</p>
            </div>
            <h5>Clientes que compraron</h5>
          </div>
        )}
        {efectividad !== undefined && (
          <div className={classes.estadisticaContainerSM}>
            <div className={classes.cuadro}>
              <CircularProgressbar
                value={efectividad}
                text={`${efectividad}%`}
                circleRatio={0.75}
                styles={buildStyles({
                  rotation: 1 / 2 + 1 / 8,
                  strokeLinecap: 'butt',
                  trailColor: '#eee',
                  pathColor: '#3171f1',
                  textColor: 'black',
                  pathTransitionDuration: 1,
                  textSize: '1rem',
                })}
              />
            </div>
            <h5>Efectividad</h5>
          </div>
        )}
      </div>
      {/* ) : (
        <div className={classes.dashboard}>
          <div>
            <h5>Cuota del mes:</h5>
            <p>{cuotaTotal} pallets</p>
            <ul>
              {Object.keys(cuota).map((key, i) => {
                let keyTitle = '';
                switch (key) {
                  case 'iberia90g':
                    keyTitle = 'Iberia 90g';
                    break;
                  case 'iberia225g':
                    keyTitle = 'Iberia 225g';
                    break;
                  case 'iberia1Kg':
                    keyTitle = 'Iberia 1Kg';
                    break;
                  default:
                    keyTitle = key;
                    break;
                }
                return (
                  <li key={i}>
                    {keyTitle}: {cuota[key]}
                  </li>
                );
              })}
            </ul>
          </div>
          <div>
            <h5>Avance de compra:</h5>
            <p>{avanceTotal ? avanceTotal : 0} cajas</p>
            <ul>
              <li>Iberia 1Kg: {total1kg}</li>
              <li>Iberia 225g: {total225g}</li>
              <li>Iberia 90g: {total90g}</li>
            </ul>
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
                  <li key={promo}>{promo}</li>
                ))}
              </ul>
            ) : (
              <p>No hay promociones.</p>
            )}
          </div>
        </div>
      )} */}
    </>
  );
}
