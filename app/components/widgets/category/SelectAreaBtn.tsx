import React, { FC, Suspense } from 'react';
import { motion } from 'framer-motion';
import { grayBtnClass, imageSizes, suppressText } from '@/constants/*';
import { showAreaModal } from '@/redux/slices/appSettingSlice';
import { removeSearchArea } from '@/redux/slices/searchParamsSlice';
import Image from 'next/image';
import SelectedAreaIcon from '@/appIcons/white_area.svg';
import AreasIcon from '@/appIcons/areas.svg';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { XMarkIcon } from '@heroicons/react/24/solid';

const SelectAreaBtn: FC = (): JSX.Element => {
  const { t } = useTranslation();
  const {
    searchParams: { searchArea },
  } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  return (
    <Suspense>
      {searchArea.name ? (
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 1 }}
          className={
            'grid grid-rows-2 gap-y-2 rounded-xl shadow-custome bg-primary_BG p-3 h-32 drop-shadow-sm'
          }
        >
          <div>
            <div className="text-white text-sm drop-shadow-sm">
              <div className="flex justify-between items-center w-full">
                <p>{searchArea.name}</p>
                <button
                  onClick={() => {
                    dispatch(removeSearchArea());
                  }}
                  className={`text-sm ${grayBtnClass} text-white pt-1 bg-TransparentWhite border-0 w-6 h-6 flex items-center rounded-full`}
                  suppressHydrationWarning={suppressText}
                >
                  <XMarkIcon className={`w-6 h-6 text-white drop-shadow-sm`} />
                </button>
              </div>
              <p suppressHydrationWarning={suppressText}>
                {t('area_selected')}
              </p>
            </div>
          </div>

          <div className="flex justify-between items-end">
            <div className="flex flex-col">
              <button
                onClick={() => dispatch(showAreaModal(undefined))}
                className={`${grayBtnClass} text-white text-xs bg-TransparentWhite border-0 mb-2`}
                suppressHydrationWarning={suppressText}
              >
                {t('change')}
              </button>
            </div>
            <Image
              src={SelectedAreaIcon}
              width={imageSizes.xl}
              height={imageSizes.xl}
              fill={false}
              alt={`sports`}
              className={`w-12 h-12`}
            />
          </div>
        </motion.div>
      ) : (
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 1 }}
          className={
            'relative rounded-xl col-span-1 p-8 shadow-lg flex flex-col xl:flex-row items-center justify-center xl:justify-between cursor-pointer  border border-gray-100 h-32 drop-shadow-sm'
          }
        >
          <div className="flex items-center justify-center w-auto px-2 h-6 absolute end-4 top-4 bg-stone-100 border border-stone-200 rounded-full">
            <span className={`text-xs text-center  pt-[4px]`}>
              {t('optional')}
            </span>
          </div>
          <button
            onClick={() => dispatch(showAreaModal(undefined))}
            className={`flex flex-col space-y-2 justify-center items-center flex-1 drop-shadow-sm mt-5`}
          >
            <div className={``}>
              <Image
                src={AreasIcon}
                width={imageSizes.xl}
                height={imageSizes.xl}
                fill={false}
                alt={`sports`}
                className={`w-12 h-12`}
              />
            </div>
            <div className="flex mx-auto items-center px-2 pt-1 text-sm">
              <span
                suppressHydrationWarning={suppressText}
                className={`capitalize`}
              >
                {t('select_area')}
              </span>
              {/* <Image
                  src={router.locale === 'ar' ? LeftArrow : RightArrow}
                  fill={false}
                  className={`w-3 h-3 md:w-5 md:h-5 object-contain`}
                  alt={`arrow`}
                  /> */}
              {/* {searchArea && <span>{searchArea.name}</span>} */}
            </div>
          </button>
        </motion.div>
      )}
    </Suspense>
  );
};

export default SelectAreaBtn;
