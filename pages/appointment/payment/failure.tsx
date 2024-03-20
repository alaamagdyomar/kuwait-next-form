import { NextPage } from 'next';
import MainContentLayout from '@/layouts/MainContentLayout';
import { useEffect } from 'react';
import { setCurrentModule } from '@/redux/slices/appSettingSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useTranslation } from 'react-i18next';
import {
  CalendarMonth,
  QueryBuilder,
  LocationOn,
  Replay,
  Close,
  FitnessCenterOutlined,
  ShoppingCartOutlined,
} from '@mui/icons-material';
import { appLinks, imageSizes, suppressText } from '@/constants/*';
import { useRouter } from 'next/router';
import Image from 'next/image';
import ClassFaild from '@/appImages/class_category/fail.png';
import ClassIcon from '@/appImages/class_category/class_icon.webp';
import SubscriptionFaild from '@/appImages/subscription_category/fail.png';
import LoadingSpinner from '@/components/LoadingSpinner';
import { isNumber, map } from 'lodash';
import Link from 'next/link';
import { dateSelected } from '@/redux/slices/searchParamsSlice';
import { useGetOrderStatusQuery } from '@/redux/api/classApi';
import { AppQueryResult } from '@/types/queries';
import { Order } from '@/types/index';
import { resetOrder, setOrder } from '@/redux/slices/orderSlice';
import StoreFail from '@/appImages/Store/fail.png';
import { disableAppLoading } from '@/redux/slices/appLoadingSlice';

const OrderFailure: NextPage = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const {
    order,
    searchParams: { searchSubCategory, searchArea, searchGendersSelected },
    country: { id: country_id },
    currentElement: { element },
    locale: { lang },
    cart: { currentMode },
  } = useAppSelector((state) => state);
  const searchDateSelected = useAppSelector<string>(dateSelected);
  const router = useRouter();
  const { data: orderStatus, isSuccess } = useGetOrderStatusQuery<{
    data: AppQueryResult<Order>;
    isSuccess: boolean;
    error: any;
  }>(
    {
      lang,
      country: country_id,
      invoice_id: order.invoice_id,
    },
    {
      skip: !order.invoice_id || !isNumber(order.invoice_id),
    }
  );

  useEffect(() => {
    dispatch(setCurrentModule(t('order_failure')));
    dispatch(disableAppLoading());
  }, []);

  useEffect(() => {
    if (isSuccess && orderStatus.success) {
      dispatch(setOrder(orderStatus.data));
    }
  }, [order.invoice_id, isSuccess, orderStatus]);

  if (order.invoice_id && !isSuccess) {
    return <LoadingSpinner />;
  }

  return (
    <MainContentLayout hideBack={true}>
      <div className="flex flex-col items-center w-full">
        {currentMode === 'classes' && (
          <div className="text-center space-y-6 w-full">
            <div className="flex flex-wrap justify-center">
              <Image
                className="w-48 h-48 mb-4 object-cover"
                src={ClassFaild}
                width={imageSizes.xl}
                height={imageSizes.xl}
                alt={t('class_failed')}
                suppressHydrationWarning={suppressText}
              />
            </div>
            <p className="text-xl my-3" suppressHydrationWarning={suppressText}>
              {t('we_r_sorry')}!
            </p>
            <p suppressHydrationWarning={suppressText}>
              {t('your_class_is_failed_to_book')}
            </p>
            <div className="flex justify-between gap-x-5 mt-3 w-full mt-8">
              <Link
                scroll={true}
                href={appLinks.classIndex(
                  searchDateSelected,
                  searchSubCategory.id,
                  country_id,
                  searchArea?.id,
                  map(
                    searchGendersSelected,
                    (g, i) => `gender[${i}]=${g}`
                  ).join(`&`)
                )}
                className="grid grid-cols-1 grid-rows-2 md:grid-cols-3 md:grid-rows-1 gap-x-2 items-center shadow-custome cursor-pointer rounded-xl text-sm justify-items-center py-7 px-3 w-[50%]"
              >
                <div>
                  <Image
                    src={ClassIcon}
                    className={`w-8 h-8 object-contain`}
                    alt="className icon"
                    width={imageSizes.xl}
                    height={imageSizes.xl}
                  />
                </div>
                <div className="md:col-span-2 py-1 md:py-0 text-sm">
                  <p suppressHydrationWarning={suppressText}>
                    {t('explore_more_classes')}
                  </p>
                </div>
              </Link>

              <Link
                onClick={() => dispatch(resetOrder())}
                scroll={true}
                href={`/country/${country_id}${appLinks.classShow.path}${element.id}/${searchDateSelected}`}
                className="grid grid-cols-1 grid-rows-2 md:grid-cols-3 md:grid-rows-1 gap-x-2 items-center shadow-xl border border-gray-100 cursor-pointer rounded-xl text-sm justify-items-center py-7 px-3 w-[50%]"
              >
                <div>
                  <Replay className="text-primary_BG" fontSize={`large`} />
                </div>
                <div className="md:col-span-2 py-1 md:py-0 text-sm">
                  <p suppressHydrationWarning={suppressText}>
                    {t('re_try_booking')}
                  </p>
                </div>
              </Link>
            </div>
          </div>
        )}
        {currentMode === 'event' && (
          <div className="text-center space-y-6 w-full">
            <div className="flex flex-wrap justify-center">
              <Image
                className="w-48 h-48 mb-4 object-cover"
                src={ClassFaild}
                width={imageSizes.xl}
                height={imageSizes.xl}
                alt={t('class_failed')}
                suppressHydrationWarning={suppressText}
              />
            </div>
            <p className="text-xl my-3" suppressHydrationWarning={suppressText}>
              {t('we_r_sorry')}!
            </p>
            <p suppressHydrationWarning={suppressText}>
              {t('your_class_is_failed_to_book')}
            </p>
            <div className="flex justify-between gap-x-5 mt-3 w-full mt-8">
              <Link
                scroll={true}
                href={appLinks.eventIndex(
                  searchDateSelected,
                  searchSubCategory.id,
                  country_id,
                  searchArea?.id,
                  map(
                    searchGendersSelected,
                    (g, i) => `gender[${i}]=${g}`
                  ).join(`&`)
                )}
                className="grid grid-cols-1 grid-rows-2 md:grid-cols-3 md:grid-rows-1 gap-x-2 items-center shadow-custome cursor-pointer rounded-xl text-sm justify-items-center py-7 px-3 w-[50%]"
              >
                <div>
                  <Image
                    src={ClassIcon}
                    alt="className icon"
                    width={imageSizes.xl}
                    height={imageSizes.xl}
                  />
                </div>
                <div className="md:col-span-2 py-1 md:py-0 text-sm">
                  <p suppressHydrationWarning={suppressText}>
                    {t('explore_more_classes')}
                  </p>
                </div>
              </Link>

              <Link
                onClick={() => dispatch(resetOrder())}
                scroll={true}
                href={`/country/${country_id}${appLinks.classShow.path}${element.id}/${searchDateSelected}`}
                className="grid grid-cols-1 grid-rows-2 md:grid-cols-3 md:grid-rows-1 gap-x-2 items-center shadow-xl border border-gray-100 cursor-pointer rounded-xl text-sm justify-items-center py-7 px-3 w-[50%]"
              >
                <div>
                  <Replay className="text-primary_BG" />
                </div>
                <div className="md:col-span-2 py-1 md:py-0 text-sm">
                  <p suppressHydrationWarning={suppressText}>
                    {t('re_try_booking')}
                  </p>
                </div>
              </Link>
            </div>
          </div>
        )}
        {currentMode === 'subscription' && (
          <div className="flex flex-col w-full justify-center items-center">
            <div className="flex flex-wrap justify-center">
              <Image
                className="w-48 h-48 mb-4"
                src={SubscriptionFaild}
                width={imageSizes.xl}
                height={imageSizes.xl}
                alt={t('subscription_failed')}
                suppressHydrationWarning={suppressText}
              />
            </div>
            <p className="text-xl my-3" suppressHydrationWarning={suppressText}>
              {t('we_r_sorry')}!
            </p>
            <p suppressHydrationWarning={suppressText}>
              {t('your_subscription_payment_failed')}
            </p>
            <div className="flex justify-between gap-x-5 mt-3 w-full mt-8">
              <Link
                scroll={true}
                href={appLinks.subscriptionIndex(
                  searchDateSelected,
                  searchSubCategory.id,
                  country_id,
                  searchArea?.id,
                  map(
                    searchGendersSelected,
                    (g, i) => `gender[${i}]=${g}`
                  ).join(`&`)
                )}
                className="grid grid-cols-1 grid-rows-2 md:grid-cols-3 md:grid-rows-1 gap-x-2 items-center shadow-custome cursor-pointer rounded-xl text-sm justify-items-center py-7 px-3 w-[50%]"
              >
                <div>
                  <FitnessCenterOutlined className="text-primary_BG -rotate-45" />
                </div>
                <div className="md:col-span-2 py-1 md:py-0 text-sm">
                  <p suppressHydrationWarning={suppressText}>
                    {t('explore_more_gyms')}
                  </p>
                </div>
              </Link>

              <Link
                onClick={() => dispatch(resetOrder())}
                scroll={true}
                href={appLinks.subscriptionIndex(
                  searchDateSelected,
                  searchSubCategory.id,
                  country_id,
                  searchArea?.id,
                  map(
                    searchGendersSelected,
                    (g, i) => `gender[${i}]=${g}`
                  ).join(`&`)
                )}
                className="grid grid-cols-1 grid-rows-2 md:grid-cols-3 md:grid-rows-1 gap-x-2 items-center shadow-xl border border-gray-108 cursor-pointer rounded-xl text-sm justify-items-center py-7 px-3 w-[50%]"
              >
                <div>
                  <Replay className="text-primary_BG" />
                </div>
                <div className="md:col-span-2 py-1 md:py-0 text-sm">
                  <p suppressHydrationWarning={suppressText}>
                    {t('re_try_booking')}
                  </p>
                </div>
              </Link>
            </div>
          </div>
        )}
        {currentMode === 'venue' && (
          <div className="flex flex-col justify-center items-center w-2/3">
            <div className="rounded-3xl shadow-CardTop pb-4 bg-white w-full">
              <div className="flex justify-center items-center gap-x-2 rounded-t-3xl bg-primary_BG w-full py-2 text-white">
                <p suppressHydrationWarning={suppressText}>
                  {t('booking_info')}
                </p>
              </div>
              <div className="p-4">
                <div>
                  <CalendarMonth className="text-xl text-slate-700" />
                  <p className="text-primary_BG inline-block px-2">
                    {order.date}
                  </p>
                </div>
                <div>
                  <QueryBuilder className="text-xl text-slate-700" />
                  <p className="text-primary_BG inline-block px-2">
                    {order.time}
                  </p>
                </div>
                <div>
                  <LocationOn className="text-xl text-slate-700" />
                  <p className="text-primary_BG inline-block px-2">
                    {order.area}
                  </p>
                </div>
              </div>
              <div className="bg-gray-100 p-4">
                <div className="flex justify-between pb-2">
                  <h5 suppressHydrationWarning={suppressText}>
                    {t('payment_method')}
                  </h5>
                  <p className="text-primary_BG">{order.payment_method}</p>
                </div>
                <div className="flex justify-between pb-2">
                  <h5 suppressHydrationWarning={suppressText}>
                    {t('transaction_date')}
                  </h5>
                  <p className="text-primary_BG">{order.transaction_date}</p>
                </div>
                <div className="flex justify-between pb-2">
                  <h5 suppressHydrationWarning={suppressText}>
                    {t('full_name')}
                  </h5>
                  <p className="text-primary_BG">{order.customer_name}</p>
                </div>
                <div className="flex justify-between pb-2">
                  <h5 suppressHydrationWarning={suppressText}>
                    {t('phone_number')}
                  </h5>
                  <p className="text-primary_BG">{order.customer_phone}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-1 justify-center items-center text-center rounded-3xl bg-white py-5 shadow-xl w-full">
              <Link
                href={appLinks.home.path}
                className="btn bg-red-600 text-white text-xl w-32 py-1 rounded-2xl shadow-md"
              >
                <Close className="font-bold" />
              </Link>
            </div>
            <div className="text-center mt-2">
              <p
                className="text-xl my-3"
                suppressHydrationWarning={suppressText}
              >
                {t('we_r_sorry')}!
              </p>
              <p suppressHydrationWarning={suppressText}>
                {t('your_booking_is_cancelled')}
              </p>
            </div>
          </div>
        )}

        {currentMode === 'product' && (
          <div className="text-center w-full">
            <div className="flex flex-wrap justify-center">
              <Image
                className="w-40 h-40 mb-4"
                src={StoreFail}
                alt={t('store_success')}
                suppressHydrationWarning={suppressText}
              />
            </div>
            <p className="text-xl my-3" suppressHydrationWarning={suppressText}>
              {t('we_r_sorry')}
            </p>
            <p suppressHydrationWarning={suppressText}>
              {t('your_purchase_has_failed')}
            </p>

            <div className="flex justify-between gap-x-5 mt-8">
              <Link
                href={`/country/${country_id}${appLinks.productIndex.path}`}
                className="grid grid-cols-1 grid-rows-2 md:grid-cols-3 md:grid-rows-1 h-24 gap-x-2 items-center shadow-custome cursor-pointer rounded-xl text-sm justify-items-center py-7 px-3 w-[50%]"
              >
                <div>
                  <ShoppingCartOutlined
                    className="text-primary_BG"
                    fontSize={'large'}
                  />
                </div>
                <div className="md:col-span-2 py-1 md:py-0 text-sm">
                  <p
                    suppressHydrationWarning={suppressText}
                    className={`overflow-hidden`}
                  >
                    {t('shop_more_items')}
                  </p>
                </div>
              </Link>

              <Link
                scroll={true}
                href={`${appLinks.cartProductReview.path}`}
                className="grid grid-cols-1 grid-rows-2 md:grid-cols-3 md:grid-rows-1 gap-x-2 items-center shadow-xl border border-gray-100 cursor-pointer rounded-xl text-sm justify-items-center py-7 px-3 w-[50%]"
              >
                <div className="flex justify-center items-center">
                  <Replay fontSize={'large'} className="text-primary_BG" />
                </div>
                <p className="text-xs text-center pt-3 lg:pt-0 col-span-2">
                  {t('re-try_booking')}
                </p>
              </Link>
            </div>
          </div>
        )}
      </div>
    </MainContentLayout>
  );
};

export default OrderFailure;
