import { NextPage } from 'next';
import { storeApi } from '@/redux/api/storeApi';
import MainHead from '@/components/MainHead';
import { useTranslation } from 'react-i18next';
import { wrapper } from '@/redux/store';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { isEmpty, map } from 'lodash';
import { Category, StoreProps } from '@/types/queries';
import Link from 'next/link';
import { appLinks, submitBtnClass, suppressText } from '@/constants/*';
import { useRouter } from 'next/router';
import GeneralCarousel from '@/components/GeneralCarousel';
import Slider from 'react-slick';
import HorProductWidget from '@/widgets/product/HorProductWidget';
import { apiSlice } from '@/redux/api';
import StoreLoadingSkeleton from '@/widgets/store/StoreLoadingSkeleton';
import VendorWidget from '@/widgets/vendor/VendorWidget';
import useScreenWidth from '@/hooks/screenWidth';
import MainContentLayout from '@/layouts/MainContentLayout';
import { Product, Vendor } from '@/types/index';
import { useEffect } from 'react';
import { setCurrentModule } from '@/redux/slices/appSettingSlice';
import { removeSearchSubCategoryCategory } from '@/redux/slices/searchParamsSlice';
import { setCurrentMode } from '@/redux/slices/cartSlice';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
type Props = {
  store: StoreProps;
  storeCategories: Category[];
};
const StoreIndex: NextPage<Props> = ({
  store,
  storeCategories,
}): JSX.Element => {
  const {
    locale,
    country: { id },
    searchParams: { searchSubCategory },
  } = useAppSelector((state) => state);
  const { query } = useRouter();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const windowWidth: any = useScreenWidth();

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToScroll: 1,
    initialSlide: 0,
    centerMode: true,
    centerPadding: '0',
    easing: 'fade',
    rtl: locale.isRTL,
    slidesToShow: windowWidth > 1000 ? 3 : 2,
    arrows: windowWidth > 550,
  };

  if (!store || !storeCategories) {
    return <StoreLoadingSkeleton />;
  }

  useEffect(() => {
    dispatch(setCurrentMode('product'));
    dispatch(setCurrentModule(t('stores')));
    if (!query.subcategory_id && searchSubCategory?.id) {
      dispatch(removeSearchSubCategoryCategory());
    }
  }, []);

  useEffect(() => {
    console.log('windowWidth', windowWidth, sliderSettings);
  }, [windowWidth]);

  return (
    <>
      <MainHead title={'store'} description={'store_description'} />
      <MainContentLayout backHome={true} showMotion={false}>
        <div className="flex gap-x-1 justify-between text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
          <ul className="flex flex-wrap -mb-px">
            <li className="mr-2 capitalize">
              <Link
                scroll={true}
                href={`/country/${id}${appLinks.store.path}`}
                className={`${
                  !query.category_id ? `active border-primary_BG` : ``
                } lg:w-20 min-w-fit inline-block p-4  text-black rounded-t-lg border-b-2 dark:text-blue-500 dark:border-blue-500`}
                aria-current="page"
                suppressHydrationWarning={suppressText}
              >
                {t('all')}
              </Link>
            </li>
            {!isEmpty(storeCategories) &&
              map(storeCategories, (s: Category, i) => (
                <li className="mr-2" key={i}>
                  <Link
                    scroll={true}
                    href={`/country/${id}${appLinks.store.path}?category_id=${s.id}`}
                    className={`${
                      query.category_id == s.id
                        ? `active border-primary_BG`
                        : ``
                    } min-w-fit inline-block p-4 text-black rounded-t-lg border-b-2 dark:text-blue-500 dark:border-blue-500 whitespace-nowrap`}
                    aria-current="page"
                    suppressHydrationWarning={suppressText}
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
          </ul>
          {/* display all products search icon */}
          <span className="pt-4">
            <Link
              scroll={false}
              href={{
                pathname: `/country/${id}${appLinks.productIndex.path}`,
                query: {
                  page: 1,
                },
              }}
            >
              <MagnifyingGlassIcon
                className={`w-5 h-5 text-gray-700 ltr:ml-4 rtl:mr-4`}
              />
            </Link>
          </span>
        </div>
        {!isEmpty(store.home_slider_images) && (
          <GeneralCarousel
            slides={store.home_slider_images}
            w={`w-full h-auto`}
          />
        )}
        <div className={`space-y-3`}>
          {/*   Just Added Products */}
          {!isEmpty(store.just_added_products) && (
            <div>
              <div className="inline-flex justify-center items-center w-full">
                <span
                  className="flex px-3 text-gray-900 bg-white dark:text-white dark:bg-gray-900"
                  suppressHydrationWarning={suppressText}
                >
                  {t('just_added_products')}
                </span>
                <hr className="flex-1 my-8 h-px bg-gray-200 border-0 dark:bg-gray-700" />
                {/* <span>
                  <Link
                    scroll={true}
                    href={{
                      pathname: `/country/${id}${appLinks.productIndex.path}`,
                      query: {
                        page: 1,
                      },
                    }}
                  >
                    <MagnifyingGlassIcon
                      className={`w-5 h-5 text-gray-700 ltr:ml-4 rtl:mr-4`}
                    />
                  </Link>
                </span> */}
              </div>
              <Slider
                {...sliderSettings}
                slidesToShow={
                  store.just_added_products.length <= 2
                    ? store.just_added_products.length
                    : windowWidth > 550
                    ? 3
                    : 2
                }
                className={`mb-8`}
              >
                {map(store.just_added_products, (s: Product, i) => (
                  <HorProductWidget element={s} key={i} />
                ))}
              </Slider>
            </div>
          )}
          {!isEmpty(store.bestselling_products) && (
            <div>
              {/*   Just Added Products */}
              <div className="inline-flex justify-center items-center w-full">
                <span
                  className="flex px-3 text-gray-900 bg-white dark:text-white dark:bg-gray-900"
                  suppressHydrationWarning={suppressText}
                >
                  {t('best_selling_products')}
                </span>
                <hr className="flex-1 my-8 h-px bg-gray-200 border-0 dark:bg-gray-700" />
                {/* <span>
                  <Link
                    scroll={true}
                    href={{
                      pathname: `/country/${id}${appLinks.productIndex.path}`,
                      query: {
                        page: 1,
                      },
                    }}
                  >
                    <MagnifyingGlassIcon
                      className={`w-5 h-5 text-gray-700 ltr:ml-4 rtl:mr-4`}
                    />
                  </Link>
                </span> */}
              </div>
              <Slider
                {...sliderSettings}
                slidesToShow={
                  store.bestselling_products.length <= 2
                    ? store.bestselling_products.length
                    : windowWidth > 550 ? 3 : 2
                }
              >
                {map(store.bestselling_products, (s: Product, i) => (
                  <HorProductWidget element={s} key={i} />
                ))}
              </Slider>
              {/* view all products*/}
              <div className={`flex flex-1 w-full`}>
                <Link
                  scroll={true}
                  href={{
                    pathname: `/country/${id}${appLinks.productIndex.path}`,
                    query: {
                      page: 1,
                    },
                  }}
                  className={`${submitBtnClass} text-center mt-8`}
                  suppressHydrationWarning={suppressText}
                >
                  {t('view_all_products')}
                </Link>
              </div>
            </div>
          )}
          {!isEmpty(store.featured_vendors) && (
            <div>
              {/*   Vendors */}
              <div className="inline-flex justify-center items-center w-full">
                <span
                  className="flex px-3 text-gray-900 bg-white dark:text-white dark:bg-gray-900"
                  suppressHydrationWarning={suppressText}
                >
                  {t('featured_vendors')}
                </span>
                <hr className="flex-1 my-8 h-px bg-gray-200 border-0 dark:bg-gray-700" />
                {/* <span>
                  <Link
                    scroll={true}
                    href={{
                      pathname: `/country/${id}${appLinks.vendorIndex.path}`,
                      query: {
                        page: 1,
                      },
                    }}
                  >
                    <MagnifyingGlassIcon
                      className={`w-5 h-5 text-gray-700 ltr:ml-4 rtl:mr-4`}
                    />
                  </Link>
                </span> */}
              </div>
              <Slider
                {...sliderSettings}
                slidesToShow={
                  store.featured_vendors.length <= 2
                    ? store.featured_vendors.length
                    : windowWidth > 550 ? 3 : 2
                }
              >
                {map(store.featured_vendors, (s: Vendor, i) => (
                  <VendorWidget element={s} key={i} />
                ))}
              </Slider>
              {/* view all vendors */}
              <div className={`flex flex-1 w-full`}>
                <Link
                  scroll={true}
                  href={{
                    pathname: `/country/${id}${appLinks.vendorIndex.path}`,
                    query: {
                      page: 1,
                    },
                  }}
                  className={`${submitBtnClass} text-center mt-8`}
                  suppressHydrationWarning={suppressText}
                >
                  {t('view_all_vendors')}
                </Link>
              </div>
            </div>
          )}
        </div>
      </MainContentLayout>
    </>
  );
};

export default StoreIndex;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ locale, query }) => {
      const { country }: any = query;
      if (!country) {
        return {
          notFound: true,
        };
      }
      const { data: currentStore, isError } = await store.dispatch(
        storeApi.endpoints.getStoreIndex.initiate({
          lang: locale,
          country,
          params: query,
        })
      );
      const { data: storeCategories, isError: storeCategoriesError } =
        await store.dispatch(
          storeApi.endpoints.getStoreCategories.initiate({
            lang: locale,
            country,
          })
        );
      await Promise.all(store.dispatch(apiSlice.util.getRunningQueriesThunk()));
      if (isError || storeCategoriesError || !currentStore.data) {
        return {
          notFound: true,
        };
      }
      return {
        props: {
          store: currentStore.data,
          storeCategories: storeCategories.data,
        },
      };
    }
);
