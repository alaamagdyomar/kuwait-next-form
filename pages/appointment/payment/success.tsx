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
  FitnessCenterOutlined,
  Receipt,
  Person,
  CheckSharp,
  ShoppingCartOutlined,
  PersonOutline,
  Cyclone,
  LocationOnOutlined,
  IosShareOutlined,
  LockClockOutlined,
} from '@mui/icons-material';
import Link from 'next/link';
import { appLinks, imageSizes, suppressText } from '@/constants/*';
import { isNumber, map } from 'lodash';
import { useRouter } from 'next/router';
import Image from 'next/image';
import ClassSuccess from '@/appImages/class_category/success.png';
import ClassIcon from '@/appImages/class_category/class_icon.webp';
import SubscriptionSuccess from '@/appImages/subscription_category/success.png';
import LoadingSpinner from '@/components/LoadingSpinner';
import { isAuthenticated } from '@/redux/slices/authSlice';
import { dateSelected } from '@/redux/slices/searchParamsSlice';
import { useGetOrderStatusQuery } from '@/redux/api/classApi';
import { setOrder } from '@/redux/slices/orderSlice';
import { AppQueryResult } from '@/types/queries';
import { Order } from '@/types/index';
import storeSuccess from '@/appImages/Store//Success.png';
import GreyLine from '@/components/GreyLine';
import { disableAppLoading } from '@/redux/slices/appLoadingSlice';
import { removeTempId } from '@/redux/slices/cartSlice';
import { useGetCartProductsQuery } from '@/redux/api/cartApi';
import Tooltip from '@mui/material/Tooltip';
import { WhatsappShareButton } from 'react-share';
const OrderSuccess: NextPage = (): JSX.Element => {
  const { t } = useTranslation();
  const {
    order,
    searchParams: { searchSubCategory, searchArea, searchGendersSelected },
    country: { id: country_id },
    locale: { lang },
    cart: { currentMode },
  } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const isAuth = useAppSelector(isAuthenticated);
  const searchDateSelected = useAppSelector<string>(dateSelected);

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
    if (isSuccess && orderStatus.success) {
      dispatch(setOrder(orderStatus.data));
    }
  }, [order.invoice_id, isSuccess, orderStatus]);

  useEffect(() => {
    dispatch(setCurrentModule(t('order_success')));
    dispatch(disableAppLoading());
    dispatch(removeTempId());
  }, []);

  if (order.invoice_id && !isSuccess) {
    return <LoadingSpinner />;
  }

  const ViewLoc = (lat: string, long: string) => {
    window.open('https://maps.google.com?q=' + lat + ',' + long);
  };
  
  return (
    <MainContentLayout hideBack={true}>
      {/* class case */}
      {currentMode === 'classes' && (
        <div className="text-center">
          <div className="flex flex-wrap justify-center">
            <Image
              className="w-40 h-40 mb-4"
              src={ClassSuccess}
              width={imageSizes.xl}
              height={imageSizes.xl}
              alt={t('class_success')}
              suppressHydrationWarning={suppressText}
            />
          </div>
          <p className="text-xl" suppressHydrationWarning={suppressText}>
            {t('amazing!')}
          </p>
          <p suppressHydrationWarning={suppressText}>
            {t('booking_successful')}
          </p>
          <div className="text-justify bg-gray-100 rounded-lg text-sm p-4 my-4">
            <h6 className="text-primary_BG font-semibold">
              {t('payment_receipt')}
            </h6>
            <div className="py-4 border-b border-t border-b-gray-400 border-t-gray-400 my-2">
              <div className="flex items-end pb-3">
                <CalendarMonth fontSize={'small'} />
                <p className="px-2">{order.date}</p>
              </div>
              <div className="flex items-end pb-3">
                <QueryBuilder fontSize={'small'} />
                <p className="px-2" suppressHydrationWarning={suppressText}>
                  {order.time}
                </p>
              </div>
              <div className="flex items-end pb-3">
                <Person fontSize={'small'} />
                <p className="px-2">
                  {order.customer_name} - {order.customer_phone}
                </p>
              </div>
            </div>
            <div>
              <div>
                <h5 className="pb-3 font-semibold">{order.vendor_name}</h5>
                <div className="flex">
                  <Cyclone fontSize={'small'} />
                  <p className="px-2">{order.class_name}</p>
                </div>
                <div className="flex">
                  <LocationOn fontSize={'small'} />
                  <p className="px-2">{order.area}</p>
                </div>
                <div className="flex justify-between w-full">
                  <div className="flex">
                    <PersonOutline fontSize={'small'} />
                    <p className="px-2">{order.coach_name}</p>
                  </div>
                  <p suppressHydrationWarning={suppressText}>
                    {order.price} {t(order.currency)}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-between gap-x-5 mt-3">
            <Link
              scroll={true}
              href={appLinks.classIndex(
                searchDateSelected,
                searchSubCategory.id,
                country_id,
                searchArea?.id,
                map(searchGendersSelected, (g, i) => `gender[${i}]=${g}`).join(
                  `&`
                )
              )}
              className="grid grid-cols-1 grid-rows-2 md:grid-cols-3 md:grid-rows-1 gap-x-2 items-center shadow-custome cursor-pointer rounded-xl text-sm justify-items-center py-7 px-3 w-[50%]"
            >
              <div>
                <Image
                  src={ClassIcon}
                  alt="class icon"
                  className={`w-12 h-12 object-contain`}
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
              scroll={true}
              href={`/appointment/payment/invoice`}
              className="grid grid-cols-1 grid-rows-2 md:grid-cols-3 md:grid-rows-1 gap-x-2 items-center shadow-xl border border-gray-100 cursor-pointer rounded-xl text-sm justify-items-center py-7 px-3 w-[50%]"
            >
              <div>
                <Receipt className="text-primary_BG" fontSize={'large'} />
              </div>
              <p
                className="md:col-span-2 py-1 md:py-0 text-sm"
                suppressHydrationWarning={suppressText}
              >
                {t('view_receipt')}
              </p>
            </Link>
          </div>
        </div>
      )}
      {/* event */}
      {currentMode === 'event' && (
        <div className="text-center">
          <div className="flex flex-wrap justify-center">
            <Image
              className="w-40 h-40 mb-4"
              src={ClassSuccess}
              width={imageSizes.xl}
              height={imageSizes.xl}
              alt={t('event_success')}
              suppressHydrationWarning={suppressText}
            />
          </div>
          <p className="text-xl" suppressHydrationWarning={suppressText}>
            {t('Amazing!')}
          </p>
          <p suppressHydrationWarning={suppressText}>
            {t('booking_successful')}
          </p>
          <div className="text-justify bg-gray-100 rounded-lg text-sm p-4 my-4">
            <h6 className="text-primary_BG font-seimbold">
              {t('payment_receipt')}
            </h6>
            <div className="py-4 border-b border-t border-b-gray-400 border-t-gray-400 my-2">
              <div className="flex items-end pb-3">
                <CalendarMonth fontSize={'small'} />
                <p className="px-2">{order.date}</p>
              </div>
              <div className="flex items-end pb-3">
                <QueryBuilder fontSize={'small'} />
                <p
                  className="inline-block px-2"
                  suppressHydrationWarning={suppressText}
                >
                  {order.time}
                </p>
              </div>
              <div className="flex items-end pb-3">
                <Person fontSize={'small'} />
                <p className="px-2">
                  {order.customer_name} - {order.customer_phone}
                </p>
              </div>
            </div>
            <div>
              <div>
                <h5 className="pb-3 font-semibold">{order.event_name}</h5>
                <div className="flex">
                  <Cyclone fontSize={'small'} />
                  <p className="px-2">{order.event_name}</p>
                </div>
                <div className="flex">
                  <LocationOn fontSize={'small'} />
                  <p className="px-2">{order.area}</p>
                </div>

                <div className="flex justify-between w-full">
                  <div className="flex">
                    <PersonOutline fontSize={'small'} />
                    <p className="px-2">{order.organizer}</p>
                  </div>
                  <p suppressHydrationWarning={suppressText}>
                    {order.price} {t(order.currency)}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-between gap-x-5 mt-3">
            <Link
              scroll={true}
              href={appLinks.eventIndex(
                searchDateSelected,
                searchSubCategory.id,
                country_id,
                searchArea?.id,
                map(searchGendersSelected, (g, i) => `gender[${i}]=${g}`).join(
                  `&`
                )
              )}
              className="grid grid-cols-1 grid-rows-2 md:grid-cols-3 md:grid-rows-1 gap-x-2 items-center shadow-custome cursor-pointer rounded-xl text-sm justify-items-center py-7 px-3 w-[50%]"
            >
              <div>
                <Image
                  src={ClassIcon}
                  alt="class icon"
                  className={`w-12 h-12 object-contain`}
                  width={imageSizes.xl}
                  height={imageSizes.xl}
                />
              </div>
              <div className="md:col-span-2 py-1 md:py-0 text-sm">
                <p suppressHydrationWarning={suppressText}>
                  {t('explore_more_events')}
                </p>
              </div>
            </Link>
            <Link
              scroll={true}
              href={`/appointment/payment/invoice`}
              className="grid grid-cols-1 grid-rows-2 md:grid-cols-3 md:grid-rows-1 gap-x-2 items-center shadow-xl border border-gray-100 cursor-pointer rounded-xl text-sm justify-items-center py-7 px-3 w-[50%]"
            >
              <div>
                <Receipt className="text-primary_BG" fontSize={'large'} />
              </div>
              <p
                className="md:col-span-2 py-1 md:py-0 text-sm"
                suppressHydrationWarning={suppressText}
              >
                {t('view_receipt')}
              </p>
            </Link>
          </div>
        </div>
      )}
      {currentMode === 'subscription' && (
        <div className="text-center">
          <div className="flex flex-wrap justify-center">
            <Image
              className="w-40 h-40 mb-4"
              src={SubscriptionSuccess}
              width={imageSizes.xl}
              height={imageSizes.xl}
              alt={t('subscription_success')}
              suppressHydrationWarning={suppressText}
            />
          </div>
          <p className="text-xl" suppressHydrationWarning={suppressText}>
            {t('Amazing!')}
          </p>
          <p suppressHydrationWarning={suppressText}>
            {t('booking_successful')}
          </p>
          <div className="text-justify bg-gray-100 rounded-lg p-4 text-sm my-4">
            <h6
              className="text-primary_BG font-semibold"
              suppressHydrationWarning={suppressText}
            >
              {t('payment_receipt')}
            </h6>
            <div className="py-4 text-slate-700 border-b border-t border-b-gray-400 border-t-gray-400 my-2">
              <h5 className="pb-3 font-semibold">
                  {order.subscription_name}
              </h5>
              <p>{order.vendor_name}</p>
              <div className="flex items-end pb-3">
                <Person fontSize={'small'} />
                <p className="inline-block px-2">
                  {order.customer_name}
                </p>
              </div>
              <p className="inline-block px-2">
                  {order.customer_phone}
              </p>
            </div>
            <div>
              <div className="flex justify-between w-full">
                <p>{t('total_amount')}</p>
                <p suppressHydrationWarning={suppressText}>
                {order.price} {t(order.currency)}
              </p>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-x-5 mt-3">
            <Link
              scroll={true}
              href={`/appointment/payment/invoice`}
              className="grid grid-cols-1 grid-rows-2 md:grid-cols-3 md:grid-rows-1 gap-x-2 items-center shadow-xl border border-gray-100 cursor-pointer rounded-xl text-sm justify-items-center py-7 px-3 w-[50%]"
            >
              <div>
                <Receipt className="text-primary_BG" fontSize={'large'} />
              </div>
              <div className="md:col-span-2 py-1 md:py-0 text-sm">
                <p suppressHydrationWarning={suppressText}>
                  {t('view_receipt')}
                </p>
              </div>
            </Link>
          </div>
        </div>
      )}
      {currentMode === 'venue' && (
        <div className="flex flex-col justify-center items-center w-full">
          <div className=" flex flex-col justify-center items-center w-11/12 md:w-full mx-3 overflow-hidden">
            {/* info */}
            <div className="flex flex-col w-full pb-4 rounded-b-3xl rounded-t-3xl">
              <div className="flex justify-center items-center gap-x-2 rounded-t-3xl bg-customGreen w-full py-2 text-white">
                <p suppressHydrationWarning={suppressText}>
                  <CheckSharp className="font-bold" />
                  {t('booking_successful')}
                </p>
              </div>
              <div className="p-4 space-y-4 border-l border-r">
                <div className="flex items-end pb-3">
                  <CalendarMonth
                    className="text-slate-700"
                    fontSize={'large'}
                  />
                  <p className="text-primary_BG px-2">{order.date}</p>
                </div>
                <div className="flex items-end pb-3">
                  <QueryBuilder className="text-slate-700" fontSize={'large'} />
                  <p className="text-primary_BG px-2">{order.time}</p>
                </div>
                <div className="flex items-end pb-3">
                  <LocationOn className="text-slate-700" fontSize={'large'} />
                  <p className="text-primary_BG px-2">{order.area}</p>
                </div>
              </div>
              <div className="bg-gray-100 p-4 border-l border-r">
                <div className="flex justify-between pb-3">
                  <h5 suppressHydrationWarning={suppressText}>
                    {t('customer_name')}
                  </h5>
                  <p className="text-primary_BG">{order.customer_name}</p>
                </div>
                <div className="flex justify-between pb-3">
                  <h5 suppressHydrationWarning={suppressText}>
                    {t('customer_phone')}
                  </h5>
                  <p className="text-primary_BG">{order.customer_phone}</p>
                </div>
                <div className="flex justify-between pb-3">
                  <h5 suppressHydrationWarning={suppressText}>
                    {t('vendor_name')}
                  </h5>
                  <p className="text-primary_BG">{order.vendor_name}</p>
                </div>
                <div className="flex justify-between pb-3">
                  <h5 suppressHydrationWarning={suppressText}>
                    {t('venue_name')}
                  </h5>
                  <p className="text-primary_BG">{order.venue_name}</p>
                </div>
                <div className="flex justify-between pb-3">
                  <h5 suppressHydrationWarning={suppressText}>
                    {t('payment_method')}:
                  </h5>
                  <p className="text-primary_BG">{order.payment_method}</p>
                </div>
                <div className="flex justify-between pb-3">
                  <h5 suppressHydrationWarning={suppressText}>
                    {t('date_and_time')}
                  </h5>
                  <p className="text-primary_BG">{order.date} {order.time}</p>
                </div>
                <div className="flex justify-between pb-3">
                  <h5 suppressHydrationWarning={suppressText}>{t('price')}:</h5>
                  <p className="text-primary_BG">
                    {order.price} {t(order.currency)}
                  </p>
                </div>
              </div>
            </div>
            {/* dotted line*/}
            <div className="relative text-center h-0 border-t-8 w-[90%] -top-0 border-dotted border-stone-300"></div>
            {/* check icon */}
            <div className=" flex flex-col flex-1 w-full justify-center items-center text-center rounded-3xl bg-white py-5 mb-10 shadow-lg">
              <Link
                href={appLinks.home.path}
                className="btn text-base w-32 rounded-full py-1 border-[1px] border-slate-700"
                suppressHydrationWarning={suppressText}
              >
                {t('back_to_home')}
              </Link>
            </div>
            <div className="flex gap-x-2 w-full">
              <div className="shadow-xl border border-gray-100 cursor-pointer rounded-xl text-sm justify-items-center py-7 px-3 w-[50%] text-center">
                <Tooltip
                  title={t('view_location')}
                  placement="top"
                  className="text-center"
                >
                  <div
                    className="cursor-pointer text-center"
                    onClick={() => ViewLoc(order.latitude, order.longitude)}
                  >
                    <LocationOnOutlined className="text-primary_BG" />
                    <p suppressHydrationWarning={suppressText}>
                      {t('location')}
                    </p>
                  </div>
                </Tooltip>
              </div>
              <div className="shadow-xl border border-gray-100 cursor-pointer rounded-xl text-sm justify-items-center py-7 px-3 w-[50%] text-center">
                <Tooltip title={t('share_location')} placement="top">
                  <WhatsappShareButton
                    url={`https://maps.google.com?q=${order.longitude},${order.latitude}`}
                    title={order.share_message}
                  >
                    <div className="cursor-pointer text-center">
                      <IosShareOutlined className="text-primary_BG" />
                      <p suppressHydrationWarning={suppressText}>
                        {t('share')}
                      </p>
                    </div>
                  </WhatsappShareButton>
                </Tooltip>
              </div>
            </div>
            <div className="text-center mt-2">
              <p className="text-xl" suppressHydrationWarning={suppressText}>
                {t('amazing!')}
              </p>
              <p suppressHydrationWarning={suppressText}>
                {t('your_booking_is_confirmed')}
              </p>
            </div>
          </div>
        </div>
      )}

      {currentMode === 'product' && (
        <div className="text-center">
          <div className="flex flex-wrap justify-center">
            <Image
              className="w-40 h-40 mb-4"
              src={storeSuccess}
              alt={t('store_success')}
              suppressHydrationWarning={suppressText}
            />
          </div>
          <p className="text-xl" suppressHydrationWarning={suppressText}>
            {t('Amazing!')}
          </p>
          <p suppressHydrationWarning={suppressText}>
            {t('your_purchase_is_successfully_completed')}
          </p>

          <div className="text-justify bg-gray-100 rounded-lg p-4 text-sm my-4">
            <h6
              className="text-primary_BG"
              suppressHydrationWarning={suppressText}
            >
              {t('payment_receipt')}
            </h6>

            <GreyLine className="my-2" />

            <div className="flex justify-between items-center">
              <p suppressHydrationWarning={suppressText}>{t('order_id')}</p>
              <p>{order.order_code}</p>
            </div>

            <GreyLine className="my-2" />

            <div className="text-sm">
              <div className="flex items-center gap-x-2">
                <LocationOn fontSize={'small'} />
                <p>{order.area}</p>
              </div>

              <div className="flex items-center gap-x-2">
                <Person fontSize={'small'} />
                <p>{order.vendor_name}</p>
              </div>
            </div>

            <GreyLine className="my-2" />

            <div className="flex justify-between items-center">
              <p
                className="text-start text-primary_BG"
                suppressHydrationWarning={suppressText}
              >
                {t('total_amount')}
              </p>
              <p>{order.total}</p>
            </div>
          </div>

          <div className="flex justify-between gap-x-5 mt-3">
            <Link
              href={`/country/${country_id}${appLinks.productIndex.path}`}
              className="grid grid-cols-1 grid-rows-2 md:grid-cols-3 md:grid-rows-1 gap-x-2 items-center shadow-xl border border-gray-100 cursor-pointer rounded-xl text-sm justify-items-center py-7 px-3 w-[50%]"
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
              href={`/appointment/payment/invoice`}
              className="grid grid-cols-1 grid-rows-2 md:grid-cols-3 md:grid-rows-1 gap-x-2 items-center shadow-xl border border-gray-100 cursor-pointer rounded-xl text-sm justify-items-center py-7 px-3 w-[50%]"
            >
              <div>
                <Receipt className="text-primary_BG" fontSize={'large'} />
              </div>
              <div className="md:col-span-2 py-1 md:py-0 text-sm">
                <p suppressHydrationWarning={suppressText}>
                  {t('view_receipt')}
                </p>
              </div>
            </Link>
          </div>
        </div>
      )}
    </MainContentLayout>
  );
};

export default OrderSuccess;
