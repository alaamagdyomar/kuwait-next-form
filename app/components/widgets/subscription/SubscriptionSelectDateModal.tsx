import { FC, Fragment } from 'react';
import { Modal, Button } from 'flowbite-react';
import { useTranslation } from 'react-i18next';
import {
  appLinks,
  grayBtnClass,
  submitBtnClass,
  suppressText,
  tajwalFont,
} from '@/constants/*';
import CalenderIcon from '@/appIcons/blue_calender.svg';
import Image from 'next/image';
import { Label, Radio } from 'flowbite-react';
import moment from 'moment';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { XMarkIcon } from '@heroicons/react/24/outline';
import {
  showPickDateModal,
  showToastMessage,
} from '@/redux/slices/appSettingSlice';
import { setSearchDateSelected } from '@/redux/slices/searchParamsSlice';
import { setCartSubscription } from '@/redux/slices/cartSlice';
import { useSetSubscriptionMutation } from '@/redux/api/cartApi';
import { isAuthenticated, isVerified } from '@/redux/slices/authSlice';
import { useRouter } from 'next/router';
import { isNull } from 'lodash';

type Props = {
  showSubscriptionDateModal: boolean;
  setShowSubscriptionDateModal: (e: boolean) => void;
  showCalender: number | boolean;
};
const SubscriptionSelectDateModal: FC<Props> = ({
  showSubscriptionDateModal,
  setShowSubscriptionDateModal,
  showCalender = false,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const {
    locale: { dir, lang },
    country: { id: country },
    searchParams: { searchDateSelected },
    currentElement: { element, type },
    guest: { guestMode, backPath },
  } = useAppSelector((state) => state);
  const today: string = moment(new Date()).toString();
  const tomorrow: string = moment(new Date()).add(1, 'day').toString();
  const searchDateSelectedFormated: string = moment(searchDateSelected)
    .format(`MMMM D, YYYY`)
    .toString();
  const [trigger] = useSetSubscriptionMutation();
  const isAuth = useAppSelector(isAuthenticated);
  const verified = useAppSelector(isVerified);
  const router = useRouter();

  const handleClick = () => {
    trigger({
      lang,
      country,
      params: {
        subscription_id: element?.id.toString(),
        date: moment(searchDateSelected).format('YYYY-MM-DD'), //
      },
    }).then((r: any) => {
      if (r.data && r.data?.success && r.data.data.subscription) {
        dispatch(
          setCartSubscription({
            subscription: r.data.data.subscription,
            paymentMethods: r.data.data.payment_methods,
          })
        );
        if (isAuth && !verified) {
          router.push(appLinks.verificationMobileNo.path);
        } else if (!isAuth && !guestMode) {
          router.push(appLinks.login.path);
        } else if (!isNull(backPath)) {
          router.push(backPath);
        }
      } else if (r.error) {
        dispatch(
          showToastMessage({ content: r.error.data.message, type: 'error' })
        );
      }
    });
  };

  return (
    <Fragment>
      <Modal
        show={showSubscriptionDateModal}
        position="bottom-center"
        onClose={() => setShowSubscriptionDateModal(false)}
        size={'full'}
        dir={dir}
        className={`${tajwalFont}`}
      >
        <div className={`flex flex-row w-2/3 mx-auto  p-6 pt-8 capitalize`}>
          <div className="flex-1 flex flex-row">
            <Image
              src={CalenderIcon}
              alt={t('calender')}
              className={`w-6 h-6 object-contain`}
            />
            <p
              className="px-3 capitalize"
              suppressHydrationWarning={suppressText}
            >
              {t('start_date')}
            </p>
          </div>
          <XMarkIcon
            className={`w-6 h-6 text-gray-500`}
            onClick={() => setShowSubscriptionDateModal(false)}
          />
        </div>
        <Modal.Body className={`w-2/3 mx-auto`}>
          <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row justify-start items-start">
            <div className="flex items-center md:rtl:ml-10 md:ltr:mr-10">
              <Radio
                id="today"
                name="selectedDate"
                value={today}
                className={`rtl:ml-4 ltr:mr-4`}
                onChange={(e) =>
                  dispatch(setSearchDateSelected(e.target.value))
                }
              />
              <Label
                htmlFor="today"
                suppressHydrationWarning={suppressText}
                className={`capitalize`}
              >
                {t(`start_today`)} {moment(today).format('MMMM D, YYYY')}
              </Label>
            </div>
            <div className="flex items-center md:ml-4">
              <Radio
                id="tomorrow"
                name="selectedDate"
                value={tomorrow}
                className={`rtl:ml-4 ltr:mr-4`}
                onChange={(e) =>
                  dispatch(setSearchDateSelected(e.target.value))
                }
              />
              <Label
                htmlFor="tomorrow"
                suppressHydrationWarning={suppressText}
                className={`capitalize`}
              >
                {t(`start_tomorrow`)} {moment(tomorrow).format('MMMM D, YYYY')}
              </Label>
            </div>
          </div>
          {showCalender === 1 ? (
            <div className="flex flex-col w-full md:flex-row justify-center items-center gap-4 my-4 border-t border-gray-200 pt-4 ">
              <div
                className={`flex flex-row w-full flex-1 justify-center items-center md:gap-4 `}
              >
                <Radio
                  id="tomorrow"
                  name="selectedDate"
                  value={searchDateSelected}
                  className={`rtl:ml-4 ltr:mr-4`}
                  onChange={(e) =>
                    dispatch(setSearchDateSelected(e.target.value))
                  }
                />
                <Label
                  htmlFor="accept"
                  className={`flex flex-1 w-full flex-col space-y-2`}
                >
                  <p suppressHydrationWarning={suppressText}>
                    {t('select_a_date_to_start_ur_subscription')}
                  </p>
                  <p className={`text-gray-500`}>
                    <span className={`ltr:pr-3 rtl:pl-3`}>
                      {t('selected_date')}:
                    </span>
                    <span className={`text-primary_BG`}>
                      {searchDateSelectedFormated}
                    </span>
                  </p>
                </Label>
              </div>
              <button
                className={`${grayBtnClass}`}
                suppressHydrationWarning={suppressText}
                onClick={() => dispatch(showPickDateModal())}
              >
                {t('change')}
              </button>
            </div>
          ) : null}
        </Modal.Body>
        <Modal.Footer
          className={`w-2/3 mx-auto flex justify-center items-center`}
        >
          <Button
            onClick={() => handleClick()}
            suppressHydrationWarning={suppressText}
            disabled={!searchDateSelected}
            className={`${submitBtnClass} py-0 w-full`}
          >
            {t('submit')}
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
};

export default SubscriptionSelectDateModal;
