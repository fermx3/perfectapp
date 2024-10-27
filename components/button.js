import Link from 'next/link';

import classes from './button.module.scss';

export const BUTTON_TYPE_CLASSES = {
  base: 'base',
  secondary: 'secondary',
  link: 'link',
  coloredLink: 'coloredLink',
  icon: 'icon',
  iconDisabled: 'iconDisabled',
  disabled: 'disabled',
  outline: 'outline',
};

const getButton = (buttonType = BUTTON_TYPE_CLASSES.base) =>
  ({
    [BUTTON_TYPE_CLASSES.base]: classes.button,
    [BUTTON_TYPE_CLASSES.secondary]: classes.secondaryButton,
    [BUTTON_TYPE_CLASSES.link]: classes.link,
    [BUTTON_TYPE_CLASSES.coloredLink]: classes.coloredLink,
    [BUTTON_TYPE_CLASSES.icon]: classes.icon,
    [BUTTON_TYPE_CLASSES.outline]: classes.outline,
    [BUTTON_TYPE_CLASSES.iconDisabled]: classes.iconDisabled,
    [BUTTON_TYPE_CLASSES.disabled]: classes.disabledButton,
  }[buttonType]);

export default function Button({ href, children, buttonType, ...props }) {
  const customButton = getButton(buttonType);

  if (customButton === classes.link && !href) {
    return (
      <a {...props} className={customButton}>
        {children}
      </a>
    );
  }

  if (!href) {
    return (
      <button className={customButton} {...props}>
        {children}
      </button>
    );
  }

  return (
    <Link href={href} className={customButton} {...props}>
      {children}
    </Link>
  );
}
