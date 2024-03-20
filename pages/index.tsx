import { Suspense, useEffect } from 'react';
import { wrapper } from '@/redux/store';
import { apiSlice } from '@/redux/api';
import { NextPage } from 'next';
import {
  AppQueryResult,
  CategoriesType,
  Country,
  StaticPage,
} from '@/types/queries';
import { map, upperCase } from 'lodash';
import { useAppDispatch } from '@/redux/hooks';
import {
  removeSearchArea,
  removeSearchSubCategoryCategory,
  setSearchMainCategory,
} from '@/redux/slices/searchParamsSlice';
import { categoryApi } from '@/redux/api/categoryApi';
import { countryApi } from '@/redux/api/countryApi';
import { setLocale } from '@/redux/slices/localeSlice';
import { motion } from 'framer-motion';
import MainHead from '@/components/MainHead';
import MainContentLayout from '@/layouts/MainContentLayout';
import dynamic from 'next/dynamic';
import ModuleCard from '@/components/home/ModuleCard';
import logoImage from 'public/android-icon-144x144.png';
import LoadingSpinner from '@/components/LoadingSpinner';
import { resetBackPath } from '@/redux/slices/guestSlice';
import { useTranslation } from 'react-i18next';
const GeneralCarousel = dynamic(
  async () => await import(`@/components/GeneralCarousel`),
  {
    ssr: true,
  }
);
const HomeLocalizationSelection = dynamic(
  async () => await import(`@/components/home/HomeLocalizationSelection`),
  {
    ssr: true,
  }
);

type Props = {
  types: CategoriesType;
  countries: Country[];
  aboutus: StaticPage;
};
const HomePage: NextPage<Props> = ({
  types,
  countries,
  aboutus,
}): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const sliders = map(types.slider, (slide) => slide);

  useEffect(() => {
    dispatch(removeSearchSubCategoryCategory());
    dispatch(resetBackPath());
  }, [types, countries]);

  useEffect(() => {
    dispatch(removeSearchArea());
  }, []);
  return (
    <Suspense
      fallback={
        <div className={`h-screen`}>
          <LoadingSpinner />
        </div>
      }
    >
      {/* SEO Head DEV*/}
      <MainHead
        title={upperCase(`${t('home')} - Form`)}
        description={aboutus.body}
        mainImage={`${logoImage.src}`}
      />
      <MainContentLayout hideBack={true}>
        <div className="flex flex-col gap-y-5">
          <GeneralCarousel slides={sliders} />
          <div className={`flex items-start justify-center w-full h-1/2`}>
            <div className="grid grid-cols-2 gap-x-5 gap-y-6  py-5 w-full">
              {map(types.types, (item) => (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 1 }}
                  key={item.id}
                  onClick={() => dispatch(setSearchMainCategory(item))}
                >
                  <ModuleCard category={item} />
                </motion.div>
              ))}
            </div>
          </div>
          {/*Lang & Country Selection*/}
          <HomeLocalizationSelection countries={countries} />
        </div>
      </MainContentLayout>
    </Suspense>
  );
};

export default HomePage;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ locale, req, res }) => {
      // THE MOST EFFICIENT IMPLEMENTATION FOR COUNTRY SET TO ALL HEADERS
      const lang: any = locale;
      const country: any = req.cookies.country
        ? JSON.parse(req.cookies.country)
        : store.getState().country;
      await store.dispatch(setLocale(locale));
      const {
        data: types,
        isError,
      }: {
        data: AppQueryResult<CategoriesType[]>;
        isError: boolean;
      } = await store.dispatch(
        categoryApi.endpoints.getMainCategories.initiate({
          lang,
          country: country.id,
        })
      );
      const {
        data: pages,
        isError: aboutPageError,
      }: { data: AppQueryResult<CategoriesType[]>; isError: boolean } =
        await store.dispatch(apiSlice.endpoints.getStaticPages.initiate(lang));
      const {
        data: countries,
        isError: countriesError,
      }: {
        data: AppQueryResult<Country[]>;
        isError: boolean;
      } = await store.dispatch(
        countryApi.endpoints.getAllCountries.initiate({
          lang,
          country: country.id,
        })
      );
      await Promise.all(store.dispatch(apiSlice.util.getRunningQueriesThunk()));
      if (
        isError ||
        !types.data ||
        countriesError ||
        !countries.data ||
        aboutPageError
      ) {
        return {
          notFound: true,
        };
      }
      return {
        props: {
          types: types.data,
          countries: countries.data,
          aboutus: pages.data[0],
        },
      };
    }
);
