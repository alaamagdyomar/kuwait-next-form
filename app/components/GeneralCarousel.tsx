import React, { FC } from 'react';
import Carousel from 'react-material-ui-carousel';
import Image from 'next/image';
import { map } from 'lodash';
import ImageNotFound from '@/appImages/image_not_found.png';
import { imageSizes, suppressText } from '../constants';
import { useTranslation } from 'react-i18next';
import LogoImage from '@/appImages/logo.png';
import { slide } from 'react-burger-menu';

type Props = {
  slides: any;
  cover?: boolean;
  h?: string;
  w?: string;
};
const GeneralCarousel: FC<Props> = ({
  slides = [],
  h = `8rem`,
  w = `w-full`,
  cover = true,
}): JSX.Element => {
  const { t } = useTranslation();
  return (
    <div
      className={`flex flex-1 justify-center items-center  my-3 w-full h-auto`}
    >
      {slides.length === 0 ? (
        <div className="flex justify-center h-full">
          <Image
            alt={`${t('not_found')}`}
            className="h-full rounded-md"
            src={ImageNotFound}
            width={imageSizes.xl}
            height={imageSizes.xl}
            suppressHydrationWarning={suppressText}
            placeholder={`blur`}
            blurDataURL={`./app/assets/images/logo.png`}
            sizes="(max-width: 768px) 100vw,
                          (max-width: 1200px) 50vw,
                          33vw"
          />
        </div>
      ) : (
        <Carousel
          className={`${w}`}
          navButtonsAlwaysInvisible={true}
          height={h}
          indicatorIconButtonProps={{
            style: {
              padding: '1px', 
              color: 'lightgray'    
            },
          }}
          activeIndicatorIconButtonProps={{
            style: {
              padding: '0.5px', 
              fontSize: '1px',
              color: '#189EC9'
            },
          }}
          indicatorContainerProps={{
            style: {
              marginTop: '2px', // 5
            },
          }}
          indicators={slides.length > 1}
          autoPlay={true}
        >
          {map(slides, (img, i) => (
            <Image
              key={i}
              // className={`${
              //   cover ? `object-cover` : `object-contain`
              // } w-full h-auto rounded-md`}
              className={`h-full w-full rounded-lg`}
              src={img}
              alt={`${t('slides')}`}
              fill={true}
              sizes="(max-width: 768px) 100vw,
                      (max-width: 1200px) 50vw,
                      33vw"
              suppressHydrationWarning={suppressText}
            />
          ))}
        </Carousel>
      )}
    </div>
  );
};

export default GeneralCarousel;
