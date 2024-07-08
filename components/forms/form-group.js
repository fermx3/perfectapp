import classes from './form-group.module.scss';

export default function FormGroup({ children, titulo }) {
  return (
    <div className={classes.container}>
      {titulo && <h4>{titulo}</h4>}
      {children}
    </div>
  );
}
