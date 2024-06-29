import Image from 'next/image';
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
        {options.map((option, index) => (
          <Button
            key={index}
            href={option.link}
            disabled={option.disabled}
            buttonType={
              option.disabled
                ? BUTTON_TYPE_CLASSES.disabled
                : BUTTON_TYPE_CLASSES[option.buttonType]
            }
            target={option.newPage ? '_blank' : '_self'}
            onClick={option.onClick}
          >
            {option.name && option.name}
            {option.image && <Image src={option.image} fill alt='' />}
            {option.tooltip && <span>{option.tooltip}</span>}
          </Button>
        ))}
      </div>
    </>
  );
}
