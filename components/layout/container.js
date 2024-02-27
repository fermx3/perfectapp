import classes from './container.module.scss';

export default function Container({ children, md }) {
  return (
    <div className={md ? classes.containerMD : classes.container}>
      {children}
    </div>
  );
}
