import MainHead from '@/components/MainHead';
import { NextPage } from 'next';
import { wrapper } from '@/redux/store';
import { apiSlice } from '@/redux/api';
import { AppQueryResult, Club } from '@/types/queries';
import { suppressText } from '@/constants/*';
import { isEmpty, map } from 'lodash';
import { subscriptionApi } from '@/redux/api/subscriptionApi';
import { useRouter } from 'next/router';
import MainContentLayout from '@/layouts/MainContentLayout';
import { useAppSelector } from '@/redux/hooks';
import { useTranslation } from 'react-i18next';
import SubscriptionWidget from '@/widgets/subscription/SubscriptionWidget';
import dynamic from 'next/dynamic';
const NoDataFound = dynamic(() => import(`@/components/NoDataFound`), {
  ssr: false,
});

type Props = {
  elements: Club[];
  selectedCategory: string;
};
const SubscriptionIndex: NextPage<Props> = ({
  elements,
  selectedCategory,
}): JSX.Element => {
  const {
    country: { id },
  } = useAppSelector((state) => state);
  const { t } = useTranslation();
  const router = useRouter();
  const { params }: any = router.query;

  return (
    <>
      <MainHead title={`subscription_index`} description={`subscription_index_description`} />
      <MainContentLayout>
        {isEmpty(elements) ? (
          <NoDataFound title={`no_results_found`} />
        ) : (
          <>
            <h2 className="text-center" suppressHydrationWarning={suppressText}>
              ({elements.length}) {t('gyms_found')}
            </h2>
            <div className="grid grid-cols-1 gap-x-1 gap-y-5 mt-4">
              {map(elements, (e: Club, i) => (
                <SubscriptionWidget
                  element={e}
                  key={i}
                  country={id}
                  selectedCategory={selectedCategory}
                  params={params}
                />
              ))}
            </div>
          </>
        )}
      </MainContentLayout>
    </>
  );
};

export default SubscriptionIndex;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const { dateSelected, categoryId, country }: any = await context.query;
    const lang: any = await context.locale;
    if (!dateSelected || !categoryId) {
      return {
        notFound: true,
      };
    }
    const {
      data: elements,
      isError,
    }: {
      data: AppQueryResult<Club[]>;
      isError: boolean;
    } = await store.dispatch(
      subscriptionApi.endpoints.getSubscriptions.initiate({
        lang,
        country,
        category: categoryId,
        date: dateSelected,
        query: context.params?.params ?? ``,
      })
    );
    await Promise.all(store.dispatch(apiSlice.util.getRunningQueriesThunk()));
    if (isError) {
      return {
        notFound: true,
      };
    }
    return {
      props: {
        elements: elements.data,
        selectedCategory: categoryId,
      },
    };
  }
);
