import Autoplay from 'embla-carousel-autoplay';
import { DotButton, useDotButton } from './dot-button';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';

import classes from './carousel.module.scss';
import Link from 'next/link';

const Carousel = (props) => {
  const { slides, options, requisitos } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [Autoplay()]);

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);

  return (
    <section className='embla'>
      <div className='embla__viewport' ref={emblaRef}>
        <div className='embla__container'>
          {slides.map((slide, index) => {
            const compareIfTheKeyExistAndIsTrue = (obj, source) => {
              for (let key in source) {
                if (obj[key] === source[key]) return false;
              }
              return true;
            };

            if (slide.requisitosToShow) {
              {
                /* console.log(
                slide.alt,
                compareIfTheKeyExistAndIsTrue(
                  slide.requisitosToShow,
                  requisitos
                )
              ); */
              }

              if (
                !compareIfTheKeyExistAndIsTrue(
                  slide.requisitosToShow,
                  requisitos
                )
              )
                return;
            }

            return (
              <>
                {slide.url ? (
                  <div className='embla__slide' key={index}>
                    <Link href={slide.url}>
                      <div className={classes.imageContainer}>
                        <Image src={slide.src} alt={slide.alt} fill priority />
                      </div>
                    </Link>
                  </div>
                ) : (
                  <div className='embla__slide' key={index}>
                    <div className={classes.imageContainer}>
                      <Image src={slide.src} alt={slide.alt} fill priority />
                    </div>
                  </div>
                )}
              </>
            );
          })}
        </div>
      </div>

      <div className='embla__controls'>
        <div className='embla__dots'>
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={'embla__dot'.concat(
                index === selectedIndex ? ' embla__dot--selected' : ''
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Carousel;
