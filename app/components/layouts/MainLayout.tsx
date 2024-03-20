import { FC, ReactNode, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import i18n from 'i18next';
import { useRouter } from 'next/router';
import {
  hideCart,
  hideSideMenu,
  showCart,
} from '@/redux/slices/appSettingSlice';
import { setApiCountry, tajwalFont } from '@/constants/*';
import { setLocale } from '@/redux/slices/localeSlice';
import moment from 'moment';
import dynamic from 'next/dynamic';
import { isAuthenticated } from '@/redux/slices/authSlice';
import { useLazyGetCartProductsQuery } from '@/redux/api/cartApi';
import * as yup from 'yup';

const ToastAppContainer = dynamic(
  () => import(`@/components/ToastAppContainer`),
  {
    ssr: false,
  }
);
// import AppHeader from '@/components/AppHeader';
const AppHeader = dynamic(async () => await import(`@/components/AppHeader`), {
  ssr: false,
});
// import AppFooter from '@/components/AppFooter';
const AppFooter = dynamic(async () => await import(`@/components/AppFooter`), {
  ssr: false,
});

type Props = {
  children: ReactNode | undefined;
  // showCart?: boolean;
};

type Handler = (...evts: any[]) => void;

const MainLayout: FC<Props> = ({ children }): JSX.Element => {
  const {
    appSetting,
    locale,
    country,
    auth: {
      user: { id: user_id },
    },
    cart: { currentMode },
  } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const isAuth = useAppSelector(isAuthenticated);
  const router = useRouter();
  const [triggerRefetchCart] = useLazyGetCartProductsQuery();
  useEffect(() => {
    const handleRouteChange: Handler = (url, { shallow }) => {
      dispatch(hideSideMenu());
      // show cart icon only in store module
      console.log('url in kdsnhc', router.pathname);
      if (
        router.pathname.includes('store') ||
        router.pathname.includes('vendor') ||
        router.pathname.includes('product') ||
        (router.pathname.includes('appointment') &&
          currentMode === 'product') ||
        (router.pathname.includes('appointment') && currentMode === 'product')
      ) {
        dispatch(showCart());
      } else {
        dispatch(hideCart());
      }
    };
    const handleChangeComplete: Handler = (url, { shallow }) => {
      if (appSetting.sideMenuOpen) {
        dispatch(hideSideMenu());
      }
    };

    const beforeUnLoad = () => {
      if (router.asPath.includes('payment') || router.asPath.includes('cart')) {
        // do nothing
      } else if (router.asPath.includes('home') || router.asPath === '/') {
        dispatch({ type: `resetEntireApp` });
      } else {
        dispatch({ type: `resetApp` });
      }
      router.reload();
    };

    const handleRouteChangeError = (err: any) => {};
    router.events.on('routeChangeError', handleRouteChangeError);
    router.events.on('routeChangeStart', handleRouteChange);
    router.events.on('routeChangeComplete', handleChangeComplete);
    window.addEventListener('beforeunload', beforeUnLoad);
    return () => {
      window.removeEventListener('beforeunload', beforeUnLoad);
      router.events.off('routeChangeStart', handleRouteChange);
      router.events.off('routeChangeComplete', handleChangeComplete);
      router.events.off('routeChangeError', handleRouteChangeError);
    };
  }, [router.pathname]);

  useEffect(() => {
    if (router.locale !== locale.lang) {
      dispatch(setLocale(router.locale));
    }
    if (router.locale !== i18n.language) {
      i18n.changeLanguage(router.locale);
    }
    moment.locale(router.locale);
    yup.setLocale({
      mixed: {
        required: 'validation.required',
      },
      number: {
        min: ({ min }) => ({ key: 'validation.min', values: { min } }),
        max: ({ max }) => ({ key: 'validation.max', values: { max } }),
      },
      string: {
        email: 'validation.email',
        min: ({ min }) => ({ key: `validation.min`, values: min }),
        max: ({ max }) => ({ key: 'validation.max', values: max }),
        matches: 'validation.matches',
      },
    });
  }, [router.locale]);

  useEffect(() => {
    setApiCountry(JSON.stringify(country));
  }, [country]);

  useEffect(() => {
    if (isAuth) {
      triggerRefetchCart({
        params: { user_id },
        lang: locale.lang,
        country: country.id.toString(),
      });
    }
  }, [isAuth]);

  return (
    <div
      dir={router.locale === 'ar' ? 'rtl' : 'ltr'}
      className={`${tajwalFont} flex flex-col justify-start items-center min-h-screen scroll-smooth hover:scroll-auto [&>*]:capitalize`}
    >
      <div className="w-full ">{appSetting.showHeader && <AppHeader />}</div>

      {children}
      <div className="h-20 w-full"></div>
      <ToastAppContainer />
      <div className="w-full h-[12vh] relative z-50">
        {appSetting.showFooter && <AppFooter />}
      </div>
    </div>
  );
};

export default MainLayout;
