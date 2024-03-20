import { NextPage } from 'next';
import { wrapper } from '@/redux/store';
import { AppQueryResult, Subscription } from '@/types/queries';
import { apiSlice } from '@/redux/api';
import { subscriptionApi } from '@/redux/api/subscriptionApi';
import GreyLine from '@/components/GreyLine';
import GeneralCarousel from '@/components/GeneralCarousel';
import BlueRight from '@/appIcons/blue_right.svg';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import MainContentLayout from '@/layouts/MainContentLayout';
import MainHead from '@/components/MainHead';
import React, { useEffect, useState } from 'react';
import {
  setCurrentModule,
  showToastMessage,
} from '@/redux/slices/appSettingSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  appLinks,
  imageSizes,
  submitBtnClass,
  suppressText,
} from '@/constants/*';
import { setCurrentElement } from '@/redux/slices/currentElementSlice';
import SubscriptionSelectDateModal from '@/widgets/subscription/SubscriptionSelectDateModal';
import PickDateModal from '@/components/modals/PickDateModal';
import { useSetSubscriptionMutation } from '@/redux/api/cartApi';
import { isAuthenticated, isVerified } from '@/redux/slices/authSlice';
import { dateSelected } from '@/redux/slices/searchParamsSlice';
import { useRouter } from 'next/router';
import { isNull } from 'lodash';
import moment from 'moment/moment';
import { setCartSubscription } from '@/redux/slices/cartSlice';
import ElementMap from '@/components/ElementMap';

type Props = {
  element: Subscription;
};
const SubscriptionPlanShow: NextPage<Props> = ({ element }): JSX.Element => {
  const { t } = useTranslation();
  const {
    currentElement: { element: subscription },
  } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const [showSubscriptionDateModal, setShowSubscriptionDateModal] =
    useState(false);
  const router: any = useRouter();
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState<
    Subscription['id'] | null
  >(router.query.id);

  useEffect(() => {
    dispatch(setCurrentModule(element.name));
  }, []);
  
  return (
    <>
      <MainHead
        title={`${element.name}`}
        description={element.description}
        mainImage={element?.images[0]}
      />
      <MainContentLayout>
        {/* <div>Subscription Plan Show</div>
        <div>name : {element.name}</div> */}
        <div className="my-3">
          <GeneralCarousel slides={element.images} />
        </div>
        {/* name and price */}
        <div className="flex justify-between text-primary_BG font-semibold">
          <p>{element.name}</p>
          <p>{element.price}</p>
        </div>
        <GreyLine className="my-2" />
        {/* aminities */}
        <div>
          {element.amenities.map((item) => {
            return (
              <div key={item.id} className="flex items-center mb-1">
                <Image
                  src={BlueRight}
                  fill={false}
                  alt={`aminities`}
                  className={`w-4 h-4`}
                  width={imageSizes.xl}
                  height={imageSizes.xl}
                />
                <p className="text-sm px-2">{item.name}</p>
              </div>
            );
          })}
        </div>

        <GreyLine className="my-2" />
        {/* description */}
        <div className="flex flex-col items-start mb-7">
          <p
            className="text-primary_BG w-fit"
            suppressHydrationWarning={suppressText}
          >
            {t('about_this_subscription')}
          </p>
          <p className="text-xs w-fit text-justify">{element.description}</p>
        </div>

        {/* location */}

        {element.latitude && element.longitude && (
          <>
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
            <ElementMap lat={element.latitude} lng={element.longitude} />
          </>
        )}

        <div className={`flex flex-1 w-full`}>
          <button
            // onClick={() => handleClick()}
            onClick={() => setShowSubscriptionDateModal(true)}
            disabled={isNull(subscription)}
            className={`${submitBtnClass} text-center mt-8`}
            suppressHydrationWarning={suppressText}
          >
            {t('continue')}
          </button>
        </div>

        {selectedSubscriptionId && (
          <SubscriptionSelectDateModal
            showSubscriptionDateModal={showSubscriptionDateModal}
            setShowSubscriptionDateModal={setShowSubscriptionDateModal}
            showCalender={subscription?.pre_starting_date}
          />
        )}
        <PickDateModal />
      </MainContentLayout>
    </>
  );
};

export default SubscriptionPlanShow;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const lang: any = context.locale;
    const { id, country }: any = await context.query;
    if (!id) {
      return {
        notFound: true,
      };
    }
    const {
      data: element,
      isError,
    }: {
      data: AppQueryResult<Subscription>;
      isError: boolean;
    } = await store.dispatch(
      subscriptionApi.endpoints.getSubscriptionPlan.initiate({
        lang,
        country,
        id,
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
