import { Product } from '@/types/index';
import Image from 'next/image';
import { FC } from 'react';
import Link from 'next/link';
import { useAppSelector } from '@/redux/hooks';
import {
  appLinks,
  imageSizes,
  logoImageBase64,
  splitPrice,
  suppressText,
} from '@/constants/*';
import { kebabCase } from 'lodash';
import { useTranslation } from 'react-i18next';

type Props = {
  element: Product;
  width?: string;
};
const HorProductWidget: FC<Props> = ({
  element,
  width = `w-full`,
}): JSX.Element => {
  const { t } = useTranslation();
  const { price, currency } = splitPrice(element.price.toString());
  const {
    locale,
    country: { id },
  } = useAppSelector((state) => state);

  return (
    <div
      dir={locale.dir}
      className={`${width} bg-white rounded-lg shadow-sm border-[1px] border-gray-100 border-r`}
    >
      <Link
        scroll={true}
        href={`/country/${id}${appLinks.productShow.path}${element.id}?id=${
          element.id
        }&slug=${kebabCase(element.name)}`}
        locale={locale.lang}
      >
        <Image
          className="rounded-t-lg w-full h-40 object-cover"
          src={element.image}
          fill={false}
          width={imageSizes.xl}
          height={imageSizes.xl}
          alt="product image"
          // onError={({ currentTarget }) => {
          //   // currentTarget.onerror = null; // prevents looping
          //   // currentTarget.src = '/static/media/image_loader.ff4df4b2.gif';
          // }}
          placeholder="blur"
          blurDataURL={logoImageBase64}
        />
      </Link>
      <div className="rounded-b-lg h-22">
        <Link
          scroll={true}
          href={`/country/${id}${appLinks.productShow.path}${element.id}?id=${
            element.id
          }&slug=${kebabCase(element.name)}`}
          className={`flex flex-col ltr:text-left rtl:text-right p-2 space-y-2`}
        >
          <span className="text-xs tracking-tight dark:text-white truncate">
            {element.name}
          </span>
          {element.categories && (
            <span className="text-xs text-gray-400 dark:text-gray-400  tracking-tight dark:text-white truncate">
              {element.categories}
            </span>
          )}
        </Link>

        <Link
          scroll={true}
          href={`/country/${id}${appLinks.productShow.path}${element.id}?id=${
            element.id
          }&slug=${kebabCase(element.name)}`}
          className="flex items-center justify-between bg-primary_BG hover:bg-primary_BG/90 rounded-b-lg"
        >
          <div
            className="text-sm font-bold text-white dark:text-white px-2"
            suppressHydrationWarning={suppressText}
          >
            {price} {t(`${currency}`)}
          </div>
          <span className="text-white rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            +
          </span>
        </Link>
      </div>
    </div>
  );
};

export default HorProductWidget;
