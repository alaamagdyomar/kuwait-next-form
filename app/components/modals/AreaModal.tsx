import React, { FC, Suspense } from 'react';
import { Modal } from 'flowbite-react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { hideAreaModal } from '@/redux/slices/appSettingSlice';
import { RootState } from '@/redux/store';
import { useGetAllAreasQuery } from '@/redux/api/countryApi';
import { map } from 'lodash';
import ArrowLeftIcon from '@/appIcons/left_arrow.svg';
import Image from 'next/image';
import { AppQueryResult, Area } from '@/types/queries';
import { setSearchArea } from '@/redux/slices/searchParamsSlice';
import { imageSizes, suppressText } from '@/constants/*';

const AreaModal: FC = () => {
  const { t } = useTranslation();
  const {
    appSetting: { showAreaModal },
    locale: { lang, dir, isRTL },
    country: { id: country },
  } = useAppSelector<RootState>((state) => state);
  const dispatch = useAppDispatch();
  const { data: areas, isSuccess } = useGetAllAreasQuery<{
    data: AppQueryResult<Area[]>;
    isSuccess: boolean;
  }>({
    locale: lang,
    country,
    params: { type: 'venue' }, // type is hardcoded (what if arabic word ? !)
  });
  const handleClick = (a: Area) => dispatch(setSearchArea(a));

  return (
    <Suspense>
      <Modal
        show={showAreaModal}
        onClose={() => dispatch(hideAreaModal())}
        dir={dir}
      >
        <Modal.Header>
          <div className={`capitalize`} suppressHydrationWarning={suppressText}>
            {t('select_area')}
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="flex flex-col w-full divide-y divide-gray-100">
            {isSuccess &&
              map(areas.data, (a: Area, i) => (
                <button
                  key={i}
                  onClick={() => handleClick(a)}
                  className={`flex w-full flex-row justify-between items-center p-3 capitalize`}
                >
                  <div className={`text-black`}>{a.name}</div>
                  <div>
                    <Image
                      src={ArrowLeftIcon}
                      alt={`left-arrow`}
                      width={imageSizes.xl}
                      height={imageSizes.xl}
                      className={`${
                        !isRTL && `rotate-180`
                      } w-3 h-3 text-primary_BG`}
                    />
                  </div>
                </button>
              ))}
          </div>
        </Modal.Body>
      </Modal>
    </Suspense>
  );
};

export default AreaModal;
