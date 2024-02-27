import Image from 'next/image';

import classes from './logo.module.scss';

export default function Logo({ horizontal }) {
  return (
    <div className={horizontal ? classes.horizontalLogo : classes.logo}>
      <Image
        src={'/images/perfect-logo.png'}
        width={80}
        height={80}
        alt='perfect logo'
      />
      <h1>perfect app</h1>
    </div>
  );
}
