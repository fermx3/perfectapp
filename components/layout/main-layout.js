import { Fragment } from 'react';
import MainFooter from './main-footer';
import MainHeader from './main-header';

export default function MainLayout({ children, className }) {
  return (
    <>
      <MainHeader className={className} />
      <main className={className}>{children}</main>
      <MainFooter className={className} />
    </>
  );
}
