import Link from 'next/link';
import Image from 'next/image';

import { motion } from 'framer-motion';

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
            {link.notificaciones && link.notificaciones.length !== 0 && (
              <motion.p
                className={classes.notificacion}
                variants={{
                  hidden: { opacity: 0, scale: 0 },
                  visible: { opacity: 1, scale: 1 },
                }}
                initial='hidden'
                animate='visible'
                transition={{
                  duration: 0.1,
                  delay: 0.2,
                  type: 'spring',
                  mass: 0.5,
                }}
              >
                {link.notificaciones}
              </motion.p>
            )}
          </Link>
        </div>
      ))}
    </div>
  );
}
