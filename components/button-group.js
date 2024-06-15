import Button, { BUTTON_TYPE_CLASSES } from './button';

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
          <Button
            href={option.link}
            key={option.name}
            disabled={option.disabled}
            buttonType={
              option.disabled
                ? BUTTON_TYPE_CLASSES.disabled
                : BUTTON_TYPE_CLASSES.base
            }
          >
            {option.name}
          </Button>
        ))}
      </div>
    </>
  );
}
