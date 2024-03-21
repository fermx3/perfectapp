import classes from './form-section.module.scss';

export default function FormSection({ children, titulo }) {
  return (
    <div className={classes.formSection}>
      <h4>{titulo}</h4>
      {children}
    </div>
  );
}
