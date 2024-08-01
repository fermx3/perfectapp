import MainFooter from './main-footer';
import MainHeader from './main-header';

import classes from './main-layout.module.scss';

export default function MainLayout({ children, className }) {
  return (
    <div className={classes.layout}>
      <MainHeader className={className} />
      <main className={className}>{children}</main>
      <MainFooter className={className} />
    </div>
  );
}
