import { FC, Suspense } from 'react';
import Link from 'next/link';
import HomeIcon from '@mui/icons-material/Home';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import EventNoteIcon from '@mui/icons-material/EventNote';
import { useTranslation } from 'react-i18next';
import { appLinks, suppressText, withCountryQueryString } from '@/constants/*';
import { useAppSelector } from '@/redux/hooks';
import { isAuthenticated, isVerified } from '@/redux/slices/authSlice';
import { useRouter } from 'next/router';
import LoadingSpinner from '@/components/LoadingSpinner';
import { motion } from 'framer-motion';

const AppFooter: FC = (): JSX.Element => {
  const { country } = useAppSelector((state) => state);
  const { t } = useTranslation();
  const isAuth = useAppSelector(isAuthenticated);
  const verified = useAppSelector(isVerified);
  const router = useRouter();

  const handleGoHome = () => {
    router.replace(`/${withCountryQueryString(country)}`, ``, {
      scroll: false,
    });
  };

  return (
    <Suspense
      fallback={
        <div className={`min-h-screen`}>
          <LoadingSpinner />
        </div>
      }
    >
      <div className="fixed left-0 bottom-0  flex justify-center w-full bg-stone-100 py-5 z-40 ">
        <div className="grid grid-cols-3 gap-x-2 w-full md:w-3/5 xl:w-2/5">
          <div className="flex justify-center">
            <button
              onClick={() => handleGoHome()}
              className={`${
                router.pathname.includes('home') || router.pathname === '/'
                  ? `bg-gray-100 p-2 shadow-sm text-primary_BG`
                  : `text-gray-600 `
              } flex flex-col justify-center items-center w-fit cursor-pointer lg:w-32 mx-2 rounded-md`}
            >
              <div className="w-fit">
                <HomeIcon width="25.099" height="25.099" />
              </div>
              <p
                className="text-xs w-fit pt-1 text-center"
                suppressHydrationWarning={suppressText}
              >
                {t(`home`)}
              </p>
            </button>
          </div>
          <div className="flex justify-center">
            <Link
              scroll={true}
              href={`${
                isAuth && verified
                  ? appLinks.order.path
                  : isAuth && !verified
                  ? appLinks.verificationMobileNo.path
                  : appLinks.login.path
              }`}
              className={`${
                router.pathname.includes('order/history')
                  ? `bg-gray-100 p-2 shadow-sm text-primary_BG`
                  : `text-gray-600 `
              } flex flex-col justify-center items-center w-fit cursor-pointer lg:w-32 mx-2 rounded-md`}
            >
              <div className="w-fit">
                <EventNoteIcon width="25.099" height="25.099" />
              </div>
              <p
                className="text-xs w-fit pt-1 text-center"
                suppressHydrationWarning={suppressText}
              >
                {t(`order_history`)}
              </p>
            </Link>
          </div>
          <div className="flex justify-center">
            <Link
              scroll={true}
              href={isAuth ? appLinks.account.path : appLinks.login.path}
              className={`${
                router.pathname.includes('account') ||
                router.pathname.includes('login')
                  ? `bg-gray-100 p-2 shadow-sm text-primary_BG`
                  : `text-gray-600 `
              } flex flex-col justify-center items-center w-fit cursor-pointer lg:w-32 mx-2 rounded-md`}
            >
              <div className="w-fit">
                <ManageAccountsIcon width="25.099" height="25.099" />
              </div>
              <p
                className="text-xs w-fit pt-1 text-center"
                suppressHydrationWarning={suppressText}
              >
                {t(`account`)}
              </p>
            </Link>
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default AppFooter;
