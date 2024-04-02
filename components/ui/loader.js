import classes from './loader.module.scss';

export default function Loader() {
  return (
    <div className={classes.loaderContainer}>
      <div className={classes.loader}></div>
    </div>
  );
}
