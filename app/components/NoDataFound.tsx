import Image from 'next/image';
import NoResultImage from '@/appImages/not_found.gif';
import NoOrder from '@/appImages/no_order.jpg';
import NoOrderFound from '@/appImages/no_order_found.jpg';
import { imageSizes, suppressText } from '@/constants/*';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  title: string;
  listSrc?: boolean;
};
const NoDataFound: FC<Props> = ({ title, listSrc = false }) => {
  const { t } = useTranslation();
  return (
    <div className="my-14">
      <div className="text-center flex justify-center">
        <div className="text-center">
          <Image
            src={listSrc ? NoOrderFound : NoResultImage}
            alt="no result"
            className={`w-80 h-auto`}
            width={imageSizes.xl}
            height={imageSizes.xl}
          />
          <p suppressHydrationWarning={suppressText}>{t(title)}</p>
        </div>
      </div>
    </div>
  );
};

export default NoDataFound;
