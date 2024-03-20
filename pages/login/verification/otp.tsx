import MainHead from '@/components/MainHead';
import { NextPage } from 'next';
import MainContentLayout from '@/layouts/MainContentLayout';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import entercode from '@/appImages/enter_code.png';
import Image from 'next/image';
import {
  grayBtnClass,
  imageSizes,
  submitBtnClass,
  suppressText,
} from '@/constants/*';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useOtpVerificationMutation } from '@/redux/api/authApi';
import { setAuthUserObject } from '@/redux/slices/authSlice';
import {
  setCurrentModule,
  showToastMessage,
} from '@/redux/slices/appSettingSlice';
import { useRouter } from 'next/router';
import { isEmpty } from 'lodash';

const VerificationOTP: NextPage = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    auth: { user, access_token: token },
    // country: { id },
  } = useAppSelector((state) => state);
  const [Code, SetCode] = useState<any>({
    num1: '',
    num2: '',
    num3: '',
    num4: '',
  });

  const handelCodeChange = (elem: any, nm: string) => {
    SetCode((prev: any) => ({
      ...prev,
      [nm]: elem.value,
    }));

    //Focus next input
    if (elem.nextSibling && elem.value !== '') {
      elem.nextSibling.focus();
    }
  };

  const [OtpVerification, { data: result, isLoading, error: loginError }] =
    useOtpVerificationMutation();

  const HandelVerifyCode = async () => {
    await OtpVerification({
      body: {
        phone: user.phone,
        code: Code.num1.concat(Code.num2, Code.num3, Code.num4),
      },
    }).then((r: any) => {
      dispatch(
        showToastMessage({
          content: `${
            r.data.success
              ? t('otp_verification_successs')
              : t('otp_verification_failure')
          }`,
          type: r.data.success ? 'success' : 'error',
        })
      );
      if (r.data.success) {
        dispatch(setAuthUserObject(r.data.data?.user));
        router.back();
      }
    });
  };

  useEffect(() => {
    dispatch(setCurrentModule(t(`mobile_verification`)));
    if (isEmpty(token)) {
      router.replace(`/`);
    }
  }, []);

  return (
    <>
      <MainHead title={`verification_otp`} description={`verification_otp_description`} />
      <MainContentLayout backHome={true}>
        {/* enter your code */}
        <div className="h-full flex flex-col justify-between">
          <div className="flex flex-col items-center justify-between grow">
            <div>
              <div className="flex justify-center mb-5">
                <p
                  className="px-5 text-center"
                  suppressHydrationWarning={suppressText}
                >
                  {t(
                    'we’ve_sent_a_verification_code_to_your_number_to_continue_registration'
                  )}
                </p>
              </div>
              <div className="flex justify-center py-5">
                <Image
                  alt={'otp code'}
                  width={imageSizes.xl}
                  height={imageSizes.xl}
                  src={entercode}
                />
              </div>
            </div>

            <div className="flex justify-center gap-x-2 mb-8">
              <input
                autoFocus={true}
                id="num1"
                maxLength={1}
                type="text"
                className=" outline-none bg-gray rounded-xl text-center w-10 h-10"
                onChange={(e) => handelCodeChange(e.target, 'num1')}
              />

              <input
                id="num1"
                maxLength={1}
                type="text"
                className=" outline-none bg-gray rounded-xl text-center w-10 h-10"
                onChange={(e) => handelCodeChange(e.target, 'num2')}
              />

              <input
                id="num1"
                maxLength={1}
                type="text"
                className=" outline-none bg-gray rounded-xl text-center w-10 h-10"
                onChange={(e) => handelCodeChange(e.target, 'num3')}
              />

              <input
                id="num1"
                maxLength={1}
                type="text"
                className=" outline-none bg-gray rounded-xl text-center w-10 h-10"
                onChange={(e) => handelCodeChange(e.target, 'num4')}
              />
            </div>
          </div>

          <button
            onClick={
              Code.num1 && Code.num2 && Code.num3 && Code.num4
                ? () => {
                    HandelVerifyCode();
                  }
                : () => {}
            }
            className={`${
              Code.num1 && Code.num2 && Code.num3 && Code.num4
                ? submitBtnClass
                : grayBtnClass
            } my-3`}
            suppressHydrationWarning={suppressText}
          >
            {t('continue')}
          </button>
        </div>
      </MainContentLayout>
    </>
  );
};

export default VerificationOTP;
