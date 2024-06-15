import Button from './button';
import Container from './layout/container';

import classes from './button-group.module.scss';

export default function ButtonGroup({ title, options }) {
  return (
    <>
      {title && (
        <div className={classes.header}>
          <h2>{title}</h2>
        </div>
      )}
      <div className={classes.buttonGroup}>
        {options.map((option) => (
          <Button href={option.link} key={option.name}>
            {option.name}
          </Button>
        ))}
      </div>
    </>
  );
}
