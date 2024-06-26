import { FC } from 'react';
import { baseUrl, imageSizes, isLocal, suppressText } from '../constants';
import Head from 'next/head';
import Image from 'next/image';
import logoIcon from 'public/favicon.ico';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';

type Props = {
  title: string;
  description?: string;
  mainImage?: string;
};
const MainHead: FC<Props> = ({
  title = '',
  description = ``,
  mainImage = ``,
}): JSX.Element => {
  const { t } = useTranslation();
  const router = useRouter();
  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="shortcut icon" href={`${logoIcon.src}`} />
        <meta name="name" content={`${title}`} />
        <meta name="title" content={`${title}`} />
        <meta name="logo" content={`${logoIcon.src}`} />
        <meta name="image" content={`${mainImage}`} />
        <meta name="description" content={`${description}`} />
        <meta property="og:type" content={`${title}`} />
        <meta property="description" content={`${description}`} />
        <meta property="og:locale" content={`${router.locale}`} />
        <meta property="og:site_name" content={`Form - فورم`} />
        <meta property="og:url" content={`${baseUrl}`} />
        <meta property="og:title" content={`${title}`} />
        <meta property="og:description" content={`${description}`} />
        <meta property="og:image" content={`${mainImage}`} />
        <meta property="og:image:alt" content={`${title}`} />
        <meta property="og:mobile" content={`96597324128`} />
        <meta property="og:whatsapp" content={`96597324128`} />
        <meta
          itemProp="instagram"
          content={`https://www.instagram.com/lets.form/`}
        />
        <meta
          property="instagram:url"
          content={`https://www.instagram.com/lets.form/`}
        />
        <meta property="instagram:title" content={`${title}`} />
        <meta property="instagram:description" content={`${description}`} />
        <meta property="instagram:image" content={`${mainImage}`} />
      </Head>
      {isLocal && false && (
        <div
          className={`flex p-3 w-1/3 items-center bg-gray-100 rounded-md flex-col`}
          suppressHydrationWarning={suppressText}
        >
          <span
            className={`text-bold underline`}
            suppressHydrationWarning={suppressText}
          >
            ({t('for_dev_use_only')}) :
          </span>
          <span suppressHydrationWarning={suppressText}>
            {t('title')} : {title}
          </span>
          <span suppressHydrationWarning={suppressText}>
            {t('description')} : {description}
          </span>
          <span suppressHydrationWarning={suppressText}>
            {t('image')}
            <Image
              src={mainImage}
              alt={`main_image`}
              className={`w-10 h-auto`}
              width={imageSizes.xl}
              height={imageSizes.xl}
            />
          </span>
        </div>
      )}
    </>
  );
};

export default MainHead;
