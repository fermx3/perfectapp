import classes from './section.module.scss';

export const SECTION_TYPE_CLASSES = {
  base: 'base',
  secondary: 'secondary',
  gradient: 'gradient',
};

const getSection = (sectionType = SECTION_TYPE_CLASSES.base) =>
  ({
    [SECTION_TYPE_CLASSES.base]: classes.section,
    [SECTION_TYPE_CLASSES.secondary]: classes.secondarySection,
    [SECTION_TYPE_CLASSES.gradient]: classes.gradientSection,
  }[sectionType]);

export default function HomeSection({ children, id, sectionType }) {
  const customSection = getSection(sectionType);

  return (
    <section className={customSection} id={id}>
      {children}
    </section>
  );
}
