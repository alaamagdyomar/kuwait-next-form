import { appLinks, imageSizes } from '@/constants/*';
import Image from 'next/image';
import logo from '@/appImages/logo.png';
import Link from 'next/link';
import { FC } from 'react';
import { useAppSelector } from '@/redux/hooks';

const HeaderLogoSection: FC = (): JSX.Element => {
  const {
    locale: { lang },
    country: {
      id: country_id,
      name: country_name,
      name_ar: country_name_ar,
      currency: country_currency,
    },
  } = useAppSelector((state) => state);
  return (
    <Link
      scroll={true}
      href={{
        pathname: `${appLinks.home.path}`,
        query: {
          country_id,
          country_name,
          country_name_ar,
          country_currency,
        },
      }}
      locale={lang}
      className="flex justify-center col-start-2 col-span-1 cursor-pointer"
    >
      <div className="flex flex-1 justify-center ">
        <Image
          className="h-12 w-auto"
          src={logo}
          alt={`logo`}
          width={imageSizes.xl}
          height={imageSizes.xl}
        />
      </div>
    </Link>
  );
};

export default HeaderLogoSection;
