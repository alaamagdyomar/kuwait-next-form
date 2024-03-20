import MainHead from '@/components/MainHead';
import { NextPage } from 'next';
import { wrapper } from '@/redux/store';
import { AppQueryResult, Club } from '@/types/queries';
import { apiSlice } from '@/redux/api';
import { subscriptionApi } from '@/redux/api/subscriptionApi';
import Link from 'next/link';
import {
  appLinks,
  imageSizes,
  submitBtnClass,
  suppressText,
} from '@/constants/*';
import GreyLine from '@/components/GreyLine';
import AminitiesIcon from '@/appIcons/aminities.svg';
import CalenderIcon from '@/appIcons/calender.svg';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import LocationIcon from '@/appIcons/location.svg';
import React, { useEffect, useState } from 'react';
import { Amenities, Subscription } from '@/types/queries';
import MainContentLayout from '@/layouts/MainContentLayout';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  setCurrentModule,
  showToastMessage,
} from '@/redux/slices/appSettingSlice';
import NoResultImage from '@/appImages/no_results_found.jpg';
import { useSetSubscriptionMutation } from '@/redux/api/cartApi';
import { setCartSubscription, setCurrentMode } from '@/redux/slices/cartSlice';
import { useRouter } from 'next/router';
import { first, isEmpty, isNull, map } from 'lodash';
import { isAuthenticated, isVerified } from '@/redux/slices/authSlice';
import { setCurrentElement } from '@/redux/slices/currentElementSlice';
import SubscriptionSelectDateModal from '@/widgets/subscription/SubscriptionSelectDateModal';
import PickDateModal from '@/components/modals/PickDateModal';
import moment from 'moment';
import {
  dateSelected,
  setSearchDateSelected,
} from '@/redux/slices/searchParamsSlice';
import { setBackPath } from '@/redux/slices/guestSlice';
import ElementMap from '@/components/ElementMap';

type Props = {
  element: Club;
};
const SubscriptionShow: NextPage<Props> = ({ element }): JSX.Element => {
  const { t } = useTranslation();
  const router = useRouter();
  const {
    country: { id: country },
    locale: { lang },
    guest: { guestMode, backPath },
    currentElement: { element: selectedSubscription, type },
    searchParams,
  } = useAppSelector((state) => state);
  const [btnDisabled, setBtnDisabled] = useState<boolean>(true);
  const dispatch = useAppDispatch();

  const [showSubscriptionDateModal, setShowSubscriptionDateModal] =
    useState(false);
  const searchDateSelected = useAppSelector(dateSelected);
  const { query }: any = useRouter();

  useEffect(() => {
    dispatch(setCurrentModule(element.vendor_name));
    dispatch(setSearchDateSelected(moment().toString()));
    dispatch(
      setCurrentElement({
        element: first(element.subscriptions),
        type: `subscription`,
      })
    );
    dispatch(setCurrentMode(`subscription`));
  }, []);

  const handleSelectSubscription = (s: Subscription) => {
    dispatch(setCurrentElement({ element: s, type: `subscription` }));
    setShowSubscriptionDateModal(true);
    setBtnDisabled(false);
  };

  useEffect(() => {
    dispatch(
      setBackPath(
        `${appLinks.cartReview.path}?currentPath=${query.params[0]}&vendor_id=${element.vendor_id}&subCategoryId=${query.categoryId}`
      )
    );
  }, [selectedSubscription]);



  return (
    <>
      <MainHead
        title={`${element.vendor_name}`}
        description={element.vendor_name}
        mainImage={element.vendor_logo ?? element.vendor_banner}
      />
      <MainContentLayout>
        <div className="my-2">
          <Image
            alt="banner"
            width={imageSizes.xl}
            height={imageSizes.xl}
            src={`${element.vendor_banner}`}
            className="h-36 w-full rounded-md"
          />
        </div>

        <div className="grid grid-cols-2 flex items-center">
          <div className="flex p-px items-center">
            <Image
              alt="logo"
              width={imageSizes.xl}
              height={imageSizes.xl}
              src={`${element.vendor_logo}`}
              className="rounded-md w-10 h-10 object-cover rtl:ml-2 ltr:mr-2 "
              sizes="(max-width: 768px) 100vw,
                          (max-width: 1200px) 50vw,
                          33vw"
            />
            <div className="text-start mx-1">
              <p className="">{element.vendor_name}</p>
              <p className="text-xxs">{element.area}</p>
            </div>
          </div>

          <div className="flex flex-col justify-between items-end">
            <p
              className="text-primary_BG"
              suppressHydrationWarning={suppressText}
            >
              {element.price}
            </p>
            <p className="bg-SearchGrey rounded-xl px-1.5 text-xxs">
              {element.space}
            </p>
          </div>

          {/* description */}
          <div className="col-span-2 text-sm mt-3">
            <p
              className="text-primary_BG px-1 text-sm"
              suppressHydrationWarning={suppressText}
            >
              {t('description')}
            </p>
            <p>{element.description}</p>
          </div>
        </div>

        <GreyLine className="my-4 " />
        <div className="flex items-center mb-2">
          <Image
            src={AminitiesIcon}
            width={imageSizes.xl}
            height={imageSizes.xl}
            alt={`aminities`}
            className={`w-4 h-4`}
          />
          <p
            className="text-primary_BG px-1 text-sm"
            suppressHydrationWarning={suppressText}
          >
            {t('categories')}
          </p>
        </div>

        {element.categories ? (
          <div className="flex justify-start bg-LighterGray rounded-md p-2 mt-1 mb-7">
            <p className="w-fit text-sm">{element.categories}</p>
          </div>
        ) : (
          <div className="flex justify-center bg-LighterGray rounded-md p-2 mt-1 mb-7">
            <Image
              src={NoResultImage}
              alt="no result"
              width={imageSizes.xl}
              height={imageSizes.xl}
              className={`w-80 h-auto `}
            />
            <p
              className="w-fit text-sm"
              suppressHydrationWarning={suppressText}
            >
              {t('no_categories_found')}
            </p>
          </div>
        )}

        <div className="flex items-center mb-2">
          <Image
            src={CalenderIcon}
            alt={`calender`}
            width={imageSizes.xl}
            height={imageSizes.xl}
            className={`w-4 h-4`}
          />
          <p
            className="text-primary_BG px-1 text-sm"
            suppressHydrationWarning={suppressText}
          >
            {t('subscriptions')}
          </p>
        </div>

        {isEmpty(element.subscriptions) ? (
          <div className="flex justify-center text-sm my-3">
            <p suppressHydrationWarning={suppressText}>
              {t('no_subscriptions_found')}
            </p>
          </div>
        ) : (
          <div className="mb-7">
            {!isEmpty(selectedSubscription) &&
              map(element.subscriptions, (item: Subscription, i) => {
                return (
                  <div
                    key={i}
                    className="flex justify-between text-sm gap-x-2 py-3"
                  >
                    <div className="flex items-start">
                      <input
                        onClick={() => {
                          handleSelectSubscription(item);
                        }}
                        // defaultChecked={selectedSubscription.id === item.id}
                        className="mx-2 mt-1"
                        type="radio"
                        name="subscription"
                      />
                      <div className="flex flex-col items-start">
                        <Link
                          scroll={true}
                          onClick={() =>
                            dispatch(
                              setCurrentElement({
                                element: item,
                                type: `subscription`,
                              })
                            )
                          }
                          href={appLinks.subscriptionPlan(country, item.id)}
                        >
                          <p className="text-primary_BG cursor-pointer">
                            {item.name}
                          </p>
                        </Link>
                        <p>{item.subscription_duration}</p>
                      </div>
                    </div>
                    <p
                      className="text-primary_BG"
                      suppressHydrationWarning={suppressText}
                    >
                      {item.price} {t(element.currency)}
                    </p>
                  </div>
                );
              })}
          </div>
        )}
        {!isEmpty(selectedSubscription) && (
          <>
            {/* aminities */}
            {/* issue form buisness to rmv aminities from sub details */}
            {/* <div className="flex items-center mb-2">
              <Image
                src={AminitiesIcon}
                alt={`aminities`}
                width={imageSizes.xl}
                height={imageSizes.xl}
                className={`w-4 h-4`}
              />
              <p
                className="text-primary_BG px-1 text-sm"
                suppressHydrationWarning={suppressText}
              >
                {t('aminities')}
              </p>
            </div> */}

            {/* <div className="grid grid-flow-col gap-x-2 gap-y-3 mt-1 mb-7 bg-LighterGray rounded-md p-2 h-24">
              {map(selectedSubscription.amenities, (item: Amenities, i) => {
                return (
                  <div
                    key={i}
                    className="flex flex-col items-center justify-center"
                  >
                    <Image
                      className="h-10 w-10"
                      alt={item.name}
                      src={item.icon}
                      width={imageSizes.xl}
                      height={imageSizes.xl}
                    />
                    <p className="text-primary_BG text-xs py-1 pt-3">
                      {item.name}
                    </p>
                  </div>
                );
              })}
            </div> */}
            
            {/* location */}
            <div className="flex items-center mb-2">
              <Image
                src={LocationIcon}
                fill={false}
                alt={`location`}
                className={`w-4 h-4`}
                width={imageSizes.xl}
                height={imageSizes.xl}
              />
              <p
                className="text-primary_BG px-1 text-sm"
                suppressHydrationWarning={suppressText}
              >
                {t('location')}
              </p>
            </div>
            {!isEmpty(selectedSubscription) &&
              selectedSubscription.latitude &&
              selectedSubscription.longitude && (
                <ElementMap lat={selectedSubscription.latitude} lng={selectedSubscription.longitude} />
              )}
          </>
        )}

        <div className={`flex flex-1 w-full`}>
          <button
            // onClick={() => handleClick()}
            onClick={() => setShowSubscriptionDateModal(true)}
            // disabled={isNull(selectedSubscription)}
            disabled={btnDisabled}
            className={`${submitBtnClass} text-center mt-8`}
            suppressHydrationWarning={suppressText}
          >
            {t('continue')}
          </button>
        </div>
        {selectedSubscription && (
          <SubscriptionSelectDateModal
            showSubscriptionDateModal={showSubscriptionDateModal}
            setShowSubscriptionDateModal={setShowSubscriptionDateModal}
            showCalender={selectedSubscription?.pre_starting_date}
          />
        )}
        <PickDateModal />
      </MainContentLayout>
    </>
  );
};

export default SubscriptionShow;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const { categoryId, id, country }: any = await context.query;
    const lang: any = await context.locale;
    if (!categoryId || !id || !country) {
      return {
        notFound: true,
      };
    }
    const {
      data: element,
      isError,
    }: {
      data: AppQueryResult<Club>;
      isError: boolean;
    } = await store.dispatch(
      subscriptionApi.endpoints.getSubscription.initiate({
        lang,
        country,
        id,
        categoryId,
        query: context.params?.params ?? ``,
      })
    );
    await Promise.all(store.dispatch(apiSlice.util.getRunningQueriesThunk()));
    if (isError || !element.data) {
      return {
        notFound: true,
      };
    }
    return {
      props: {
        element: element.data,
      },
    };
  }
);
