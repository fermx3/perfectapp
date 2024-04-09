import classes from './form-control.module.scss';

export const INPUT_TYPE_CLASSES = {
  base: 'base',
  login: 'login',
  fullWidth: 'fullWidh',
};

const getInput = (inputType = INPUT_TYPE_CLASSES.base) =>
  ({
    [INPUT_TYPE_CLASSES.base]: classes.formControl,
    [INPUT_TYPE_CLASSES.login]: classes.login,
    [INPUT_TYPE_CLASSES.fullWidth]: classes.fullWidth,
  }[inputType]);

export default function FormControl({
  children,
  inputType,
  prefix,
  label,
  unit,
}) {
  const customInput = getInput(inputType);

  return (
    <div className={customInput}>
      {label && <label>{label}</label>}
      {prefix && <p>{prefix}</p>}
      {children}
      {unit && <p>{unit}</p>}
    </div>
  );
}
