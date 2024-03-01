import classes from './error-message.module.scss';

export default function ErrorMessage({ error }) {
  return <p className={classes.error}>{error}</p>;
}
