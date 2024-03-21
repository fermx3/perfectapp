import ReactSwitch from 'react-switch';
import Button from '../button';

import classes from './form-control.module.scss';

export default function FormControl({
  id,
  label,
  type,
  onChange,
  value,
  options,
  defaultOption,
}) {
  if (type === 'button') {
    return (
      <div className={classes.formControl}>
        <Button>{label}</Button>
      </div>
    );
  }

  if (type === 'select') {
    return (
      <div className={classes.formControl}>
        <label htmlFor={id}>{label}</label>
        <select onChange={onChange}>
          {defaultOption && (
            <option value='' selected disabled hidden>
              {defaultOption}
            </option>
          )}
          {options.map((object) => {
            return (
              <option value={object} key={object}>
                {object}
              </option>
            );
          })}
        </select>
      </div>
    );
  }

  if (type === 'textarea') {
    return (
      <div className={classes.textArea}>
        <label htmlFor={id}>{label}</label>
        <textarea id={id} value={value} onChange={onChange} rows='4' required />
      </div>
    );
  }

  if (type === 'switch') {
    return (
      <div className={classes.formControl}>
        <label htmlFor={id}>{label}</label>
        <ReactSwitch id={id} checked={value} onChange={onChange} />
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
