import LoadingSpinner from '@/components/LoadingSpinner';
import { useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import MainContentLayout from '@/layouts/MainContentLayout';
import { useAppDispatch } from '@/redux/hooks';
import { setCurrentModule } from '@/redux/slices/appSettingSlice';
import { wrapper } from '@/redux/store';
import { useTranslation } from 'react-i18next';

const RedirectPage: NextPage<{ url: string }> = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { query }: any = router;
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(setCurrentModule(t(`go_to_payment_page`)));
    if (query.url) {
      window.location.href = query.url;
    }
  }, []);

  return (
    <MainContentLayout>
      <LoadingSpinner />
    </MainContentLayout>
  );
};

export default RedirectPage;
