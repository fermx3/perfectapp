import Image from 'next/image';
import classes from './home-footer.module.scss';
import EmailForm from './email-form';
import Link from 'next/link';

export default function HomeFooter() {
  return (
    <div className={classes.footer}>
      <div className={classes.breaker}>
        <Image
          src='/images/home/perfect-logo.png'
          width={1583 / 15}
          height={513 / 15}
          alt=''
        />
        <div className={classes.line} />
      </div>
      <div className={classes.mobileImage}>
        <Image
          src='/images/home/icons/ruta.png'
          width={80}
          height={80}
          alt=''
        />
      </div>
      <div className={classes.footerContent}>
        <div className={classes.col}>
          <h5>SUBSCRÍBETE A NUESTRO NEWSLETTER</h5>
          <EmailForm />
        </div>
        <div className={classes.col}>
          <h5>PÚBLICO CONDESA</h5>
          <p>PUEBLA 403 COLONIA ROMA NORTE, CIUDAD DE MÉXICO, C.P. 06700</p>
        </div>
        <div className={classes.col}>
          <h5>SÍGUENOS</h5>
          <ul>
            <li>
              <Link href='#'>INSTAGRAM</Link>
            </li>
            <li>
              <Link href='#'>LINKEDIN</Link>
            </li>
            <li>
              <Link href='#'>FACEBOOK</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
