import GreyLine from '@/components/GreyLine';
import LoadingSpinner from '@/components/LoadingSpinner';
import { appLinks, suppressText } from '@/constants/*';
import MainContentLayout from '@/layouts/MainContentLayout';
import { useAppDispatch } from '@/redux/hooks';
import { setCurrentModule } from '@/redux/slices/appSettingSlice';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  EventAvailableOutlined,
  AccessTime,
  CalendarMonth,
  LocationOn,
  Person,
  Payment,
  Call,
  AccountCircle,
  HouseSiding,
  Grid3x3,
  ConfirmationNumber,
  DataUsageOutlined,
} from '@mui/icons-material';
import Image from 'next/image';

const OrderDetails: NextPage = (): JSX.Element => {
  const router = useRouter();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { data, moduleType } = router.query;
  const orderData = data ? JSON.parse(data as string) : undefined;

  // const {
  //   data: orderElements,
  //   isSuccess: orderHistorySuccess,
  //   isLoading: orderHistoryLoading,
  // } = useGetOrderHistoryQuery<{
  //   data: AppQueryResult<PreviousOrder[]>;
  //   isSuccess: boolean;
  //   isLoading: boolean;
  // }>(
  //   {
  //     country: country.toString(),
  //     token,
  
  //   },
  //   { refetchOnMountOrArgChange: true }
  // );

  if (!data || !moduleType) {
    router.push(appLinks.order.path);
  }

  useEffect(() => {
    dispatch(setCurrentModule(t(`order_details`)));
  }, []);
  
  return (
    <MainContentLayout>
      <div className="bg-gray-100 rounded p-4 text-base">
        {orderData ? (
          <>
            {moduleType === '4' && (
              <div className="py-3">
                <p
                  suppressHydrationWarning={suppressText}
                  className="mb-2 font-semibold text-primary_BG"
                >
                  {t('cart_items')}
                </p>

                {orderData.items.map((item: any, idx: number) => {
                  return (
                    <div>
                      <div className="flex justify-between gap-x-2">
                        <p className="mb-1">{item.item_name}</p>
                        <p className="text-primary_BG">{item.item_price}</p>
                      </div>
                      <p suppressHydrationWarning={suppressText}>
                        {item.addons.join(' , ')}
                      </p>

                      {idx !== orderData.items.length && (
                        <GreyLine className="my-2" />
                      )}
                    </div>
                  );
                })}

                <div>
                  <div>
                    <p className="mb-2 font-semibold text-primary_BG">
                      {t('billed_to')}
                    </p>

                    <div className="flex items-center gap-x-1 mb-1 px-2">
                      <Person sx={{ fontSize: 16 }} />
                      <p className="w-fit">{orderData.customer_name}</p>
                    </div>

                    <div className="flex items-center gap-x-1 mb-1 px-2">
                      <Call sx={{ fontSize: 16 }} />
                      <p className="w-fit">{orderData.customer_phone}</p>
                    </div>
                  </div>

                  <GreyLine className="my-2" />

                  <div>
                    <p className="mb-2 font-semibold text-primary_BG">
                      {t('payment_method')}
                    </p>

                    <div className="flex items-center gap-x-1 mb-1 px-2">
                      <Payment sx={{ fontSize: 16 }} />
                      <p className="w-fit">{orderData.payment_method}</p>
                    </div>
                  </div>

                  <GreyLine className="my-2" />

                  <div>
                    <p className="mb-2 font-semibold text-primary_BG">
                      {t('orderData Info')}
                    </p>

                    <div className="flex items-center gap-x-1 mb-1 px-2">
                      <Grid3x3 sx={{ fontSize: 16 }} />
                      <p className="w-fit">
                        {t('orderData Code')} : {orderData.order_code}
                      </p>
                    </div>

                    <div className="flex items-center gap-x-1 mb-1 px-2">
                      <ConfirmationNumber sx={{ fontSize: 16 }} />
                      <p className="w-fit">
                        {t('orderData ID')} : {orderData.receipt_id}
                      </p>
                    </div>
                  </div>

                  <GreyLine className="my-2" />

                  <div>
                    <p
                      className="mb-2 font-semibold text-primary_BG"
                      suppressHydrationWarning={suppressText}
                    >
                      {t('Address')}
                    </p>

                    <div className="flex items-center gap-x-1 mb-1 px-2">
                      <HouseSiding sx={{ fontSize: 16 }} />
                      <p className="w-fit">
                        {Object.entries(orderData.address)
                          .map((entry) => entry.join(': '))
                          .join(',')}{' '}
                      </p>
                    </div>
                  </div>

                  <GreyLine className="my-2" />

                  <div>
                    <p className="mb-2 font-semibold text-primary_BG">
                      {t('Vendor Info')}
                    </p>

                    <div className="flex items-center gap-x-1 mb-1 px-2">
                      <AccountCircle sx={{ fontSize: 16 }} />
                      <p className="w-fit">{orderData.vendor_name} </p>
                    </div>
                  </div>

                  <GreyLine className="my-2" />

                  <div className="flex justify-between items-center">
                    <p className="" suppressHydrationWarning={suppressText}>
                      {t('total')}
                    </p>
                    <p className="text-primary_BG">{orderData.total}</p>
                  </div>
                </div>
              </div>
            )}

            {moduleType === '1' && (
              <div>
                <div className="pt-3 border-b border-b-gray-300">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="text-lg text-primary_BG">
                        {orderData.venue}
                      </h4>
                      <div className="flex items-center pb-2">
                        <p className="text-sm">{orderData.vendor_name}</p>
                      </div>
                    </div>
                    <div className="text-end">
                      <p
                        className="text-sm"
                        suppressHydrationWarning={suppressText}
                      >
                        {t('total_amount')}
                      </p>
                      <p
                        className="text-sm text-primary_BG"
                        suppressHydrationWarning={suppressText}
                      >
                        {orderData.price} {t(orderData.currency)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="py-3 border-b border-b-gray-300">
                  <div className="flex items-center">
                    <LocationOn fontSize={'small'} />
                    <h6
                      className="px-2 text-primary_BG"
                      suppressHydrationWarning={suppressText}
                    >
                      {t('location')}
                    </h6>
                  </div>
                  <div className="flex items-center">
                    {orderData.venodr_logo && (
                      <Image
                        src={`${orderData.vendor_logo}`}
                        width={50}
                        height={50}
                        alt={`${orderData.vendor_name}`}
                      />
                    )}
                    <div>
                      <p>{orderData.area}</p>
                      <p className="text-xs">{orderData.address}</p>
                    </div>
                  </div>
                </div>

                <div className="py-3 border-b border-b-gray-300">
                  <div className="flex items-center">
                    <DataUsageOutlined fontSize={'small'} />
                    <h6
                      className="px-2 text-primary_BG"
                      suppressHydrationWarning={suppressText}
                    >
                      {t('status')}
                    </h6>
                  </div>
                  <p>{orderData.status}</p>
                </div>

                <div className="py-3 border-b border-b-gray-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center pb-2">
                        <CalendarMonth fontSize={'small'} />
                        <h6
                          className="px-2 text-primary_BG"
                          suppressHydrationWarning={suppressText}
                        >
                          {t('class_date')}
                        </h6>
                      </div>
                      <p>{orderData.date}</p>
                    </div>
                    <div>
                      <div className="flex items-center pb-2">
                        <AccessTime fontSize={'small'} />
                        <h6
                          className="px-2 text-primary_BG"
                          suppressHydrationWarning={suppressText}
                        >
                          {t('time')}
                        </h6>
                      </div>
                      <p>{orderData.time}</p>
                    </div>
                  </div>
                </div>

                <div className="py-3 ">
                  <div className="flex items-center">
                    <EventAvailableOutlined fontSize={'small'} />
                    <h6
                      className="px-2 text-primary_BG"
                      suppressHydrationWarning={suppressText}
                    >
                      {t('booked_on')}
                    </h6>
                  </div>
                  <p>{orderData.booked_on}</p>
                </div>
              </div>
            )}

            {moduleType === '2' && (
              <div>
                <div className="pt-3 border-b border-b-gray-300">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="text-lg text-primary_BG">
                        {orderData.class_name}
                      </h4>
                      <div className="flex items-center pb-2">
                        <p className="text-sm">{orderData.vendor_name}</p>
                      </div>
                    </div>
                    <div className="text-end">
                      <p
                        className="text-sm"
                        suppressHydrationWarning={suppressText}
                      >
                        {t('total_amount')}
                      </p>
                      <p
                        className="text-sm text-primary_BG"
                        suppressHydrationWarning={suppressText}
                      >
                        {orderData.price} {t(orderData.currency)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="py-3 border-b border-b-gray-300">
                  <div className="flex items-center">
                    <LocationOn fontSize={'small'} />
                    <h6
                      className="px-2 text-primary_BG"
                      suppressHydrationWarning={suppressText}
                    >
                      {t('location')}
                    </h6>
                  </div>
                  <div className="flex items-center">
                    {orderData.venodr_logo && (
                      <Image
                        src={`${orderData.vendor_logo}`}
                        width={50}
                        height={50}
                        alt={`${orderData.vendor_name}`}
                      />
                    )}
                    <div>
                      <p>{orderData.area}</p>
                      <p className="text-xs">{orderData.address}</p>
                    </div>
                  </div>
                </div>

                <div className="py-3 border-b border-b-gray-300">
                  <div className="flex items-center">
                    <DataUsageOutlined fontSize={'small'} />
                    <h6
                      className="px-2 text-primary_BG"
                      suppressHydrationWarning={suppressText}
                    >
                      {t('status')}
                    </h6>
                  </div>
                  <p>{orderData.status}</p>
                </div>

                <div className="py-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center pb-2">
                        <CalendarMonth fontSize={'small'} />
                        <h6
                          className="px-2 text-primary_BG"
                          suppressHydrationWarning={suppressText}
                        >
                          {t('class_date')}
                        </h6>
                      </div>
                      <p>{orderData.date}</p>
                    </div>
                    <div>
                      <div className="flex items-center pb-2">
                        <AccessTime fontSize={'small'} />
                        <h6
                          className="px-2 text-primary_BG"
                          suppressHydrationWarning={suppressText}
                        >
                          {t('time')}
                        </h6>
                      </div>
                      <p>{orderData.time}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {moduleType === '3' && (
              <div>
                <div className="pt-3 border-b border-b-gray-300">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="text-lg text-primary_BG">
                        {orderData.subscription_name}
                      </h4>
                      <div className="flex items-center pb-2">
                        <p className="text-sm">{orderData.vendor_name}</p>
                      </div>
                    </div>
                    <div className="text-end">
                      <p
                        className="text-sm"
                        suppressHydrationWarning={suppressText}
                      >
                        {t('total_amount')}
                      </p>
                      <p
                        className="text-sm text-primary_BG"
                        suppressHydrationWarning={suppressText}
                      >
                        {orderData.price} {t(orderData.currency)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="py-3 border-b border-b-gray-300">
                  <div className="flex items-center">
                    <LocationOn fontSize={'small'} />
                    <h6
                      className="px-2 text-primary_BG"
                      suppressHydrationWarning={suppressText}
                    >
                      {t('location')}
                    </h6>
                  </div>
                  <div className="flex items-center">
                    {orderData.venodr_logo && (
                      <Image
                        src={`${orderData.vendor_logo}`}
                        width={50}
                        height={50}
                        alt={`${orderData.vendor_name}`}
                      />
                    )}
                    <div>
                      <p>{orderData.area}</p>
                      <p className="text-xs">{orderData.address}</p>
                    </div>
                  </div>
                </div>

                <div className="py-3 border-b border-b-gray-300">
                  <div className="flex items-center">
                    <DataUsageOutlined fontSize={'small'} />
                    <h6
                      className="px-2 text-primary_BG"
                      suppressHydrationWarning={suppressText}
                    >
                      {t('status')}
                    </h6>
                  </div>
                  <p>{orderData.status}</p>
                </div>

                <div className="py-3 border-b border-b-gray-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center pb-2">
                        <CalendarMonth fontSize={'small'} />
                        <h6
                          className="px-2 text-primary_BG"
                          suppressHydrationWarning={suppressText}
                        >
                          {t('class_date')}
                        </h6>
                      </div>
                      <p>{orderData.start_date}</p>
                    </div>
                  </div>
                </div>

                <div className="py-3 ">
                  <div className="flex items-center">
                    <EventAvailableOutlined fontSize={'small'} />
                    <h6
                      className="px-2 text-primary_BG"
                      suppressHydrationWarning={suppressText}
                    >
                      {t('subscribed_on')}
                    </h6>
                  </div>
                  <p>{orderData.subscribed_on}</p>
                </div>
              </div>
            )}
          </>
        ) : (
          <LoadingSpinner />
        )}
      </div>
    </MainContentLayout>
  );
};

export default OrderDetails;
