import { useEffect, useState } from 'react';
import { NextPage } from 'next';
import MainContentLayout from '@/layouts/MainContentLayout';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setCurrentModule } from '@/redux/slices/appSettingSlice';
import { useRouter } from 'next/router';
import ClassElement from '@/widgets/cart/review/ClassElement';
import PaymentSummary from '@/widgets/cart/review/PaymentSummary';
import PaymentMethods from '@/components/widgets/cart/review/PaymentMethods';
import SubscriptionElement from '@/widgets/cart/review/SubscriptionElement';
import VenueElement from '@/components/widgets/cart/review/VenueElement';
import { submitBtnClass, appLinks } from '@/constants/*';
import { useProceedToSubscriptionPaymentMutation } from '@/redux/api/subscriptionApi';
import { isNull } from 'lodash';
import { PaymentMethod } from '@/types/index';
import { useProceedToVenuePaymentMutation } from '@/redux/api/venueApi';
import { orderMade, resetOrderIdInvoice } from '@/redux/slices/orderSlice';
import { useProceedToClassPaymentMutation } from '@/redux/api/classApi';
import LoadingSpinner from '@/components/LoadingSpinner';
import { dateSelected } from '@/redux/slices/searchParamsSlice';
import { isAuthenticated } from '@/redux/slices/authSlice';
import EventElement from '@/widgets/cart/review/EventElement';
import { useProceedToEventPaymentMutation } from '@/redux/api/eventApi';
import { isGuestMode } from '@/redux/slices/guestSlice';
import {
  disableAppLoading,
  enableAppLoading,
} from '@/redux/slices/appLoadingSlice';

const CartReviewPage: NextPage = (): JSX.Element => {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    appLoading: { loading },
    searchParams: { searchTimeSelected },
    currentElement: { element, type: elementType },
    locale: { lang },
    country: {
      id: country_id,
      name: country_name,
      name_ar: country_name_ar,
      currency: country_currency,
    },
    guest: {
      name: guest_name,
      phone: guest_phone,
      gender: guest_gender,
      guestMode,
    },
    auth: {
      user: { id: user_id },
    },
    cart: {
      isEmpty,
      classes,
      event,
      subscription,
      venue,
      currentMode,
      paymentMethods,
    },
  } = useAppSelector((state) => state);
  const searchDateSelected = useAppSelector(dateSelected);
  const isAuth = useAppSelector(isAuthenticated);
  const isGuest = useAppSelector(isGuestMode);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(
    null
  );
  const [triggerSubscription, { isLoading: subscriptionLoading }] =
    useProceedToSubscriptionPaymentMutation();
  const [triggerVenue, { isLoading: venueLoading }] =
    useProceedToVenuePaymentMutation();
  const [triggerClass, { isLoading: classLoading }] =
    useProceedToClassPaymentMutation();
  const [triggerEvent, { isLoading: eventLoading }] =
    useProceedToEventPaymentMutation();

  useEffect(() => {
    if (isEmpty || !element || !elementType || (!isGuest && !isAuth)) {
      router.replace({
        pathname: '/',
        query: {
          country_id,
          country_name,
          country_name_ar,
          country_currency,
        },
      });
    }
    if (currentMode === 'product') {
      dispatch(setCurrentModule(t('review_ur_info')));
    } else {
      dispatch(setCurrentModule(t('review_ur_booking')));
    }
  }, []);

  const handleClick = async () => {
    dispatch(resetOrderIdInvoice());
    if (!guestMode && !isAuth) {
      await router.push(appLinks.login.path);
    }
    dispatch(enableAppLoading());
    switch (currentMode) {
      case 'subscription':
        return await triggerSubscription({
          lang,
          country: country_id,
          params: {
            guest_name,
            guest_phone,
            guest_gender,
            user_id,
            start_date: searchDateSelected,
            subscription_id: element.id,
            payment_method: paymentMethod.name,
            channel: 'web',
          },
        }).then((r: any): Promise<any> => dispatch(orderMade(r)));
        break;
      case 'venue':
        return await triggerVenue({
          lang,
          country: country_id,
          params: {
            guest_name,
            guest_phone,
            guest_gender,
            user_id,
            time: searchTimeSelected,
            date: searchDateSelected,
            total: element.price,
            venue_id: element.id,
            payment_method: paymentMethod.name,
            channel: 'web',
          },
        }).then((r: any): Promise<any> => dispatch(orderMade(r)));
        break;
      case 'classes':
        return await triggerClass({
          lang,
          country: country_id,
          params: {
            guest_name,
            guest_phone,
            guest_gender,
            user_id,
            class_id: element.id,
            date: searchDateSelected,
            payment_method: paymentMethod.name,
            channel: 'web',
          },
        }).then((r: any): Promise<any> => dispatch(orderMade(r)));
        break;
      case 'event':
        return await triggerEvent({
          lang,
          country: country_id,
          params: {
            guest_name,
            guest_phone,
            guest_gender,
            user_id,
            event_id: element.id,
            date: searchDateSelected,
            payment_method: paymentMethod.name,
            channel: 'web',
          },
        }).then((r: any): Promise<any> => dispatch(orderMade(r)));
        break;
    }
  };

  if (
    subscriptionLoading ||
    classLoading ||
    venueLoading ||
    eventLoading ||
    (!isAuth && !isGuest) ||
    loading
  ) {
    return <LoadingSpinner />;
  }

  return (
    <MainContentLayout>
      <div className={`mt-6`}>
        {currentMode === 'classes' && classes && (
          <ClassElement classes={classes} />
        )}
        {currentMode === 'event' && classes && <EventElement event={event} />}
        {currentMode === 'subscription' && subscription && (
          <SubscriptionElement subscription={subscription} />
        )}
        {currentMode === 'venue' && venue && <VenueElement venue={venue} />}
        <PaymentSummary
          element={
            currentMode === `classes`
              ? classes
              : currentMode === `venue`
              ? venue
              : currentMode === `event`
              ? event
              : subscription
          }
        />
        <PaymentMethods
          elements={paymentMethods}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
        />
        <button
          onClick={() => handleClick()}
          className={`${submitBtnClass} mt-8`}
          disabled={
            isNull(paymentMethod) ||
            venueLoading ||
            classLoading ||
            subscriptionLoading
          }
        >
          {t('continue')}
        </button>
      </div>
    </MainContentLayout>
  );
};

export default CartReviewPage;
