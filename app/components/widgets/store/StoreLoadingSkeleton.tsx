import { FC } from 'react';
import { map, range } from 'lodash';
import { useTranslation } from 'react-i18next';
import { suppressText } from '@/constants/*';

const StoreLoadingSkeleton: FC = (): JSX.Element => {
  const {t} = useTranslation();
  return (
    <div role="status" className="animate-pulse">
      <div className="flex flex-1 justify-start items-center mt-4">
        <div className="w-20 h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 mr-3"></div>
        <div className="w-24 h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 mr-3"></div>
        <div className="w-24 h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 mr-3"></div>
        <div className="w-24 h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 mr-3"></div>
        <div className="w-24 h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 mr-3"></div>
      </div>

      <div
        role="status"
        className="p-4 mt-4 w-full rounded border border-gray-200 shadow animate-pulse md:p-6 dark:border-gray-700"
      >
        <div className="flex justify-center items-center mb-4 h-40 bg-gray-300 rounded dark:bg-gray-700">
          <svg
            className="w-12 h-12 text-gray-200 dark:text-gray-600"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 640 512"
          >
            <path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" />
          </svg>
        </div>
        <span className="sr-only" suppressHydrationWarning={suppressText}>{t('loading...')}</span>
      </div>

      <div className="flex flex-1 flex-col lg:flex-row  max-w-full items-center justify-between border-2 mt-4 space-x-3 space-y-3 overflow-hidden">
        {map(range(0, 3), (i) => (
          <div
            key={i}
            role="status"
            className="mx-2 w-full lg:w-1/3 rounded border border-gray-200 shadow animate-pulse md:p-2 dark:border-gray-700"
          >
            <div className="flex justify-center items-center mb-4 h-36 bg-gray-300 rounded dark:bg-gray-700">
              <svg
                className="w-10 h-10 text-gray-200 dark:text-gray-600"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 640 512"
              >
                <path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" />
              </svg>
            </div>
            <div className="w-auto h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-20 mb-4"></div>
            <div className="w-auto h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
            <div className="w-auto h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
            <div className="w-auto h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
            <div className="flex items-center mt-4 space-x-3">
              <svg
                className="w-14 h-14 text-gray-200 dark:text-gray-700"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <div>
                <div className="w-auto h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-20 mb-2"></div>
                <div className="w-auto h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
              </div>
            </div>
            <span className="sr-only" suppressHydrationWarning={suppressText}>{t('loading...')}</span>
          </div>
        ))}
      </div>
      <span className="sr-only">{t('loading...')}</span>
    </div>
  );
};

export default StoreLoadingSkeleton;
