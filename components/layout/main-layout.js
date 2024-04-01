import MainFooter from './main-footer';
import MainHeader from './main-header';

export default function MainLayout({ children }) {
  return (
    <>
      <MainHeader />
      <main>{children}</main>
      <MainFooter />
    </>
  );
}
