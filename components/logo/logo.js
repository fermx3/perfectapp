import Image from 'next/image';

import classes from './logo.module.scss';

export default function Logo({ priority }) {
  return (
    <div className={classes.logo}>
      <Image
        src={'/images/perfect-logo.png'}
        width={300}
        height={97}
        alt='perfectapp logo'
        priority={priority}
      />
    </div>
  );
}
