import { NextPage } from 'next';
import MainHead from '@/components/MainHead';
import { wrapper } from '@/redux/store';
import { AppQueryResult, CategoriesType, StaticPage } from '@/types/queries';
import { apiSlice } from '@/redux/api';
import aboutImg from '@/appImages/about/about_image.png';
import Image from 'next/image';
import MainContentLayout from '@/layouts/MainContentLayout';
import { useEffect } from 'react';
import { setCurrentModule } from '@/redux/slices/appSettingSlice';
import { useAppDispatch } from '@/redux/hooks';
import { useTranslation } from 'react-i18next';
import { imageSizes } from '@/constants/*';

type Props = {
  element: StaticPage;
};

const AboutPage: NextPage<Props> = ({ element }): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setCurrentModule(t('aboutus')));
  }, []);

  return (
    <>
      <MainHead title={element.title} description={element.title} />
      <MainContentLayout backHome={true}>
        <div className="flex flex-wrap justify-center">
          <Image
            className="w-40 h-40"
            width={imageSizes.xl}
            height={imageSizes.xl}
            src={aboutImg}
            alt="terms_image"
          />
        </div>
        <div className="rounded-lg border-2 border-slate-200 px-7 py-2 mt-5 text-justify">
          <p>{element.body}</p>
        </div>
      </MainContentLayout>
    </>
  );
};

export default AboutPage;

export const getServerSideProps = wrapper.getStaticProps(
  (store) => async (context) => {
    const currentLang: any = context.locale;
    const {
      data: pages,
      isError,
    }: { data: AppQueryResult<CategoriesType[]>; isError: boolean } =
      await store.dispatch(
        apiSlice.endpoints.getStaticPages.initiate(currentLang)
      );
    await Promise.all(store.dispatch(apiSlice.util.getRunningQueriesThunk()));
    if (isError || !pages.data) {
      return {
        notFound: true,
      };
    }
    return {
      props: {
        element: pages.data[0],
      },
    };
  }
);
