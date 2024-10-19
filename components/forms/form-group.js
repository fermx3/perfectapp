import classes from './form-group.module.scss';

export default function FormGroup({ children, titulo, locked }) {
  return (
    <div className={locked ? classes.lockedContainer : classes.container}>
      {titulo && <h4>{titulo}</h4>}
      {children}
    </div>
  );
}
