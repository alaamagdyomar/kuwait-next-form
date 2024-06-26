import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import { Cart, PaymentMethod } from '@/types/index';
import { imageSizes, suppressText } from '@/constants/*';

type Props = {
  paymentMethod: PaymentMethod | null;
  setPaymentMethod: (p: PaymentMethod) => void;
  elements: Cart['paymentMethods'];
};
const PaymentMethods: FC<Props> = ({
  paymentMethod,
  setPaymentMethod,
  elements,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <div className={`my-4 space-y-4`}>
        <h5
          className="text-center py-2"
          suppressHydrationWarning={suppressText}
        >
          {t('select_your_payment_method')}
        </h5>
        <div className="flex flex-row space-y-4 justify-between items-center">
          {elements.map((p, i) => (
            <button
              key={i}
              onClick={() => setPaymentMethod(p)}
              className={`${
                p.id === paymentMethod?.id &&
                `ring-offset-2 ring-2 ring-primary_BG `
              } rounded-md`}
            >
              <Image
                className="w-20 md:w-30 lg:w-40 h-fit object-cover rounded-md mb-3"
                src={p.image}
                width={imageSizes.xl}
                height={imageSizes.xl}
                alt={p.name}
              />
              <span>{t(p.name)}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default PaymentMethods;
