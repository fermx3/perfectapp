import Link from 'next/link';
import Image from 'next/image';

import classes from './links-group.module.scss';

export default function LinksGroup({ links }) {
  return (
    <div className={classes.linksGroup}>
      {links.map((link, index) => (
        <div
          className={link.link === '#' ? classes.disabledLink : classes.link}
          key={index}
        >
          <Link href={link.link}>
            <Image
              src={'/images/icons/up-right-arrow.png'}
              width={40}
              height={40}
              alt='arrow'
            />
            <h3>0{index + 1}</h3>
            <h2>{link.titulo}</h2>
            <p>{link.desc}</p>
          </Link>
        </div>
      ))}
    </div>
  );
}
