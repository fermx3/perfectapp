import classes from './input-group.module.scss';

export default function InputGroup({ children }) {
  return <div className={classes.inputGroup}>{children}</div>;
}
