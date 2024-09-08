import classes from './form-error.module.scss';

export default function FormError({ children }) {
  return (
    <div className={classes.error}>
      <p>{children}</p>
    </div>
  );
}
