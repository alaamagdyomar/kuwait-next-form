import MainHead from '@/components/MainHead';
import { NextPage } from 'next';
import MainContentLayout from '@/layouts/MainContentLayout';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import Enterphone from '@/appImages/enter_phone.png';
import { useGetAllCountriesQuery } from '@/redux/api/countryApi';
import { AppQueryResult, Country } from '@/types/queries';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  appLinks,
  imageSizes,
  inputFieldClass,
  submitBtnClass,
  suppressText,
} from '@/constants/*';
import * as yup from 'yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMobileVerificationMutation } from '@/redux/api/authApi';
import {
  setCurrentModule,
  showToastMessage,
} from '@/redux/slices/appSettingSlice';
import { has, isEmpty } from 'lodash';
import { setCountry } from '@/redux/slices/countrySlice';
import { filter, first } from 'lodash';
import { useRouter } from 'next/router';
import { isAuthenticated, setAuthUserObject } from '@/redux/slices/authSlice';
import { useEffect } from 'react';
import { setCurrentElement } from '@/redux/slices/currentElementSlice';

type MobileVerificationProps = {
  phone: string;
  code: string;
};

const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$/im;

const schema = yup
  .object({
    phone: yup.string().required().min(8).matches(phoneRegex),
  })
  .required();

const VerificationMobileNo: NextPage = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    country: { id, code },
    locale: { lang },
    auth: { access_token },
  } = useAppSelector((state) => state);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MobileVerificationProps>({
    resolver: yupResolver(schema),
    defaultValues: {
      phone: ``,
      code: code,
    },
  });

  // get all countries
  const { data: countries, isSuccess: countriesSuccess } =
    useGetAllCountriesQuery<{
      data: AppQueryResult<Country[]>;
      isSuccess: boolean;
    }>({
      lang: lang,
      country: id,
    });

  // update code
  const updateCountryCode = (selectedCode: string) => {
    const selectedCountry = first(
      filter(countries.data, (c: Country) => c.code === selectedCode)
    );
    dispatch(setCountry(selectedCountry));
  };

  const [MobileVerification, { data: result, isLoading, error: loginError }] =
    useMobileVerificationMutation();

  const onSubmit: SubmitHandler<MobileVerificationProps> = async (data) => {
    await MobileVerification({
      body: { ...data },
      country: id.toString(),
    }).then((r: any) => {
      if (r.data.success) {
        dispatch(setAuthUserObject(r.data.data.user));
        dispatch(
          showToastMessage({
            content: `mobile_verification_success`,
            type: 'success',
          })
        );
        router.replace(appLinks.verificationOTP.path);
      } else {
        dispatch(
          showToastMessage({
            content: `mobile_verification_failure`,
            type: 'error',
          })
        );
      }
    });
  };

  useEffect(() => {
    dispatch(setCurrentModule(t(`mobile_verification`)));
    if (isEmpty(access_token)) {
      router.replace(`/`);
    }
  }, []);

  return (
    <>
      <MainHead
        title={`mobile_verification`}
        description={`mobile_verification_description`}
      />
      <MainContentLayout backHome={true}>
        <div className="flex justify-center mb-5 ">
          <p
            className="text-center px-5"
            suppressHydrationWarning={suppressText}
          >
            {`${t('create_your_form_account_to_continue_your_booking')}`}
          </p>
        </div>

        <div className="flex justify-center py-5">
          <Image
            alt={'otp code'}
            src={Enterphone}
            width={imageSizes.xl}
            height={imageSizes.xl}
          />
        </div>

        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-4 grid-flow-col auto-rows-min gap-x-2 items-center">
              {countriesSuccess && (
                <select
                  {...register('code', {
                    onChange: (e) => {
                      updateCountryCode(e.target.value);
                    },
                  })}
                  className="bg-primary_BG h-fit text-white text-center text-sm rounded-xl outline-none py-1"
                >
                  {countries.data.map((item) => {
                    return (
                      <option
                        selected={code === item.code}
                        key={item.id}
                        value={item.code}
                      >
                        {item.code}
                      </option>
                    );
                  })}
                </select>
              )}

              <div className="flex items-center col-start-2 col-span-3">
                <input
                  {...register('phone')}
                  suppressHydrationWarning={suppressText}
                  placeholder={`${t('enter_your_phone')}`}
                  className={`${inputFieldClass} rounded-xl px-3 py-1 mb-0`}
                  // className="text-center rounded-lg px-3 py-1 text-sm bg-gray outline-none w-full"
                />
              </div>
            </div>
            <div className="grid grid-cols-4 grid-flow-col auto-rows-min gap-x-2 items-center">
              <p className={`text-sm text-red-800 `}>{errors.code?.message}</p>
              <p className={`text-sm text-red-800 col-start-2 col-span-3`}>
                {has(errors?.phone?.message, 'key') ? (
                  <p className={`text-sm text-red-800`}>
                    {t(`${errors?.phone?.message?.key}`, {
                      min: errors?.phone?.message?.values,
                    })}
                  </p>
                ) : (
                  errors?.phone?.message && (
                    <p className={`text-sm text-red-800`}>
                      {t(`${errors?.phone?.message}`)}
                    </p>
                  )
                )}
              </p>
            </div>
            <input
              type="submit"
              className={`${submitBtnClass} mt-5`}
              suppressHydrationWarning={suppressText}
              value={`${t('continue')}`}
            />
          </form>
        </div>
      </MainContentLayout>
    </>
  );
};

export default VerificationMobileNo;
