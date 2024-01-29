import Link from 'next/link';

import classes from './button.module.scss';

export default function Button({ href, onClick, children }) {
  if (!href) {
    return (
      <button className={classes.button} onClick={onClick}>
        {children}
      </button>
    );
  }

  return (
    <Link href={href} className={classes.button}>
      {children}
    </Link>
  );
}
