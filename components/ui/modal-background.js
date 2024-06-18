import classes from './modal-background.module.scss';

export default function ModalBackground({ children }) {
  return <div className={classes.modalBackground}>{children}</div>;
}
