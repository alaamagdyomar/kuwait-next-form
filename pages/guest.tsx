import MainContentLayout from '@/layouts/MainContentLayout';
import { useTranslation } from 'react-i18next';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { inputFieldClass, submitBtnClass, suppressText } from '@/constants/*';
import React, { useEffect } from 'react';
import CheckIcon from '@mui/icons-material/Check';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  setCurrentModule,
  showToastMessage,
} from '@/redux/slices/appSettingSlice';
import { enableGuestMode } from '@/redux/slices/guestSlice';
import { useRouter } from 'next/router';

type GuestProps = {
  name: string;
  phone: string | number;
  // gender: 'male' | 'female';
  guestMode: boolean;
};

const schema = yup
  .object({
    name: yup.string().required().min(2).max(50),
    // gender: yup.string().required(),
    phone: yup.number().min(10000000).max(999999999999),
  })
  .required();

const GuestPage = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { guest } = useAppSelector((state) => state);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    getValues,
    clearErrors,
    formState: { errors },
  } = useForm<GuestProps>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: guest.name ?? ``,
      phone: guest.phone.toString() ?? ``,
      // gender: guest.gender ?? `male`,
      guestMode: guest.guestMode,
    },
  });
  const onSubmit: SubmitHandler<GuestProps> = (data) => {
    console.log({ data });
    if (data) {
      dispatch(enableGuestMode(data));
    } else {
      dispatch(showToastMessage({ content: 'login_failure', type: 'error' }));
    }
  };

  useEffect(() => {
    dispatch(setCurrentModule(t('guest')));
  }, []);

  return (
    <MainContentLayout>
      <div className="flex justify-center mb-8">
        <p
          className="w-full text-center capitalize truncate"
          suppressHydrationWarning={suppressText}
        >
          {/* {t('register_to_form_and_continue_your_subscription')} */}
          {t('register_to_continue')}
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          {...register('name')}
          placeholder={`${t('name')}`}
          suppressHydrationWarning={suppressText}
          aria-invalid={errors.name ? 'true' : 'false'}
          className={`${inputFieldClass} mb-5`}
        />
        <div>
          {errors?.name?.message && (
            <p
              className={`text-sm text-red-800`}
              suppressHydrationWarning={suppressText}
            >
              {t(`${errors?.name?.message}`)}
            </p>
          )}
        </div>
        <input
          {...register('phone')}
          suppressHydrationWarning={suppressText}
          placeholder={`${t('mobile_number')}`}
          type={'number'}
          max={9999999999}
          className={`${inputFieldClass} mb-5`}
        />
        {errors?.phone?.message && (
          <div className={`text-sm text-red-800`}>
            {errors?.phone?.message && (
              <p suppressHydrationWarning={suppressText}>
                {t('phone_number_must_be_between_6_and_20_number')}
              </p>
            )}
          </div>
        )}
        {/* gender */}
        {/* buisness note order to remove this section */}
        {/* <ul className="grid gap-6 w-full md:grid-cols-2 ">
          <li>
            <input
              type="radio"
              id="hosting-small"
              value="male"
              defaultChecked={getValues('gender') === 'male'}
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
              className="inline-flex justify-between mb-5 items-center p-3 w-full bg-white rounded-lg border border-stone-200 outline-none cursor-pointer peer-checked:bg-primary_BG peer-checked:text-white"
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
              defaultChecked={getValues('gender') === 'female'}
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
              className="inline-flex justify-between mb-5 items-center p-3 w-full bg-white rounded-lg border border-stone-200 outline-none cursor-pointer peer-checked:bg-primary_BG peer-checked:text-white "
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
        </ul> */}
        <input
          type="submit"
          className={`${submitBtnClass}`}
          suppressHydrationWarning={suppressText}
          title={`${t('submit')}`}
          value={`${t('submit')}`}
        />
      </form>
    </MainContentLayout>
  );
};

export default GuestPage;
