import { useRouter } from 'next/router';
import MainHead from '@/components/MainHead';
import { NextPage } from 'next';
import { wrapper } from '@/redux/store';
import { apiSlice } from '@/redux/api';
import { AppQueryResult, Class } from '@/types/queries';
import { suppressText } from '@/constants/*';
import { classApi } from '@/redux/api/classApi';
import { useTranslation } from 'react-i18next';
import MainContentLayout from '@/layouts/MainContentLayout';
import ClassWidget from '@/widgets/class/ClassWidget';
import { isEmpty } from 'lodash';
import dynamic from 'next/dynamic';
const NoDataFound = dynamic(() => import(`@/components/NoDataFound`), {
  ssr: false,
});

type Props = {
  elements: Class[];
};
const ClassIndex: NextPage<Props> = ({ elements }): JSX.Element => {
  const { t } = useTranslation();
  const router = useRouter();
  const { dateSelected, country }: any = router.query;
  return (
    <>
      <MainHead title={`class_index`} description={`class_index_description`} />
      <MainContentLayout>
        {isEmpty(elements) ? (
          <NoDataFound title={`no_results_found`} />
        ) : (
          <div className="grid grid-cols-1 gap-x-4 gap-y-6">
            <h2 className="text-center" suppressHydrationWarning={suppressText}>
              ({elements.length}) {t('classes_found')}
            </h2>
            {elements.map((element: Class, i) => {
              return (
                <ClassWidget
                  element={element}
                  key={i}
                  dateSelected={dateSelected}
                  country={country}
                />
              );
            })}
          </div>
        )}
      </MainContentLayout>
    </>
  );
};

export default ClassIndex;

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
      data: AppQueryResult<Class[]>;
      isError: boolean;
    } = await store.dispatch(
      classApi.endpoints.getClasses.initiate({
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
