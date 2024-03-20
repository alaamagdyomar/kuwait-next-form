import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import { wrapper } from '@/redux/store';
import { apiSlice } from '@/redux/api';
import { AppQueryResult, Venue } from '@/types/queries';
import { venueApi } from '@/redux/api/venueApi';
import { suppressText } from '@/constants/*';
import { isEmpty, map } from 'lodash';
import MainHead from '@/components/MainHead';
import MainContentLayout from '@/layouts/MainContentLayout';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '@/redux/hooks';
import { setSearchTimeSelected } from '@/redux/slices/searchParamsSlice';
import dynamic from 'next/dynamic';
const NoDataFound = dynamic(() => import(`@/components/NoDataFound`), {
  ssr: false,
});
import VenueWidget from '@/widgets/venue/VenueWidget';
type Props = {
  elements: Venue[];
};
const VenueIndex: NextPage<Props> = ({ elements }): JSX.Element => {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { dateSelected, country }: any = router.query;

  useEffect(() => {
    dispatch(setSearchTimeSelected(``));
  }, []);

  return (
    <>
      <MainHead title={`venue_index`} description={`venue_index_description`} />
      <MainContentLayout>
        {isEmpty(elements) ? (
          <NoDataFound title={`no_results_found`} />
        ) : (
          <div className="grid grid-cols-1 gap-x-1 gap-y-5">
            <h2 className="text-center" suppressHydrationWarning={suppressText}>
              ({elements.length}) {t('venues_found')}
            </h2>
            {map(elements, (element: Venue, i) => {
              return (
                <VenueWidget
                  element={element}
                  key={i}
                  country={country}
                  dateSelected={dateSelected}
                />
              );
            })}
          </div>
        )}
      </MainContentLayout>
    </>
  );
};

export default VenueIndex;

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
      data: AppQueryResult<Venue[]>;
      isError: boolean;
    } = await store.dispatch(
      venueApi.endpoints.getVenues.initiate({
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
