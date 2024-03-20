import { Suspense } from 'react';
import { useRouter } from 'next/router';
import MainHead from '@/components/MainHead';
import { NextPage } from 'next';
import { wrapper } from '@/redux/store';
import { apiSlice } from '@/redux/api';
import { AppQueryResult, Event } from '@/types/queries';
import { suppressText } from '@/constants/*';
import { useTranslation } from 'react-i18next';
import MainContentLayout from '@/layouts/MainContentLayout';
import dynamic from 'next/dynamic';
const NoDataFound = dynamic(() => import(`@/components/NoDataFound`), {
  ssr: false,
});
import { eventApi } from '@/redux/api/eventApi';
import { isEmpty } from 'lodash';
import EventWidget from '@/widgets/event/EventWidget';

type Props = {
  elements: Event[];
};
const EventIndex: NextPage<Props> = ({ elements }): JSX.Element => {
  const { t } = useTranslation();
  const router = useRouter();
  const { dateSelected, country }: any = router.query;

  return (
    <>
      <MainHead
        title={t(`event_index`)}
        description={`event_index_description`}
      />
      <MainContentLayout>
        {isEmpty(elements) ? (
          <NoDataFound title={`no_results_found`} />
        ) : (
          <Suspense>
            <div className="grid grid-cols-1 gap-x-4 gap-y-6">
              <h2
                className="text-center"
                suppressHydrationWarning={suppressText}
              >
                {elements.length} {t('events_found')}
              </h2>
              {elements.map((element: Event, i) => {
                return (
                  <EventWidget
                    element={element}
                    country={country}
                    key={i}
                    dateSelected={dateSelected}
                  />
                );
              })}
            </div>
          </Suspense>
        )}
      </MainContentLayout>
    </>
  );
};

export default EventIndex;

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
      data: AppQueryResult<Event[]>;
      isError: boolean;
    } = await store.dispatch(
      eventApi.endpoints.getEvents.initiate({
        lang,
        country,
        category: categoryId,
        date: dateSelected,
        query: context.params?.params ?? ``,
      })
    );
    await Promise.all(store.dispatch(apiSlice.util.getRunningQueriesThunk()));
    if (isError || !elements.data) {
      return {
        notFound: true,
      };
    }
    return {
      props: {
        elements: elements.data,
      },
    };
  }
);
