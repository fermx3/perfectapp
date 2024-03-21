import classes from './info-message.module.scss';
export default function InfoMessage({ titulo, contenido }) {
  return (
    <div className={classes.info}>
      <h4>ℹ️ {titulo}</h4>
      <p>{contenido}</p>
    </div>
  );
}
