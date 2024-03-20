import { useEffect, useState } from 'react';
import MainHead from '@/components/MainHead';
import { NextPage } from 'next';
import { wrapper } from '@/redux/store';
import { booking_times, Venue, Amenities } from '@/types/queries';
import { venueApi } from '@/redux/api/venueApi';
import { apiSlice } from '@/redux/api';
import GeneralCarousel from '@/components/GeneralCarousel';
import { useTranslation } from 'react-i18next';
import GreyLine from '@/components/GreyLine';
import { useRouter } from 'next/router';
import {
  setCurrentModule,
  showPickDateModal,
  showToastMessage,
} from '@/redux/slices/appSettingSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import PickDateModal from '@/components/modals/PickDateModal';
import Transaction_DateIcon from '@/appIcons/transaction_date.svg';
import BookingsIcon from '@/appIcons/bookings.svg';
import AminitiesIcon from '@/appIcons/aminities.svg';
import LocationIcon from '@/appIcons/location.svg';
import Image from 'next/image';
import {
  appLinks,
  grayBtnClass,
  imageSizes,
  submitBtnClass,
  suppressText,
} from '@/constants/*';
import MainContentLayout from '@/layouts/MainContentLayout';
import { useSetVenueMutation } from '@/redux/api/cartApi';
import { isEmpty } from 'lodash';
import { setCartVeneu, setCurrentMode } from '@/redux/slices/cartSlice';
import { isAuthenticated, isVerified } from '@/redux/slices/authSlice';
import {
  dateSelected,
  setSearchTimeSelected,
} from '@/redux/slices/searchParamsSlice';
import { setCurrentElement } from '@/redux/slices/currentElementSlice';
import { setBackPath } from '@/redux/slices/guestSlice';
import ElementMap from '@/components/ElementMap';

type Props = {
  element: Venue;
};

const VenueShow: NextPage<Props> = ({ element }): JSX.Element => {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isAuth = useAppSelector(isAuthenticated);
  const verified = useAppSelector(isVerified);
  const {
    locale: { lang },
    country: { id: country },
    guest: { guestMode },
    searchParams: { searchTimeSelected },
  } = useAppSelector((state) => state);
  const { date, id: venue_id }: any = router.query;
  const [trigger] = useSetVenueMutation();
  const [time, setTime] = useState<string>(searchTimeSelected);
  const searchDateSelected = useAppSelector(dateSelected);

  useEffect(() => {
    dispatch(setCurrentModule(element.venue_name));
    dispatch(setCurrentElement({ element, type: `venue` }));
    dispatch(setCurrentMode(`venue`));
    dispatch(setBackPath(appLinks.cartReview.path));
  }, []);

  useEffect(() => {
    if (time !== searchTimeSelected) {
      dispatch(setSearchTimeSelected(time));
    }
  }, [time]);

  useEffect(() => {
    if (!isEmpty(searchDateSelected) && date !== searchDateSelected) {
      handleRoute();
    }
  }, [date, searchDateSelected, searchTimeSelected]);

  const handleRoute = () => {
    router.replace(
      `/country/${country}${appLinks.venueShow.path}${element.id}/${searchDateSelected}`,
      ``,
      { scroll: false, locale: lang }
    );
  };

  const handleClick = async () => {
    await trigger({
      lang,
      country,
      params: { venue_id, time, date },
    }).then((r: any) => {
      if (r.data && r.data.success) {
        const { payment_methods, sub_total, tax, total } = r.data.data;
        dispatch(
          setCartVeneu({
            venue: { tax, sub_total, total },
            paymentMethods: payment_methods,
          })
        );
        if (isAuth && !verified) {
          router.push(appLinks.verificationMobileNo.path);
        } else if (!isAuth && !guestMode) {
          router.push(appLinks.login.path);
        } else {
          router.push(appLinks.cartReview.path); // go to Login then cartReview
        }
      } else if (r.error) {
        dispatch(
          showToastMessage({ content: r.error.data.message, type: 'error' })
        );
      }
    });
  };


  return (
    <>
      <MainHead
        title={`${element.venue_name}`}
        description={element.vendor_name}
        mainImage={element.vendor_logo}
      />
      <MainContentLayout>
        {/* <div>Venue Show</div>
        <div>name : {element.venue_name}</div> */}

        <div className="my-3">
          {!isEmpty(element.background_image_slider) && (
            <GeneralCarousel
              slides={element.background_image_slider}
              w={`w-full h-auto`}
            />
          )}
        </div>

        <div className="grid grid-cols-2 mb-4">
          <div className="flex p-px">
            <div className="h-10 w-10 relative">
              <Image
                width={imageSizes.xl}
                height={imageSizes.xl}
                alt={element.venue_name}
                src={element.vendor_logo}
                className="rounded-md w-10 h-10 object-cover rtl:ml-2 ltr:mr-2 "
              />
            </div>
            <div className="text-start mx-1">
              <p className="">{element.venue_name}</p>
              <p className="text-xs">{element.vendor_name}</p>
            </div>
          </div>

          <div className="flex flex-col justify-between items-end h-full">
            <p
              className="text-primary_BG"
              suppressHydrationWarning={suppressText}
            >
              {element.price} {t(element.currency)}
            </p>
            <p className={`${grayBtnClass} text-[9px] `}>{element.space}</p>
          </div>
        </div>

        <GreyLine />

        {/* date */}
        <div className="flex justify-between items-center mb-5 mt-3">
          <div className="flex gap-x-3 items-center">
            <div className="flex items-center gap-x-1 text-primary_BG font-bold">
              <Image
                src={Transaction_DateIcon}
                width={imageSizes.xl}
                height={imageSizes.xl}
                alt={`date`}
                className={`w-5 h-5`}
              />
              <p suppressHydrationWarning={suppressText}>{t('date')}</p>
            </div>
            <div className="text-sm">
              <p suppressHydrationWarning={suppressText}>{date}</p>
            </div>
          </div>

          <button
            onClick={() => dispatch(showPickDateModal(undefined))}
            className={`${grayBtnClass}`}
            suppressHydrationWarning={suppressText}
          >
            {t('change')}
          </button>
        </div>

        <div className="flex items-center mb-2">
          <Image
            src={BookingsIcon}
            width={imageSizes.xl}
            height={imageSizes.xl}
            alt={`date`}
            className={`w-4 h-4`}
          />
          <p
            className="text-primary_BG px-1 text-sm"
            suppressHydrationWarning={suppressText}
          >
            {t('bookings')}
          </p>
        </div>

        {/* times */}
        {element.booking_times.length <= 1 && (
          <div
            className={`flex justify-center items-center text-center bg-LighterGray rounded-md py-4`}
            suppressHydrationWarning={suppressText}
          >
            {t('no_timings_available')}
          </div>
        )}
        <div className="grid  grid-cols-2 md:grid-cols-3  gap-x-3 gap-y-3 justify-items-center  bg-LighterGray rounded-md ">
          {element.booking_times.map((item: booking_times, i: number) => {
            if (item.active === true) {
              return (
                <div
                  key={i}
                  onClick={() =>
                    time !== item.name ? setTime(item.name) : setTime(``)
                  }
                  className={`${
                    time === item.name
                      ? `bg-primary_BG text-white`
                      : `text-DarkBlue`
                  } flex items-center justify-center cursor-pointer rounded border border-primary_BG text-xs w-full h-8 pt-1  whitespace-nowrap`}
                  suppressHydrationWarning={suppressText}
                >
                  {item.name}
                </div>
              );
            } else {
              return (
                <div
                  key={i}
                  className="flex items-center text-GreyBG justify-center cursor-pointer rounded border border-GreyBG text-xs w-full h-8 pt-1  whitespace-nowrap"
                  suppressHydrationWarning={suppressText}
                >
                  {item.name}
                </div>
              );
            }
          })}
        </div>

        {/* aminities */}
        <div className="flex items-center my-3">
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
            {t('amenities')}
          </p>
        </div>

        <div className="grid grid-flow-col gap-x-2 gap-y-3 mt-1 mb-4 bg-LighterGray rounded-md p-2 h-24">
          {element.amenities?.map((item: Amenities) => {
            return (
              <div
                key={item.id}
                className="flex flex-col items-center justify-center"
              >
                <div className="h-10 w-10 relative">
                  <Image
                    width={imageSizes.xl}
                    height={imageSizes.xl}
                    className={`h-10 w-10 object-contain`}
                    alt={item.name}
                    src={item.icon}
                  />
                </div>

                <p className="text-primary_BG text-xs py-1 pt-3">{item.name}</p>
              </div>
            );
          })}
        </div>

        {/* location */}
        <div className="flex items-center mb-2">
          <Image
            src={LocationIcon}
            width={imageSizes.xl}
            height={imageSizes.xl}
            alt={`location`}
            className={`w-4 h-4`}
          />
          <p
            className="text-primary_BG px-1 text-sm"
            suppressHydrationWarning={suppressText}
          >
            {t('location')}
          </p>
        </div>
        <ElementMap lat={element.lat} lng={element.long} />
        <div className={`flex flex-1 w-full`}>
          <button
            onClick={() => handleClick()}
            disabled={isEmpty(searchTimeSelected)}
            className={`${submitBtnClass} text-center mt-8`}
            suppressHydrationWarning={suppressText}
          >
            {t('continue')}
          </button>
        </div>

        <PickDateModal />
      </MainContentLayout>
    </>
  );
};

export default VenueShow;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const lang: any = context.locale;
    const { date, id, country }: any = await context.query;
    if (!date || !country || !id) {
      return {
        notFound: true,
      };
    }
    const { data: element, isError } = await store.dispatch(
      venueApi.endpoints.getVenue.initiate({
        lang,
        country,
        id,
        date,
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
