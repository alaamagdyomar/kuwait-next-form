import MainHead from '@/components/MainHead';
import { NextPage } from 'next';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  useGetClassAppointmentHistoryQuery,
  useGetOrderHistoryQuery,
  useGetSportAppointmentHistoryQuery,
  useGetSubscriptionAppointmentHistoryQuery,
} from '@/redux/api/authApi';
import { map } from 'lodash';
import {
  AppointmentHistory,
  AppQueryResult,
  PreviousOrder,
} from '@/types/queries';
import LoadingSpinner from '@/components/LoadingSpinner';
import React, { useEffect, useState } from 'react';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Grid3x3Icon from '@mui/icons-material/Grid3x3';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ShareCopyLocation from '@/components/ShareCopyLocation';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { appLinks, splitPrice, suppressText } from '@/constants/*';
import { setCurrentModule } from '@/redux/slices/appSettingSlice';
import MainContentLayout from '@/layouts/MainContentLayout';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Link from 'next/link';
const NoDataFound = dynamic(() => import(`@/components/NoDataFound`), {
  ssr: false,
});

const OrderHistoryPage: NextPage = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [value, setvalue] = useState<string>('4');
  const {
    auth: { access_token: token },
    country: { id: country },
  } = useAppSelector((state) => state);
  const {
    data: orderElements,
    isSuccess: orderHistorySuccess,
    isLoading: orderHistoryLoading,
  } = useGetOrderHistoryQuery<{
    data: AppQueryResult<PreviousOrder[]>;
    isSuccess: boolean;
    isLoading: boolean;
  }>(
    {
      country: country.toString(),
      token,
    },
    { refetchOnMountOrArgChange: true }
  );
  const {
    data: classAppointmentHistoryElements,
    isSuccess: classAppointmentHistorySuccess,
    isLoading: classAppointmentHistoryLoading,
  } = useGetClassAppointmentHistoryQuery<{
    data: AppQueryResult<AppointmentHistory[]>;
    isSuccess: boolean;
    isLoading: boolean;
  }>(
    {
      country: country.toString(),
      token,
    },
    { refetchOnMountOrArgChange: true }
  );

  const {
    data: sportAppointmentHistoryElements,
    isSuccess: sportAppointmentHistorySuccess,
    isLoading: sportAppointmentHistoryLoading,
  } = useGetSportAppointmentHistoryQuery<{
    data: AppQueryResult<AppointmentHistory[]>;
    isSuccess: boolean;
    isLoading: boolean;
  }>(
    {
      country: country.toString(),
      token,
    },
    { refetchOnMountOrArgChange: true }
  );

  const {
    data: subscriptionAppointmentHistoryElements,
    isSuccess: subscriptionAppointmentHistorySuccess,
    isLoading: subscriptionAppointmentHistoryLoading,
  } = useGetSubscriptionAppointmentHistoryQuery<{
    data: AppQueryResult<AppointmentHistory[]>;
    isSuccess: boolean;
    isLoading: boolean;
  }>(
    {
      country: country.toString(),
      token,
    },
    { refetchOnMountOrArgChange: true }
  );

  useEffect(() => {
    dispatch(setCurrentModule(t('order_history')));
  }, []);

  return (
    <>
      <MainHead
        title={`order_history`}
        description={`order_history_description`}
      />
      <MainContentLayout backHome={true}>
        <div>
          <Tabs
            centered={true}
            value={value}
            onChange={(e, newVal) => setvalue(newVal)}
          >
            <Tab
              suppressHydrationWarning={suppressText}
              label={t('store')}
              value={'4'}
            />
            <Tab
              suppressHydrationWarning={suppressText}
              label={t('sports')}
              value={'1'}
            />
            <Tab
              suppressHydrationWarning={suppressText}
              label={t('classes')}
              value={'2'}
            />
            <Tab
              suppressHydrationWarning={suppressText}
              label={t('subscriptions')}
              value={'3'}
            />
          </Tabs>
          <div className={`flex flex-col space-y-1 mt-5 `}>
            {(orderHistoryLoading ||
              classAppointmentHistoryLoading ||
              sportAppointmentHistoryLoading ||
              subscriptionAppointmentHistoryLoading) && <LoadingSpinner />}
            {value === '4' && orderHistorySuccess && (
              <>
                {orderElements.data.length === 0 ? (
                  <NoDataFound title="no_results_found" listSrc={true} />
                ) : (
                  map(
                    orderElements?.data,
                    (e: PreviousOrder, index: number) => (
                      <Link
                        href={{
                          pathname: appLinks.orderDetails.path,
                          query: { data: JSON.stringify(e), moduleType: 4 },
                        }}
                        key={index}
                      >
                        <div
                          // onClick={() => {router.push(`${appLinks.orderDetails.path}`)}}
                          className="rounded-md bg-HistoryBG px-3 py-1 mb-3"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <p
                              className="text-sm text-primary_BG"
                              suppressHydrationWarning={suppressText}
                            >
                              {t('order')} {index + 1}
                            </p>
                            <div
                              className={`flex justify-center items-center ${
                                e.status === 'confirmed' && 'bg-lime-600'
                              } ${
                                e.status === 'pending' && 'bg-amber-500'
                              } px-2 text-xs rounded-full text-white text-enter mt-2 shadow-md broder-gray-100`}
                              suppressHydrationWarning={suppressText}
                            >
                              <span className={`pt-1`}>{e.status}</span>
                            </div>
                          </div>

                          <div className="flex flex-col justify-start text-xs mb-2">
                            <div className="flex ">
                              <LocationOnIcon sx={{ fontSize: 14 }} />
                              <p
                                className="px-1"
                                suppressHydrationWarning={suppressText}
                              >
                                {t('address')} :{' '}
                                {Object.entries(e.address)
                                  .map((entry) => entry.join(': '))
                                  .join(',')}
                              </p>
                            </div>
                            <div className="flex ">
                              <Grid3x3Icon sx={{ fontSize: 16 }} />
                              <p
                                className="px-1"
                                suppressHydrationWarning={suppressText}
                              >
                                {t('code')} : {e.order_code}
                              </p>
                            </div>
                          </div>

                          {/* booked on */}
                          <div className="w-full mb-2">
                            <p
                              className="text-sm text-primary_BG w-fit"
                              suppressHydrationWarning={suppressText}
                            >
                              {t('bought_on')}
                            </p>
                            <div className="flex justify-between text-xs">
                              <p>{e.orderedOn}</p>
                              <p className="text-primary_BG">
                                {splitPrice(e.total.toString()).price}{' '}
                                {t(splitPrice(e.total.toString()).currency)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    )
                  )
                )}
              </>
            )}

            {value === '2' && classAppointmentHistorySuccess && (
              <>
                {classAppointmentHistoryElements.data.length === 0 ? (
                  <NoDataFound title="no_results_found" listSrc={true} />
                ) : (
                  map(
                    classAppointmentHistoryElements?.data,
                    (e: AppointmentHistory, index: number) => (
                      <Link
                        href={{
                          pathname: appLinks.orderDetails.path,
                          query: { data: JSON.stringify(e), moduleType: '2' },
                        }}
                        key={index}
                      >
                        <div
                          onClick={() => {
                            router.push(`${appLinks.orderDetails.path}`);
                          }}
                          key={index}
                          className="rounded-md bg-HistoryBG px-3 py-1 mb-3 "
                        >
                          <div className="flex justify-between items-center ">
                            <div className="flex flex-col items-start">
                              <p className="text-xl text-primary_BG w-fit">
                                {e.class_name}
                              </p>
                            </div>
                            <div
                              className={`flex justify-center items-center ${
                                e.status === 'confirmed' && 'bg-lime-600'
                              } ${
                                e.status === 'pending' && 'bg-amber-500'
                              } px-2 text-xs rounded-full text-white text-enter mt-2 shadow-md broder-gray-100`}
                              suppressHydrationWarning={suppressText}
                            >
                              <span className={`pt-1`}>{e.status}</span>
                            </div>
                          </div>

                          <div className="flex flex-col justify-start text-xs my-2">
                            <div className="flex pb-1.5">
                              <CalendarMonthIcon sx={{ fontSize: 14 }} />
                              <p className="px-1">{e.date}</p>
                            </div>

                            <div className="flex pb-1.5">
                              <AccessTimeIcon sx={{ fontSize: 14 }} />
                              <p className="px-1">{e.time}</p>
                            </div>

                            <div className="flex ">
                              <LocationOnIcon sx={{ fontSize: 14 }} />
                              <p className="px-1">{e.area}</p>
                            </div>
                          </div>

                          {/* booked on */}
                          <div className="w-full mb-2">
                            <p
                              className="text-primary_BG w-fit"
                              suppressHydrationWarning={suppressText}
                            >
                              {t('booked_on')}
                            </p>
                            <div className="flex justify-between text-xs">
                              <p>{e.bookedOn}</p>
                            </div>
                          </div>

                          <div className="h-px bg-black w-full"></div>

                          {/* share loc and price */}
                          <div className="flex justify-between items-center py-2">
                            <ShareCopyLocation
                              lat={e.latitude}
                              long={e.longitude}
                              ShareMsg={e.share_message}
                            />
                            <p
                              className="text-primary_BG"
                              suppressHydrationWarning={suppressText}
                            >
                              {e.price} {t(e.currency)}
                            </p>
                          </div>
                        </div>
                      </Link>
                    )
                  )
                )}
              </>
            )}

            {value === '1' && sportAppointmentHistorySuccess && (
              <>
                {sportAppointmentHistoryElements.data.length === 0 ? (
                  <NoDataFound title="no_results_found" listSrc={true} />
                ) : (
                  map(
                    sportAppointmentHistoryElements?.data,
                    (e: AppointmentHistory, i) => (
                      <Link
                        href={{
                          pathname: appLinks.orderDetails.path,
                          query: { data: JSON.stringify(e), moduleType: '1' },
                        }}
                        key={i}
                      >
                        <div className="rounded-md bg-HistoryBG px-3 py-1 mb-3">
                          <div className="flex justify-between items-center mb-2">
                            <p className="text-sm text-primary_BG">{e.venue}</p>
                            <div
                              className={`flex justify-center items-center ${
                                e.status === 'confirmed' && 'bg-lime-600'
                              } ${
                                e.status === 'pending' && 'bg-amber-500'
                              } px-2 text-xs rounded-full text-white text-enter mt-2 shadow-md broder-gray-100`}
                              suppressHydrationWarning={suppressText}
                            >
                              <span className={`pt-1`}>{e.status}</span>
                            </div>
                          </div>

                          <div className="flex flex-col justify-start text-xs mb-3">
                            <div className="flex pb-1.5">
                              <LocationOnIcon sx={{ fontSize: 14 }} />
                              <p className="px-1">{e.area}</p>
                            </div>

                            <div className="flex">
                              <CalendarMonthIcon sx={{ fontSize: 14 }} />
                              <p className="px-1">
                                {e.time}
                                <span className="text-primary_BG px-1">
                                  {' '}
                                  |{' '}
                                </span>{' '}
                                {e.date}
                              </p>
                            </div>
                          </div>

                          {/* booked on */}
                          <div className="w-full mb-2">
                            <p
                              className="text-primary_BG w-fit"
                              suppressHydrationWarning={suppressText}
                            >
                              {t('booked_on')}
                            </p>
                            <div className="flex justify-between text-xs">
                              <p>{e.booked_on}</p>
                            </div>
                          </div>

                          <div className="h-px bg-black w-full"></div>

                          {/* share loc and price */}
                          <div className="flex justify-between items-center py-2">
                            <ShareCopyLocation
                              lat={e.latitude}
                              long={e.longitude}
                              ShareMsg={e.share_message}
                            />
                            <p className="text-primary_BG">
                              {e.price} {t(e.currency)}
                            </p>
                          </div>
                        </div>
                      </Link>
                    )
                  )
                )}
              </>
            )}

            {value === '3' && subscriptionAppointmentHistorySuccess && (
              <>
                {subscriptionAppointmentHistoryElements.data.length === 0 ? (
                  <NoDataFound title="no_results_found" listSrc={true} />
                ) : (
                  map(
                    subscriptionAppointmentHistoryElements?.data,
                    (e: AppointmentHistory, index: number) => (
                      <Link
                        href={{
                          pathname: appLinks.orderDetails.path,
                          query: { data: JSON.stringify(e), moduleType: '3' },
                        }}
                        key={index}
                      >
                        {' '}
                        <div className="rounded-md bg-HistoryBG px-3 py-1 mb-3">
                          <div className="flex justify-between">
                            <div className="flex flex-col items-start mb-2">
                              <p className="text-xl text-primary_BG w-fit">
                                {e.subscription_name}
                              </p>
                              <div className="flex text-xs">
                                <p>{e.subscription_duration}</p>
                              </div>
                            </div>
                            <div>
                              <div
                                className={`flex justify-center items-center ${
                                  e.status === 'confirmed' && 'bg-lime-600'
                                } ${
                                  e.status === 'pending' && 'bg-amber-500'
                                } px-2 text-xs rounded-full text-white text-enter mt-2 shadow-md broder-gray-100`}
                                suppressHydrationWarning={suppressText}
                              >
                                <span className={`pt-1`}>{e.status}</span>
                              </div>
                              {/* <p
                                className={`${
                                  e.status === 'confirmed' && 'bg-lime-600'
                                } ${
                                  e.status === 'pending' && 'bg-amber-500'
                                } px-2 text-xs rounded-full text-white text-center`}
                                suppressHydrationWarning={suppressText}
                              >
                                {e.status}
                              </p> */}
                            </div>
                          </div>

                          <div className="flex flex-col justify-start text-xs my-2">
                            <div className="flex pb-1.5">
                              <LocationOnIcon sx={{ fontSize: 14 }} />
                              <p className="px-1">{e.area}</p>
                            </div>
                            <div className="flex pb-1.5">
                              <CalendarMonthIcon sx={{ fontSize: 14 }} />
                              <p
                                className="px-1"
                                suppressHydrationWarning={suppressText}
                              >
                                {t('start_date:')} {e.start_date}
                              </p>
                            </div>
                          </div>

                          {/* booked on */}
                          <div className="w-full mb-2">
                            <p
                              className="text-primary_BG w-fit"
                              suppressHydrationWarning={suppressText}
                            >
                              {t('subscribed_on')}
                            </p>
                            <div className="flex justify-between text-xs">
                              <p>{e.subscribed_on}</p>
                            </div>
                          </div>

                          <div className="h-px bg-black w-full"></div>

                          {/* share loc and price */}
                          <div className="flex justify-between items-center py-2">
                            <ShareCopyLocation
                              lat={e.latitude}
                              long={e.longitude}
                              ShareMsg={e.share_message}
                            />
                            <p
                              className="text-primary_BG"
                              suppressHydrationWarning={suppressText}
                            >
                              {e.price} {t(e.currency)}
                            </p>
                          </div>
                        </div>
                      </Link>
                    )
                  )
                )}
              </>
            )}
          </div>
        </div>
      </MainContentLayout>
    </>
  );
};

export default OrderHistoryPage;

// export const getServerSideProps = wrapper.getServerSideProps(
//   (store) => async (context) => {
//     return {
//       props: {},
//     };
//   }
// );
