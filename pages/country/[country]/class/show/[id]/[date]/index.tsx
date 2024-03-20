import MainHead from '@/components/MainHead';
import { NextPage } from 'next';
import { wrapper } from '@/redux/store';
import { Category, Class } from '@/types/queries';
import { apiSlice } from '@/redux/api';
import { classApi } from '@/redux/api/classApi';
import GeneralCarousel from '@/components/GeneralCarousel';
import { useTranslation } from 'react-i18next';
import ClassTypeIcon from '@/appIcons/blue_class_type.svg';
import Image from 'next/image';
import AvailableSeats from '@/appIcons/blue_available_seats.svg';
import BlueCalender from '@/appIcons/blue_calender.svg';
import AminitiesIcon from '@/appIcons/aminities.svg';
import {
  appLinks,
  imageSizes,
  submitBtnClass,
  suppressText,
} from '@/constants/*';
import MainContentLayout from '@/layouts/MainContentLayout';
import { useEffect } from 'react';
import {
  setCurrentModule,
  showToastMessage,
} from '@/redux/slices/appSettingSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useSetClassMutation } from '@/redux/api/cartApi';
import moment from 'moment';
import { setCartClass, setCurrentMode } from '@/redux/slices/cartSlice';
import { useRouter } from 'next/router';
import { isAuthenticated, isVerified } from '@/redux/slices/authSlice';
import { setCurrentElement } from '@/redux/slices/currentElementSlice';
import { setBackPath } from '@/redux/slices/guestSlice';
import LocationIcon from '@/appIcons/location.svg';
import ElementMap from '@/components/ElementMap';

type Props = {
  element: Class;
};
const ClassShow: NextPage<Props> = ({ element }): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    country: { id: country },
    locale: { lang },
    guest: { guestMode },
  } = useAppSelector((state) => state);
  const [trigger] = useSetClassMutation();
  const { id: class_id, date: rawDate } = element;
  const date = moment(rawDate).format('YYYY-MM-DD');
  const isAuth = useAppSelector(isAuthenticated);
  const verified = useAppSelector(isVerified);

  useEffect(() => {
    dispatch(setCurrentModule(element.class_name));
    dispatch(setCurrentElement({ element, type: `class` }));
    dispatch(setBackPath(appLinks.cartReview.path));
    dispatch(setCurrentMode(`classes`));
  }, []);

  const handleClick = () => {
    trigger({ lang, country, params: { class_id, date } }).then((r: any) => {
      if (r.data && r.data.success && r.data.data.class) {
        dispatch(
          setCartClass({
            classes: r.data.data.class,
            paymentMethods: r.data.data.payment_methods,
          })
        );
        if (isAuth && !verified) {
          router.push(appLinks.verificationMobileNo.path);
        } else if (!isAuth && !guestMode) {
          router.push(appLinks.login.path);
        } else {
          router.push(appLinks.cartReview.path);
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
        title={`${element.class_name}`}
        description={element.discription}
        mainImage={element.images[0]}
      />
      <MainContentLayout>
        {/* <div>Class Show</div>
        <div>name : {element.class_name}</div> */}
        {/* slider imgs */}
        <div className="mt-5 ">
          <GeneralCarousel h="10rem" slides={element.images} />
        </div>

        {/* class details */}
        <div className="grid grid-cols-2 mb-4">
          <div className="flex p-px">
            <div className="w-10 h-10 rounded-md relative">
              <Image
                alt="logo"
                src={element.vendor_logo}
                fill={true}
                priority={false}
                sizes="(max-width: 768px) 100vw,
                          (max-width: 1200px) 50vw,
                          33vw"
                className="rounded-md w-10 h-10 object-cover rtl:ml-2 ltr:mr-2 "
              />
            </div>

            <div className="text-start mx-1">
              <p className="">{element.vendor_name}</p>
              <p className="text-xxs">{element.class_name}</p>
            </div>
          </div>

          <div className="flex flex-col justify-between items-end h-full">
            <p
              className="text-primary_BG"
              suppressHydrationWarning={suppressText}
            >
              {element.class_price} {t(element.currency)}
            </p>
            <div className="flex justify-end items-center text-xs">
              {/* <div className="px-1">
              <AvailableSeats width="11.108" height="13.674" />
            </div> */}
              <p suppressHydrationWarning={suppressText}>
                {element.available_seats} {t('available_seats')}
              </p>
            </div>
          </div>

          <div className="col-span-2 flex ltr:text-left rtl:test-right text-xs py-4">
            {element.discription}
          </div>
        </div>

        <div className="flex items-center mb-2">
          <Image
            src={ClassTypeIcon}
            width={imageSizes.xl}
            height={imageSizes.xl}
            alt={`classtype`}
            className={`w-4 h-4`}
          />
          <p
            className="text-primary_BG px-1 text-sm"
            suppressHydrationWarning={suppressText}
          >
            {t('class_type')}
          </p>
        </div>

        {/* class type */}
        <div className="grid grid-flow-col gap-x-2 gap-y-3 mt-1 mb-4 bg-LighterGray rounded-md p-2 h-24">
          {(element.categories as Category[]).map((item: Category, i) => {
            return (
              <div
                key={i}
                className="flex flex-col items-center justify-center"
              >
                <div className="h-10 w-10 relative">
                  <Image
                    width={imageSizes.xl}
                    height={imageSizes.xl}
                    alt={item.name}
                    src={item.image}
                    className={`w-10 h-10`}
                  />
                </div>

                <p className="text-primary_BG text-xs py-1">{item.name}</p>
              </div>
            );
          })}
        </div>

        <div className="flex items-center mb-2">
          <Image
            src={AvailableSeats}
            width={imageSizes.xl}
            height={imageSizes.xl}
            alt={`classtypr`}
            className={`w-4 h-4`}
          />
          <p
            className="text-primary_BG px-1 text-sm"
            suppressHydrationWarning={suppressText}
          >
            {t('coach_details')}
          </p>
        </div>

        <div className="flex flex-col items-start mt-1 mb-4 bg-LighterGray rounded-md p-4">
          <p className="text-sm">{element.coach_name}</p>
          <p
            className="text-xs  text-DarkBlue"
            suppressHydrationWarning={suppressText}
          >
            {t('personal_trainer')}
          </p>
        </div>

        <div className="flex items-center mb-2">
          <Image
            src={BlueCalender}
            width={imageSizes.xl}
            height={imageSizes.xl}
            alt={`calender`}
            className={`w-4 h-4`}
          />
          <p
            className="text-primary_BG px-1 text-sm"
            suppressHydrationWarning={suppressText}
          >
            {t('date_and_time')}
          </p>
        </div>

        <div className="flex flex-col items-start mt-1 mb-4 bg-LighterGray rounded-md p-4">
          <p
            className="text-sm text-DarkBlue mb-2"
            suppressHydrationWarning={suppressText}
          >
            {element.date}
          </p>
          <p className="text-xs" suppressHydrationWarning={suppressText}>
            {element.time}
          </p>
        </div>

        <div className="flex items-center mb-2">
          <Image
            src={AminitiesIcon}
            fill={false}
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
          {element.amenities.map((item, i) => {
            return (
              <div
                key={i}
                className="flex flex-col items-center justify-center"
              >
                <div className="h-10 w-10 relative">
                  <Image
                    fill={false}
                    alt={item.name}
                    src={item.icon}
                    width={imageSizes.xl}
                    height={imageSizes.xl}
                    className={`w-10 h-10`}
                  />
                </div>

                <p className="text-primary_BG text-xs py-1">{item.name}</p>
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
        <ElementMap lat={element.latitude} lng={element.longitude} />
        <div className={`flex flex-1 w-full`}>
          <button
            onClick={() => handleClick()}
            className={`${submitBtnClass} text-center mt-8`}
            suppressHydrationWarning={suppressText}
          >
            {t('continue')}
          </button>
        </div>
      </MainContentLayout>
    </>
  );
};

export default ClassShow;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const lang: any = context.locale;
    const { date, id, country }: any = await context.query;
    if (!date || !id || !country) {
      return {
        notFound: true,
      };
    }
    const { data: element, isError } = await store.dispatch(
      classApi.endpoints.getClass.initiate({
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
