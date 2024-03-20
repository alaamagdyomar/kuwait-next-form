import { useState, useRef, useEffect } from 'react';
import MainContentLayout from '@/layouts/MainContentLayout';
import { NextPage } from 'next';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  isAuthenticated,
  isVerified,
  setAuthUserObject,
} from '@/redux/slices/authSlice';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  appLinks,
  imageSizes,
  inputFieldClass,
  submitBtnClass,
  suppressText,
} from '@/constants/*';
import CheckIcon from '@mui/icons-material/Check';
import React from 'react';
import {
  setCurrentModule,
  showChangePasswordModal,
  showToastMessage,
} from '@/redux/slices/appSettingSlice';
import Image from 'next/image';
import CameraIcon from '@/appIcons/camera.svg';
import {
  useUpdateAccountSettingsMutation,
  useUpdateAvatarMutation,
} from '@/redux/api/authApi';
import ChangePasswordModal from '@/components/modals/ChangePasswordModal';
import LoadingSpinner from '@/components/LoadingSpinner';
import moment from 'moment';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/router';

type AuthProps = {
  name: string;
  email: string;
  phone: string | number;
  gender: 'male' | 'female';
  country_code: string | number;
  date_of_birth: string;
};

const schema = yup
  .object({
    name: yup.string().required().min(2).max(50),
    email: yup.string().email().required(),
    gender: yup.string().required(),
    phone: yup.number().min(100000).max(999999999999),
    country_code: yup.string().required(),
    date_of_birth: yup.date().required(),
  })
  .required();

const AccountPage: NextPage = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const router=useRouter()
  const {
    auth: { user, access_token: token },
    country: { id },
  } = useAppSelector((state) => state);
  const [selectedImage, setSelectedImage] = useState<any | string>(user.avatar);
  const [previewImage, setPreviewImage] = useState<object | any | null>(null);
  const imageRef = useRef<any>(null);
  const verified = useAppSelector(isVerified);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    getValues,
    clearErrors,
    formState: { errors },
  } = useForm<AuthProps>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: user.name,
      email: user.email,
      phone: user.phone,
      gender: user.gender,
      country_code: user.country_code,
      date_of_birth: moment(user.date_of_birth).format('YYYY-MM-DD'),
    },
  });
  const [updateAvatar] = useUpdateAvatarMutation();
  const [updateAuth, { isLoading: authLoading, error }] =
    useUpdateAccountSettingsMutation<any>();

  const onSubmit: SubmitHandler<AuthProps> = async (body) => {
    updateAuth({
      body: {
        ...body,
        date_of_birth: moment(body.date_of_birth).format('YYYY-MM-DD'),
      },
      token,
      country: id.toString(),
    }).then((r: any) => {
      if (r.data && r.data.success) {
        dispatch(setAuthUserObject(r.data?.data));
        dispatch(
          showToastMessage({
            content: r.data?.message,
            type: 'success',
          })
        );
      } else {
        dispatch(
          showToastMessage({
            content: r.data?.message,
            type: 'error',
          })
        );
      }
    });
  };

  useEffect(() => {
    if (error?.data.message) {
      dispatch(
        showToastMessage({ content: error.data?.message, type: 'error' })
      );
    }
  }, [error]);

  useEffect(() => {
    dispatch(setCurrentModule(t('account_settings')));
  }, []);

  return (
    <MainContentLayout>
      <div className="h-full">
        {authLoading && <LoadingSpinner />}
        <div className="flex justify-center mb-5">
          <p
            className="w-full text-center"
            suppressHydrationWarning={suppressText}
          >
            {t('edit_your_information')}
          </p>
        </div>
        {!verified && (
          <div className="rtl:border-r-4 ltr:border-l-4 border-red-400 bg-red-50 p-4 mb-4 rounded-md">
            <Link
              href={`${appLinks.verificationMobileNo.path}`}
              className="flex"
            >
              <div className="flex-shrink-0">
                <ExclamationCircleIcon
                  className="h-5 w-5 text-red-400 mx-4"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-3">
                <div className="text-sm text-red-700">
                  {t(
                    'your_account_is_not_verified_please_verify_your_mobile_number'
                  )}
                </div>
              </div>
            </Link>
          </div>
        )}
        <div
          onClick={() => imageRef.current.click()}
          className={`w-full flex justify-center items-center mb-4`}
        >
          <Image
            src={previewImage ?? selectedImage}
            fill={false}
            width={imageSizes.xl}
            height={imageSizes.xl}
            alt={user.name}
            suppressHydrationWarning={suppressText}
            className={`w-20 h-20 object-cover rounded-full shadow-lg border border-gray-100`}
          />
          <Image
            src={CameraIcon}
            fill={false}
            width={imageSizes.xl}
            height={imageSizes.xl}
            className={`w-8 h-8 object-cover relative top-4 rtl:left-6 ltr:right-6`}
            alt={user.name}
          />
        </div>
        <input
          suppressHydrationWarning={suppressText}
          ref={imageRef}
          id="Selectimg"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e: any) => {
            setSelectedImage(e.target.files[0]);
            setPreviewImage(URL.createObjectURL(e.target.files[0]));
            var formdata = new FormData();
            formdata.append('image', e.target.files[0]);
            updateAvatar({ country: id.toString(), formdata, token }).then(
              (r: any) => {
                dispatch(setAuthUserObject(r.data?.data));
                dispatch(
                  showToastMessage({
                    content: 'image_saved_successfully',
                    type: 'success',
                  })
                );
              }
            );
          }}
        />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={`flex flex-col space-y-2`}
          suppressHydrationWarning={suppressText}
        >
          <input
            type={`hidden`}
            {...register('country_code')}
            value={user.country_code}
          />
          <input
            {...register('name')}
            placeholder={`${t('name')}`}
            aria-invalid={errors.name ? 'true' : 'false'}
            suppressHydrationWarning={suppressText}
            className={`${inputFieldClass}`}
          />
          {errors.name?.message.key ? (
            <p
              className={`text-sm text-red-800`}
              suppressHydrationWarning={suppressText}
            >
              {t(`${errors.name?.message.key}`, {
                min: errors.name?.message.values,
              })}
            </p>
          ) : (
            <p
              className={`text-sm text-red-800`}
              suppressHydrationWarning={suppressText}
            >
              {t(errors.name?.message)}
            </p>
          )}

          <input
            {...register('email')}
            placeholder={`${t('email')}`}
            className={`${inputFieldClass}`}
          />
          {errors.email?.message.key ? (
            <p
              className={`text-sm text-red-800`}
              suppressHydrationWarning={suppressText}
            >
              {t(`${errors.email?.message.key}`, {
                min: errors.email?.message.values,
              })}
            </p>
          ) : (
            <p
              className={`text-sm text-red-800`}
              suppressHydrationWarning={suppressText}
            >
              {t(errors.email?.message)}
            </p>
          )}

          <input
            {...register('phone')}
            suppressHydrationWarning={suppressText}
            placeholder={`${t('phone')}`}
            type={'number'}
            max={9999999999}
            className={`${inputFieldClass}`}
          />
          {errors.phone?.message.key ? (
            <p
              className={`text-sm text-red-800`}
              suppressHydrationWarning={suppressText}
            >
              {t(`${errors.phone?.message.key}`, {
                min: errors.phone?.message.values,
              })}
            </p>
          ) : (
            <p
              className={`text-sm text-red-800`}
              suppressHydrationWarning={suppressText}
            >
              {t(errors.phone?.message)}
            </p>
          )}

          {/* gender */}
          <ul className="grid gap-x-6 w-full md:grid-cols-2">
            <li>
              <input
                type="radio"
                id="hosting-small"
                value="male"
                className="hidden peer"
                {...register('gender', {
                  onChange: (e) => {
                    setValue('gender', e.target.value);
                  },
                  onBlur: (e) => {},
                })}
              />

              <label
                htmlFor="hosting-small"
                className="inline-flex justify-between mb-2 items-center p-3 w-full bg-white rounded-lg border border-stone-200 outline-none cursor-pointer peer-checked:bg-primary_BG peer-checked:text-white"
              >
                <div className="block">
                  <div
                    className="w-full text-md"
                    suppressHydrationWarning={suppressText}
                  >
                    {t('male')}
                  </div>
                </div>
                <CheckIcon className={`text-white`} />
              </label>
            </li>
            <li>
              <input
                type="radio"
                id="hosting-big"
                value="female"
                className="hidden peer"
                {...register('gender', {
                  onChange: (e) => {
                    setValue('gender', e.target.value);
                  },
                  onBlur: (e) => {},
                })}
              />
              <label
                htmlFor="hosting-big"
                className="inline-flex justify-between mb-2 items-center p-3 w-full bg-white rounded-lg border border-stone-200 outline-none cursor-pointer peer-checked:bg-primary_BG peer-checked:text-white "
              >
                <div className="block">
                  <div
                    className="w-full text-md"
                    suppressHydrationWarning={suppressText}
                  >
                    {t('female')}
                  </div>
                </div>
                <CheckIcon className={`text-white`} />
              </label>
            </li>
          </ul>

          <input
            type={`date`}
            {...register('date_of_birth')}
            suppressHydrationWarning={suppressText}
            placeholder={`${t('date_of_birth')}`}
            className={`${inputFieldClass} rtl:text-right ltr:text-left`}
            onChange={(e: any) => {
              setValue(
                'date_of_birth',
                moment(e.target.value).format('YYYY-MM-DD')
              );
            }}
          />
          <p
            className={`text-sm text-red-800`}
            suppressHydrationWarning={suppressText}
          >
            {t(errors.date_of_birth?.message)}
          </p>
          <div className={`mt-6`}>
            <div
              className={`my-2 cursor-pointer`}
              onClick={() => dispatch(showChangePasswordModal())}
            >
              <span
                className={`text-primary_BG`}
                suppressHydrationWarning={suppressText}
              >
                {t('change_your_password')}
              </span>
            </div>

            <div
              className={`my-2 cursor-pointer`}
              onClick={() => router.push(`${appLinks.cartProductDetails.path}`)}
            >
              <span
                className={`text-primary_BG`}
                suppressHydrationWarning={suppressText}
              >
                {t('show_addresses')}
              </span>
            </div>

            <input
              type="submit"
              className={`${submitBtnClass}`}
              suppressHydrationWarning={suppressText}
              title={`${t('submit')}`}
              value={`${t('submit')}`}
            />
          </div>
        </form>
      </div>
      <ChangePasswordModal />
    </MainContentLayout>
  );
};

export default AccountPage;

// AccountPage.getInitialProps = wrapper.getInitialPageProps(
//   (store) =>
//     ({ pathname, req, res, locale }) => {
//       store.dispatch(setLocale(locale));
//     }
// );
