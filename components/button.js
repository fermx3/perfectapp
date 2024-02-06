import Link from 'next/link';

import classes from './button.module.scss';

export default function Button({ href, children, ...props }) {
  if (!href) {
    return (
      <button className={classes.button} {...props}>
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
