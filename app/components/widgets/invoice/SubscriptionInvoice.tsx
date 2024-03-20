import {
  appLinks,
  imageSizes,
  submitBtnClass,
  suppressText,
} from '@/constants/*';
import {
  AccessTime,
  CalendarMonth,
  LocationOn,
  Person,
  Payment,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { FC } from 'react';
import { useAppSelector } from '@/redux/hooks';
import Image from 'next/image';
import PaymentImage from '@/widgets/invoice/PaymentImage';
import Link from 'next/link';

const SubscriptionInvoice: FC = (): JSX.Element => {
  const { t } = useTranslation();
  const { order } = useAppSelector((state) => state);

  return (
    <div>
      <div className="bg-gray-100 rounded p-4 text-base">
        <h2
          className="text-primary_BG pb-2 text-lg"
          suppressHydrationWarning={suppressText}
        >
          {t('payment_receipt')}
        </h2>
        <div className="py-3 border-b border-b-gray-300">
          <div className="flex items-center pb-2">
            <Person fontSize={'small'} />
            <h6
              className="px-2 text-primary_BG"
              suppressHydrationWarning={suppressText}
            >
              {t('billed_to')}
            </h6>
          </div>
          <h5 className="font-semibold">{order.subscription_name}</h5>
          <p>{order.vendor_name}</p>
          <p>{order.customer_name}</p>
          <p>{order.customer_phone}</p>
        </div>

        <div className="py-3 border-b border-t border-b-gray-300 border-t-gray-300">
          <div className="flex items-center">
            <CalendarMonth fontSize={'small'} />
            <h6
              className="px-2 text-primary_BG"
              suppressHydrationWarning={suppressText}
            >
              {t('start_date')}
            </h6>
          </div>
          <div className="flex items-center">
            <p className="text-xs">
              {order.start_date}
            </p>
          </div>
        </div>

        {/* payment */}
        <div className="py-3 border-b border-b-gray-300">
          <div className="flex items-center pb-2">
            <Payment fontSize={'small'} />
            <h6
              className="px-2 text-primary_BG"
              suppressHydrationWarning={suppressText}
            >
              {t('payment')}
            </h6>
          </div>
          <div className="flex flex-row justify-start space-x-3 items-center">
            <div>
              <PaymentImage paymentMethod={order.payment_method.image} />
            </div>
            <div className={`pt-2 px-1`}>
              <p>{order.payment_method.name}</p>
            </div>
          </div>
        </div>
        <div className='mt-3'>
          <div className="flex justify-between w-full">
            <p>{t('total_amount')}</p>
            <p suppressHydrationWarning={suppressText}>
            {order.price} {t(order.currency)}
          </p>
          </div>
        </div>
        <div className=" flex flex-col flex-1 w-full justify-center items-center text-center rounded-3xl bg-white py-5 mb-10 shadow-lg mt-5">
          <Link
            href={appLinks.home.path}
            className="btn text-base w-32 rounded-full py-1 border-[1px] border-slate-700"
            suppressHydrationWarning={suppressText}
          >
            {t('back_to_home')}
          </Link>
        </div>
      </div>
    </div>
  );
};
export default SubscriptionInvoice;
