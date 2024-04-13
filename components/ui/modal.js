import classes from './modal.module.scss';

export default function Modal({ children }) {
  return <div className={classes.modal}>{children}</div>;
}
