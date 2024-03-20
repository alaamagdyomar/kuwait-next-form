import React, { useEffect } from 'react';
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
import { useAppDispatch } from '@/redux/hooks';
import * as yup from 'yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import MainContentLayout from '@/layouts/MainContentLayout';
import { useForgetPasswordMutation } from '@/redux/api/authApi';

type LoginProps = {
  email: string;
};

const schema = yup
  .object({
    email: yup.string().email().required(),
  })
  .required();

const ForgetPasswordPage: NextPage = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginProps>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: ``,
    },
  });

  const [forgetPassword] = useForgetPasswordMutation();

  const onSubmit: SubmitHandler<LoginProps> = async (data) => {
    await forgetPassword({ email: data.email }).then((r: any) => {
      if (r.data.success) {
        dispatch(
          showToastMessage({ content: r.data.message, type: 'success' })
        );
      } else {
        dispatch(showToastMessage({ content: r.data.message, type: 'error' }));
      }
    });
  };

  useEffect(() => {
    dispatch(setCurrentModule(t('forget_password')));
  }, []);

  return (
    <MainContentLayout backRoute={appLinks.login.path}>
      <div className="flex justify-center mb-5">
        <p
          className="w-1/2 text-center text-lg"
          suppressHydrationWarning={suppressText}
        >
          {t('did_u_forget_password')}
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          {...register('email')}
          suppressHydrationWarning={suppressText}
          placeholder={`${t('email')}`}
          className={`${inputFieldClass}`}
        />
        <p className={`text-sm text-red-800`}>{errors.email?.message}</p>
        <input
          type="submit"
          className={`${submitBtnClass}`}
          suppressHydrationWarning={suppressText}
          title={`${t('continue')}`}
        />
      </form>
      <div className="flex justify-between text-sm my-6">
        <Link
          scroll={true}
          href={appLinks.register.path}
          suppressHydrationWarning={suppressText}
          className="cursor-pointer text-primary_BG"
        >
          {t('register_now')}
        </Link>
      </div>
    </MainContentLayout>
  );
};

export default ForgetPasswordPage;
