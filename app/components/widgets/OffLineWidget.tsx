import React, { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { imageSizes, submitBtnClass, suppressText } from '@/constants/*';
import { useTranslation } from 'react-i18next';
import { isNull } from 'lodash';

type Props = {
  message: string;
  img?: string;
};
const OffLineWidget: FC<Props> = ({ message, img = null }): JSX.Element => {
  const { t } = useTranslation();
  return (
    <div
      className={`flex w-full flex-col justify-center items-center space-y-10 mt-10`}
    >
      {!isNull(img) ? (
        <Image
          className="w-2/3 h-auto"
          alt="404_error"
          fill={false}
          width={imageSizes.lg}
          height={imageSizes.lg}
          src={img}
        />
      ) : (
        <Image
          className="w-2/3 h-auto"
          alt="offline"
          fill={false}
          width={imageSizes.lg}
          height={imageSizes.lg}
          src={require('@/appImages/no_results_found.jpg')}
        />
      )}
      <p
        className={`text-lg text-center`}
        suppressHydrationWarning={suppressText}
      >
        {t(message)}
      </p>
      <Link
        scroll={true}
        href={'/'}
        className={`${submitBtnClass} text-center text-md capitalize`}
        suppressHydrationWarning={suppressText}
      >
        {t('back_to_home')}
      </Link>
    </div>
  );
};

export default OffLineWidget;
