import React, { useEffect } from 'react';
import MainContentLayout from '@/layouts/MainContentLayout';
import { useTranslation } from 'react-i18next';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import CheckIcon from '@mui/icons-material/Check';
import {
  appLinks,
  inputFieldClass,
  submitBtnClass,
  suppressText,
} from '@/constants/index';
import * as yup from 'yup';
import {
  setCurrentModule,
  showToastMessage,
} from '@/redux/slices/appSettingSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useRegisterMutation } from '@/redux/api/authApi';
import moment from 'moment';
import { setLogin } from '@/redux/slices/authSlice';
import { useRouter } from 'next/router';
import { has } from 'lodash';

type RegisterProps = {
  name: string;
  email: string;
  phone: string | number;
  gender: 'male' | 'female';
  password: string;
  password_confirmation: string;
  date_of_birth: string;
  country_code: string | number;
};

const schema = yup
  .object({
    name: yup.string().required().min(2).max(50),
    email: yup.string().email().required(),
    gender: yup.string().required(),
    phone: yup.number().min(100000).max(999999999999),
    country_code: yup.string().required(),
    date_of_birth: yup.date().required(),
    password: yup.string().min(6).max(10),
    password_confirmation: yup.string().min(6).max(10),
  })
  .required();

const RegisterPage = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    country: { id, code },
  } = useAppSelector((state) => state);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterProps, any>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: ``,
      email: ``,
      phone: ``,
      gender: `male`,
      password: ``,
      password_confirmation: ``,
      date_of_birth: ``,
      country_code: `${code}`,
    },
  });
  const [handleRegister] = useRegisterMutation();

  const onSubmit: SubmitHandler<RegisterProps> = async (data) => {
    await handleRegister({
      body: {
        ...data,
        phone: parseInt(data.phone as string),
        date_of_birth: moment(data.date_of_birth).format('YYYY-MM-DD'),
      },
      country: id.toString(),
    }).then((r: any) => {
      if (r.data.success) {
        dispatch(setLogin(r.data?.data));
        dispatch(
          showToastMessage({ content: r.data.message, type: 'success' })
        );
        // router.push(appLinks.verificationOTP.path);
      } else {
        dispatch(showToastMessage({ content: r.data.message, type: 'error' }));
      }
    });
  };

  useEffect(() => {
    dispatch(setCurrentModule(t('register')));
  }, []);

  return (
    <MainContentLayout backRoute={appLinks.login.path}>
      <div className="h-full">
        <div className="flex justify-center mb-5">
          <p
            className="w-full text-center capitalize truncate"
            suppressHydrationWarning={suppressText}
          >
            {t('create_your_form_account_to_continue_your_booking')}
          </p>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={`flex flex-col space-y-4 `}
        >
          <input
            {...register('name')}
            suppressHydrationWarning={suppressText}
            placeholder={`${t('name')}`}
            aria-invalid={errors.name ? 'true' : 'false'}
            className={`${inputFieldClass}`}
          />
          {has(errors?.name?.message, 'key') ? (
            <p
              className={`text-sm text-red-800`}
              suppressHydrationWarning={suppressText}
            >
              {t(`${errors?.name?.message?.key}`, {
                min: errors?.name?.message?.values,
              })}
            </p>
          ) : (
            errors?.name?.message && (
              <p
                className={`text-sm text-red-800`}
                suppressHydrationWarning={suppressText}
              >
                {t(`${errors?.name?.message}`)}
              </p>
            )
          )}

          <input
            {...register('email')}
            suppressHydrationWarning={suppressText}
            placeholder={`${t('email')}`}
            aria-invalid={errors.email ? 'true' : 'false'}
            className={`${inputFieldClass}`}
          />
          {has(errors?.email?.message, 'key') ? (
            <p
              className={`text-sm text-red-800`}
              suppressHydrationWarning={suppressText}
            >
              {t(`${errors?.email?.message?.key}`, {
                min: errors?.email?.message?.values,
              })}
            </p>
          ) : (
            errors?.email?.message && (
              <p
                className={`text-sm text-red-800`}
                suppressHydrationWarning={suppressText}
              >
                {t(`${errors?.email?.message}`)}
              </p>
            )
          )}

          <input
            {...register('phone')}
            suppressHydrationWarning={suppressText}
            placeholder={`${t('phone')}`}
            aria-invalid={errors.phone ? 'true' : 'false'}
            type={'number'}
            max={9999999999}
            className={`${inputFieldClass}`}
          />
          {/*<p className={`text-sm text-red-800`}>{errors.phone?.message}</p>*/}
          {has(errors?.phone?.message, 'key') ? (
            <p
              className={`text-sm text-red-800`}
              suppressHydrationWarning={suppressText}
            >
              {t(`${errors?.phone?.message?.key}`, {
                min: errors?.phone?.message?.values,
              })}
            </p>
          ) : (
            errors?.phone?.message && (
              <p
                className={`text-sm text-red-800`}
                suppressHydrationWarning={suppressText}
              >
                {t(`${errors?.phone?.message}`)}
              </p>
            )
          )}

          {/* gender */}
          <ul className="grid gap-6 w-full md:grid-cols-2 ">
            <li>
              <input
                type="radio"
                id="hosting-small"
                value="male"
                className="hidden peer"
                aria-invalid={errors.gender ? 'true' : 'false'}
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
                className="hidden peer"
                aria-invalid={errors.gender ? 'true' : 'false'}
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
          </ul>

          <input
            type={`password`}
            {...register('password')}
            suppressHydrationWarning={suppressText}
            aria-invalid={errors.password ? 'true' : 'false'}
            placeholder={`${t('password')}`}
            className={`${inputFieldClass}`}
          />
          {has(errors?.password?.message, 'key') ? (
            <p
              className={`text-sm text-red-800`}
              suppressHydrationWarning={suppressText}
            >
              {t(`${errors?.password?.message?.key}`, {
                min: errors?.password?.message?.values,
              })}
            </p>
          ) : (
            errors?.password?.message && (
              <p
                className={`text-sm text-red-800`}
                suppressHydrationWarning={suppressText}
              >
                {t(`${errors?.password?.message}`)}
              </p>
            )
          )}

          <input
            type={`password`}
            {...register('password_confirmation')}
            suppressHydrationWarning={suppressText}
            aria-invalid={errors.password_confirmation ? 'true' : 'false'}
            placeholder={`${t('password_confirmation')}`}
            className={`${inputFieldClass}`}
          />
          {has(errors?.password_confirmation?.message, 'key') ? (
            <p
              className={`text-sm text-red-800`}
              suppressHydrationWarning={suppressText}
            >
              {t(`${errors?.password_confirmation?.message?.key}`, {
                min: errors?.password_confirmation?.message?.values,
              })}
            </p>
          ) : (
            errors?.password_confirmation?.message && (
              <p
                className={`text-sm text-red-800`}
                suppressHydrationWarning={suppressText}
              >
                {t(`${errors?.password_confirmation?.message}`)}
              </p>
            )
          )}

          <input
            type={`date`}
            {...register('date_of_birth')}
            suppressHydrationWarning={suppressText}
            placeholder={`${t('date_of_birth')}`}
            className={`${inputFieldClass}`}
          />
          {errors?.date_of_birth?.message && (
            <p className={`text-sm text-red-800`}>
              {t(`${errors?.date_of_birth?.message}`)}
            </p>
          )}

          <input
            type="submit"
            className={`${submitBtnClass}`}
            suppressHydrationWarning={suppressText}
            title={`${t('continue')}`}
            value={`${t('continue')}`}
          />
        </form>
      </div>
    </MainContentLayout>
  );
};

export default RegisterPage;
