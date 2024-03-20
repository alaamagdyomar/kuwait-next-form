import { FC, Suspense } from 'react';
import React from 'react';
import { slide as Menu } from 'react-burger-menu';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useRouter } from 'next/router';
import SideMenuSkelton from '@/components/sideMenu/SideMenuSkelton';
import Link from 'next/link';
import {
  appLinks,
  imageSizes,
  suppressText,
  withCountryQueryString,
} from '@/constants/*';
import Image from 'next/image';
import logo from '@/appImages/logo.png';
import { hideSideMenu } from '@/redux/slices/appSettingSlice';
import CloseIcon from '@mui/icons-material/Close';
import homeIcon from '@/appIcons/home.svg';
import { lowerCase, map } from 'lodash';
import orderIcon from '@/appIcons/order_history.svg';
import accountIcon from '@/appIcons/account.svg';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import StickyNote2OutlinedIcon from '@mui/icons-material/StickyNote2Outlined';
import { isAuthenticated, isVerified, logout } from '@/redux/slices/authSlice';
import logoutIcon from '@/appIcons/logout.svg';
import rightBlueIcon from '@/appIcons/right_blue_arrow.svg';
import { AppQueryResult } from '@/types/queries';
import { CategoriesType } from '@/types/queries';
import { useGetMainCategoriesQuery } from '@/redux/api/categoryApi';
import { setLocale } from '@/redux/slices/localeSlice';

type Props = {};

const SideMenu: FC<Props> = () => {
  const { locale, appSetting, country } = useAppSelector((state) => state);
  const { data: types, isSuccess } = useGetMainCategoriesQuery<{
    data: AppQueryResult<CategoriesType>;
    isSuccess: boolean;
    error: { error: string; status: string };
  }>({ lang: locale.lang, country: country.id.toString() });

  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const isAuth = useAppSelector(isAuthenticated);
  const verified = useAppSelector(isVerified);
  const router = useRouter();

  const handleChangeLang = async (locale: string) => {
    if (router.pathname.includes('store')) {
      router
        .push(appLinks.category('store', '4', country.id), ``, {
          locale,
          scroll: false,
        })
        .then(() => dispatch(setLocale(locale)));
    }
    await router
      .replace(router.pathname, router.asPath, {
        locale,
        scroll: false,
      })
      .then(() => dispatch(setLocale(locale)));
  };

  const handleLogout = async () => {
    await dispatch(logout());
  };

  const handleGoHome = () => {
    router.push(`/${withCountryQueryString(country)}`, ``, {
      scroll: false,
    });
  };

  return (
    <Suspense fallback={<SideMenuSkelton />}>
      <Menu
        right={router.locale === 'ar'}
        isOpen={appSetting.sideMenuOpen}
        className="w-full bg-white"
        itemListClassName="overflow-auto"
        customBurgerIcon={false}
        customCrossIcon={false}
      >
        <div
          style={{ display: 'flex' }}
          className="flex-col justify-between  bg-white h-full outline-none"
        >
          {isSuccess ? (
            <div>
              <header className="px-6">
                <div className="flex gap-x-2 py-5">
                  <button
                    onClick={() => handleGoHome()}
                    className="w-full flex justify-center items-start"
                  >
                    <Image
                      alt={`logo`}
                      width={imageSizes.xl}
                      height={imageSizes.xl}
                      className="h-10 w-auto"
                      src={logo}
                    />
                  </button>
                  <p
                    className="cursor-pointer"
                    id="CloseMenuBtn"
                    onClick={() => dispatch(hideSideMenu(undefined))}
                    suppressHydrationWarning={suppressText}
                  >
                    <CloseIcon fontSize="small" className={`h-4 w-4`} />
                  </p>
                </div>
              </header>

              <div className="my-3 px-6">
                <>
                  <div className="flex pb-7 items-center cursor-pointer">
                    <Link scroll={true} href={appLinks.root.path}>
                      <Image
                        src={homeIcon}
                        width={imageSizes.xl}
                        height={imageSizes.xl}
                        className={`h-6 w-6`}
                        alt={`home`}
                      />
                    </Link>
                    <div className="ltr:pl-5 rtl:pr-5 pt-1">
                      <button
                        onClick={() => handleGoHome()}
                        suppressHydrationWarning={suppressText}
                      >
                        {t('home')}
                      </button>
                    </div>
                  </div>
                  {isSuccess &&
                    map(types.data.types, (t, i) => (
                      <Link
                        scroll={true}
                        href={`${appLinks.category(
                          lowerCase(t.name),
                          t.id.toString(),
                          country.id
                        )}`}
                        key={i}
                        className="flex gap-x-5 pb-7 items-center cursor-pointer"
                      >
                        <div>
                          <Image
                            className="h-6 w-6 object-contain"
                            src={t.image}
                            fill={false}
                            width={imageSizes.xl}
                            height={imageSizes.xl}
                            alt={t.name}
                          />
                        </div>
                        <div>
                          <p suppressHydrationWarning={suppressText}>
                            {t.name}
                          </p>
                        </div>
                      </Link>
                    ))}
                  <Link
                    scroll={true}
                    href={`${
                      isAuth && verified
                        ? appLinks.order.path
                        : isAuth
                        ? `#`
                        : appLinks.login.path
                    }`}
                  >
                    <div className="flex pb-7 items-center cursor-pointer">
                      <div>
                        <Image
                          src={orderIcon}
                          width={imageSizes.xl}
                          height={imageSizes.xl}
                          alt={`order_history`}
                          className={`h-6 w-6 text-gray-500`}
                        />
                      </div>
                      <div className="ltr:pl-5 rtl:pr-5">
                        <span suppressHydrationWarning={suppressText}>
                          {t('order_history')}
                        </span>
                      </div>
                    </div>
                  </Link>
                  <Link
                    scroll={true}
                    href={`${
                      isAuth ? appLinks.account.path : appLinks.login.path
                    }`}
                  >
                    <div className="flex pb-7 items-center cursor-pointer">
                      <div>
                        <Image
                          src={accountIcon}
                          width={imageSizes.xl}
                          height={imageSizes.xl}
                          alt={`order_history`}
                          className={`h-6 w-6`}
                        />
                      </div>
                      <div className="ltr:pl-5 rtl:pr-5">
                        <span suppressHydrationWarning={suppressText}>
                          {t('account_settings')}
                        </span>
                      </div>
                    </div>
                  </Link>
                  <Link scroll={true} href={appLinks.about.path}>
                    <div className="flex pb-7 items-center cursor-pointer">
                      <div>
                        <InfoOutlinedIcon
                          sx={{ color: '#189EC9' }}
                          width="20.111"
                          height="20.111"
                        />
                      </div>
                      <div className="ltr:pl-5 rtl:pr-5">
                        <span suppressHydrationWarning={suppressText}>
                          {t('about_us')}
                        </span>
                      </div>
                    </div>
                  </Link>
                  <Link scroll={true} href={appLinks.terms.path}>
                    <div className="flex pb-7 items-center cursor-pointer">
                      <div>
                        <StickyNote2OutlinedIcon
                          sx={{ color: '#189EC9' }}
                          width="20.111"
                          height="20.111"
                        />
                      </div>
                      <div className="ltr:pl-5 rtl:pr-5">
                        <span suppressHydrationWarning={suppressText}>
                          {t('terms_and_conditions')}
                        </span>
                      </div>
                    </div>
                  </Link>
                </>
              </div>
              <footer className={`w-full`}>
                <div className="flex w-full flex-col bg-gray-100 rounded-t-xl px-6 py-5 h-full">
                  {isAuth ? (
                    <div
                      onClick={() => handleLogout()}
                      className="flex items-center mb-5 cursor-pointer"
                    >
                      <div>
                        <Image
                          src={logoutIcon}
                          width={imageSizes.xl}
                          height={imageSizes.xl}
                          alt={`logout`}
                          className={`h-6 h-6`}
                        />
                      </div>
                      <p
                        className="mx-2 text-primary_BG"
                        suppressHydrationWarning={suppressText}
                      >
                        {t('logout')}
                      </p>
                    </div>
                  ) : (
                    <div
                      className="flex justify-between  mb-5 "
                      id="Logged Out"
                    >
                      <Link
                        scroll={true}
                        href={appLinks.login.path}
                        className="flex justify-between items-center  w-full cursor-pointer"
                      >
                        <div className="flex-grow text-primary_BG">
                          <span suppressHydrationWarning={suppressText}>
                            {t('log_in')}
                          </span>
                        </div>
                        <div>
                          <Image
                            src={rightBlueIcon}
                            width={imageSizes.xl}
                            height={imageSizes.xl}
                            alt={`login`}
                            className={`${
                              locale.isRTL && `rotate-180`
                            } h-4 w-4`}
                          />
                        </div>
                      </Link>
                    </div>
                  )}

                  <div className="bg-primary_BG text-white rounded-lg flex justify-center items-center w-1/3">
                    <button
                      onClick={() => handleChangeLang('ar')}
                      className={`rtl:bg-DarkBlue ltr:bg-transparent py-1 rounded-lg  text-center w-1/2`}
                      suppressHydrationWarning={suppressText}
                    >
                      ع
                    </button>
                    <button
                      onClick={() => handleChangeLang('en')}
                      className={`ltr:bg-DarkBlue ltr:py-1 rtl:bg-transparent rtl:py-0 rounded-lg  text-center w-1/2 pt-1`}
                      suppressHydrationWarning={suppressText}
                    >
                      EN
                    </button>
                  </div>
                </div>
              </footer>
            </div>
          ) : (
            <SideMenuSkelton />
          )}
        </div>
        <div
          className={`relative bottom-0 flex justify-center items-center`}
          suppressHydrationWarning={suppressText}
        >
          <p
            className={`text-stone-200 text-center`}
            suppressHydrationWarning={suppressText}
          >
            v. {process.env.NEXT_PUBLIC_APP_VERSION}
          </p>
        </div>
      </Menu>
    </Suspense>
  );
};

export default SideMenu;
