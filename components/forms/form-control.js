import Button from '../button';

import classes from './form-control.module.scss';

export default function FormControl({ id, label, type, onChange, value }) {
  if (type === 'button') {
    return (
      <div className={classes.formControl}>
        <Button>{label}</Button>
      </div>
    );
  }

  return (
    <div className={classes.formControl}>
      <label htmlFor={id}>{label}</label>
      <input type={type} id={id} value={value} onChange={onChange} required />
    </div>
  );
}
