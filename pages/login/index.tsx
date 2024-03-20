import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import {
  appLinks,
  inputFieldClass,
  submitBtnClass,
  suppressText,
} from '@/constants/*';
import { NextPage } from 'next';
import Link from 'next/link';
import {
  setCurrentModule,
  showToastMessage,
} from '@/redux/slices/appSettingSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import * as yup from 'yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { has } from 'lodash';
import { useLoginMutation } from '@/redux/api/authApi';
import { setLogin } from '@/redux/slices/authSlice';
import MainContentLayout from '@/layouts/MainContentLayout';

type LoginProps = {
  email: string;
  password: string;
};

const schema = yup
  .object({
    email: yup.string().required().email(),
    password: yup.string().required().min(6),
  })
  .required();

const LoginPage: NextPage = (): JSX.Element => {
  const router = useRouter();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const {
    cart: { tempId, currentMode },
  } = useAppSelector((state) => state);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    getValues,
    clearErrors,
    formState: { errors },
  } = useForm<LoginProps, any>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: ``,
      password: ``,
    },
  });
  const [login] = useLoginMutation();

  const onSubmit: SubmitHandler<LoginProps> = async (data) => {
    await login({
      ...data,
      tempId: tempId ?? null,
      store: currentMode === 'product' ? 'true' : 'false',
    }).then((r: any) => {
      if (r.data.success) {
        dispatch(setLogin(r.data?.data));
      } else {
        if (r.data.data) {
          dispatch(setLogin(r.data.data));
        } else {
          dispatch(
            showToastMessage({
              content: r.data.message,
              type: 'error',
            })
          );
        }
      }
      // else {
      //   if(r.error.data){
      //     dispatch(
      //       showToastMessage({ content: r.error.data.message, type: 'error' })
      //     );
      //     dispatch(setLogin(r.error.data?.data))
      //     router.push(appLinks.verificationMobileNo.path)
      //   }
      // }
    });
  };

  useEffect(() => {
    dispatch(setCurrentModule(t('login')));
  }, []);

  return (
    <MainContentLayout>
      <div className="flex justify-center mb-5 [&>*]:capitalize">
        <p
          className="w-full text-center capitalize truncate text-lg"
          suppressHydrationWarning={suppressText}
        >
          {t('create_your_account_to_continue')}
        </p>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`flex flex-col space-y-4 `}
      >
        <div>
          <input
            {...register('email')}
            placeholder={`${t('email')}`}
            suppressHydrationWarning={suppressText}
            className={`${inputFieldClass}`}
          />
          {errors?.email?.message && (
            <p className={`text-sm text-red-800`}>
              {t(`${errors?.email?.message}`)}
            </p>
          )}
        </div>
        <input
          type={`password`}
          {...register('password')}
          suppressHydrationWarning={suppressText}
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
          type="submit"
          className={`${submitBtnClass}`}
          title={`${t('continue')}`}
          value={`${t('continue')}`}
        />
      </form>
      <div className="flex justify-between text-sm my-6">
        <Link
          scroll={true}
          href={appLinks.forgetPassword.path}
          className="cursor-pointer text-red-500"
          suppressHydrationWarning={suppressText}
        >
          {t('forget_password')}
        </Link>
        <Link
          scroll={true}
          href={appLinks.register.path}
          className="cursor-pointer text-primary_BG"
          suppressHydrationWarning={suppressText}
        >
          {t('register_now')}
        </Link>
      </div>

      <div className="inline-flex justify-center items-center w-full">
        <hr className="my-4 w-64 h-px bg-gray-200 border-0 dark:bg-gray-700" />
        <span
          className="absolute left-1/2 px-3 font-medium text-gray-900 bg-white -translate-x-1/2 dark:text-white dark:bg-gray-900"
          suppressHydrationWarning={suppressText}
        >
          {t('or')}
        </span>
      </div>

      <Link
        replace
        href={`${appLinks.guest.path}`}
        scroll={true}
        className={`flex flex-grow p-2 rounded-lg items-center justify-center my-3 text-center text-black border border-gray-200 shadow-sm`}
        suppressHydrationWarning={suppressText}
      >
        {t('continue_as_guest')}
      </Link>
    </MainContentLayout>
  );
};

export default LoginPage;
