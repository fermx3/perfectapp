import classes from './background-gradient-container.module.scss';

export default function BackgroundGradientContainer({ children }) {
  return <div className={classes.mainContainer}>{children}</div>;
}
