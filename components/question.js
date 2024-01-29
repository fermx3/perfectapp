import Button from './button';

import classes from './question.module.scss';

export default function Question({ question, options }) {
  return (
    <>
      <div className={classes.header}>
        <h2>{question}</h2>
      </div>
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
