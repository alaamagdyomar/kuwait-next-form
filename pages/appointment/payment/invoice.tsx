import { NextPage } from 'next';
import MainContentLayout from '@/layouts/MainContentLayout';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useEffect } from 'react';
import { setCurrentModule } from '@/redux/slices/appSettingSlice';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import LoadingSpinner from '@/components/LoadingSpinner';
import ClassInvoice from '@/components/widgets/invoice/ClassInvoice';
import StoreInvoice from '@/components/widgets/invoice/StoreInvoice';
import { suppressText } from '@/constants/*';
import EventInvoice from '@/widgets/invoice/EventInvoice';
import SubscriptionInvoice from '@/components/widgets/invoice/SubscriptionInvoice';

const InvoicePage: NextPage = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    order: { order_id },
    cart: { currentMode },
  } = useAppSelector((state) => state);

  useEffect(() => {
    dispatch(setCurrentModule(t(`invoice`)));
  }, []);

  if (!router.isReady && !order_id) {
    return <LoadingSpinner />;
  }

  return (
    <MainContentLayout>
      <h5 className="text-center py-5" suppressHydrationWarning={suppressText}>
        {t('view_receipt')}
      </h5>
      {currentMode && currentMode === 'classes' && <ClassInvoice />}
      {currentMode && currentMode === 'event' && <EventInvoice />}
      {currentMode && currentMode === 'product' && <StoreInvoice />}
      {currentMode && currentMode === 'subscription' && <SubscriptionInvoice/>}
    </MainContentLayout>
  );
};

export default InvoicePage;
