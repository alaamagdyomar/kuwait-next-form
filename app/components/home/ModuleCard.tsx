import React, { FC } from 'react';
import blueRightIcon from '@/appIcons/right_blue_arrow.svg';
import Image from 'next/image';
import Link from 'next/link';
import { Category } from '@/types/queries';
import { lowerCase } from 'lodash';
import { appLinks, imageSizes } from '@/constants/*';
import { useAppSelector } from '@/redux/hooks';
import { useRouter } from 'next/router';

type Props = {
  category: Category;
  active?: boolean;
};
const ModuleCard: FC<Props> = ({ category, active = false }): JSX.Element => {
  const {
    country: { id },
  } = useAppSelector((state) => state);
  return (
    <Link
      scroll={true}
      href={`${appLinks.category(lowerCase(category.name), category.id, id)}`}
      className={`relative border rounded-xl flex flex-col items-center cursor-pointer p-3 odd:last:col-start-1 shadow-md drop-shadow-md`}
    >
      <div className="h-12  mt-3">
        <Image
          className="h-12 w-auto object-contain"
          src={`${category.image}`}
          alt={category.name}
          width={imageSizes.xl}
          height={imageSizes.xl}
        />
      </div>
      <div className="flex justify-between items-center px-2 pt-3 text-sm">
        <p className="pt-2 text-md">{category.name}</p>
      </div>

      {active && (
        <div className="absolute ltr:right-2 rtl:left-2 top-2">
          <Image
            src={blueRightIcon}
            width={imageSizes.xl}
            height={imageSizes.xl}
            alt={`checkbox`}
            className={`h-2 w-2`}
          />
        </div>
      )}
    </Link>
  );
};

export default ModuleCard;
