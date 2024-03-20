import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import CheckIcon from '@mui/icons-material/Check';
import React, { useEffect, useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import {
  appLinks,
  grayBtnClass,
  imageSizes,
  subCategoryBtnClass,
  suppressText,
} from '@/constants/*';
import { wrapper } from '@/redux/store';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setCurrentModule } from '@/redux/slices/appSettingSlice';
import { categoryApi } from '@/redux/api/categoryApi';
import { apiSlice } from '@/redux/api';
import { AppQueryResult, CategoriesType, Category } from '@/types/queries';
import { isEmpty, indexOf, map, isNull } from 'lodash';
import { MagnifyingGlassIcon, ArrowPathIcon } from '@heroicons/react/24/solid';
import {
  dateSelected,
  removeSearchArea,
  removeSearchSubCategoryCategory,
  resetSearchGendersSelected,
  resetSearchParams,
  setSearchDateSelected,
  setSearchTimeSelected,
  toggleGendersSelected,
} from '@/redux/slices/searchParamsSlice';
import MainHead from '@/components/MainHead';
import MainContentLayout from '@/layouts/MainContentLayout';
import { motion } from 'framer-motion';
import moment from 'moment';
import { resetOrder } from '@/redux/slices/orderSlice';
import { setCurrentMode } from '@/redux/slices/cartSlice';
import dynamic from 'next/dynamic';
import { resetBackPath } from '@/redux/slices/guestSlice';
const AreaModal = dynamic(() => import(`@/components/modals/AreaModal`), {
  ssr: false,
});
const PickDateModal = dynamic(
  () => import(`@/components/modals/PickDateModal`),
  {
    ssr: false,
  }
);
const SelectDateBtn = dynamic(
  () => import(`@/components/widgets/category/SelectDateBtn`),
  {
    ssr: false,
  }
);
const SelectAreaBtn = dynamic(
  () => import(`@/components/widgets/category/SelectAreaBtn`),
  {
    ssr: false,
  }
);

type Props = {
  mainCategory: Category;
};

const CategoryIndex: NextPage<Props> = ({ mainCategory }): JSX.Element => {
  const { t } = useTranslation();
  const {
    searchParams: { searchSubCategory, searchArea, searchGendersSelected },
    country: { id: country_id },
    locale: { lang },
  } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { query } = router;
  const [isSearchable, setIsSearchable] = useState<boolean>(false);
  const searchDateSelected = useAppSelector<string>(dateSelected);
  const genders = ['male', 'female', 'kids'];
  useEffect(() => {
    dispatch(setCurrentModule(t(`select_item`, { item: mainCategory.name })));
    if (!query.subcategory_id && searchSubCategory?.id) {
      dispatch(removeSearchSubCategoryCategory());
    }
    dispatch(setSearchTimeSelected(``));
    if (!searchDateSelected) {
      dispatch(setSearchDateSelected(moment(new Date()).format('YYYY-MM-DD')));
    }
    dispatch(resetBackPath());
  }, [mainCategory]);
  const handleClick = () => {
    router.push(
      appLinks.subCategoryList(mainCategory.name, mainCategory.id, country_id),
      ``,
      { locale: lang, scroll: false }
    );
  };

  useMemo(() => {
    if (mainCategory.id === 3 || mainCategory.id === 2) {
      setIsSearchable(
        !isEmpty(searchDateSelected) &&
          moment(searchDateSelected).isValid() &&
          !isEmpty(searchSubCategory?.name) &&
          (searchSubCategory?.gender_filter === 1
            ? searchGendersSelected?.length > 0
            : true)
      );
    } else {
      setIsSearchable(
        !isEmpty(searchDateSelected) && !isEmpty(searchSubCategory?.name)
      );
    }
  }, [
    searchDateSelected,
    searchSubCategory,
    searchArea,
    searchGendersSelected
  ]);

  const handleSearchClick = () => {
    if (mainCategory.id === 1) {
      router
        .push(
          appLinks.venueIndex(
            searchDateSelected,
            searchSubCategory.id,
            country_id,
            searchArea?.id,
            map(searchGendersSelected, (g, i) => `gender[${i}]=${g}`).join(`&`)
          )
        )
        .then(() => dispatch(setCurrentMode(`venue`)));
    } else if (mainCategory.id === 2) {
      router
        .push(
          appLinks.classIndex(
            searchDateSelected,
            searchSubCategory.id,
            country_id,
            searchArea?.id,
            map(searchGendersSelected, (g, i) => `gender[${i}]=${g}`).join(`&`)
          )
        )
        .then(() => dispatch(setCurrentMode(`classes`)));
    } else if (mainCategory.id === 3) {
      router
        .push(
          appLinks.subscriptionIndex(
            searchDateSelected,
            searchSubCategory.id,
            country_id,
            searchArea?.id,
            map(searchGendersSelected, (g, i) => `gender[${i}]=${g}`).join(`&`)
          )
        )
        .then(() => dispatch(setCurrentMode(`subscription`)));
    } else if (mainCategory.id === 5) {
      router
        .push(
          appLinks.eventIndex(
            searchDateSelected,
            searchSubCategory.id,
            country_id,
            searchArea?.id,
            map(searchGendersSelected, (g, i) => `gender[${i}]=${g}`).join(`&`)
          )
        )
        .then(() => dispatch(setCurrentMode(`event`)));
    }
    dispatch(resetOrder());
  };

  useEffect(() => {
    if(isNull(searchSubCategory)) {
      dispatch(resetSearchGendersSelected());
    }
  }, [searchSubCategory]);

  return (
    <Suspense>
      <MainHead title={mainCategory.name} description={mainCategory.name} />
      <MainContentLayout backHome={true}>
        <div className="flex flex-col capitalize">
          {/* centered title */}
          {/*<span*/}
          {/*  className={`text-center text-black`}*/}
          {/*  suppressHydrationWarning={suppressText}*/}
          {/*>*/}
          {/*  {t('select_your_favorite_category_and_book_your_game', {*/}
          {/*    category: mainCategory.name,*/}
          {/*  })}*/}
          {/*</span>*/}
          {/* Category Btn */}
          <div
            className={`${
              mainCategory.id === 3 ? `gap-y-4` : `gap-y-6`
            } grid grid-cols-2 gap-x-5 py-5`}
          >
            <div className={`col-span-full h-fit`}>
              {searchSubCategory?.id ? (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 1 }}
                  className={`cursor-pointer`}
                >
                  <button
                    className={`${subCategoryBtnClass} flex flex-row  flex-grow h-full p-4`}
                    onClick={() => handleClick()}
                  >
                    <div
                      className={`flex flex-col h-full justify-center items-center px-4 space-y-2`}
                    >
                      <div
                        className={`text-xl font-bold text-white  pt-4`}
                        suppressHydrationWarning={suppressText}
                      >
                        {searchSubCategory.name}
                        <div
                          className={`text-sm font-bold text-white drop-shadow-sm`}
                          suppressHydrationWarning={suppressText}
                        >
                          {mainCategory.name}
                        </div>
                      </div>
                      <div
                        className={`${grayBtnClass} text-sm p-2 rounded-lg bg-gray-50 shadow-sm`}
                        suppressHydrationWarning={suppressText}
                      >
                        {t('change')}
                      </div>
                    </div>
                    <div className={`flex`}>
                      <Image
                        src={`${searchSubCategory.image}`}
                        alt={`left-arrow`}
                        width={imageSizes.xl}
                        height={imageSizes.xl}
                        className={`w-24 h-24 object-contain`}
                      />
                    </div>
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  // initial={{ opacity: 0, scale: 0.5 }}
                  // transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 1 }}
                >
                  <Link
                    href={`${appLinks.subCategoryList(
                      mainCategory.name,
                      mainCategory.id.toString(),
                      country_id
                    )}`}
                    scroll={true}
                    className={
                      'relative rounded-xl p-4 px-8 h-full shadow-lg flex flex-row flex-grow items-center justify-between cursor-pointer  border border-gray-100 drop-shadow-sm h-36'
                    }
                  >
                    <div className={`flex items-center justify-center`}>
                      <Image
                        src={`${mainCategory.image}`}
                        width={imageSizes.xl}
                        height={imageSizes.xl}
                        alt={`sports`}
                        className={`w-20 h-auto`}
                      />
                    </div>
                    <div className="flex mx-auto items-center px-2 pt-1 text-sm">
                      <span
                        className={` lg:ltr:pr-16 lg:rtl:pl-16 text-md`}
                        suppressHydrationWarning={suppressText}
                      >
                        {t('select')} {mainCategory.name}
                      </span>
                      {/* <Image
                    src={router.locale === 'ar' ? LeftArrow : RightArrow}
                    fill={false}
                    className={`w-3 h-3 md:w-5 md:h-5 object-contain`}
                    alt={`arrow`}
                    /> */}
                    </div>
                    <div className="h-full hidden">
                      <CheckIcon className={`text-white`} />
                    </div>
                  </Link>
                </motion.div>
              )}
            </div>
            {/* select GENDER (Only in Subscription) */}
            {(mainCategory.id === 3 || mainCategory.id === 2) && (
              <div
                className={`col-span-full flex w-full flex-row items-center justify-between drop-shadow-sm`}
              >
                {(mainCategory.id === 3 || mainCategory.id === 2) && searchSubCategory?.gender_filter === 1
                  ? map(genders, (g, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 1 }}
                        className={`${
                          indexOf(searchGendersSelected, g) >= 0 &&
                          `bg-primary_BG text-white`
                        } flex w-full h-16 items-center justify-between border border-gray-100 rounded-lg  px-6 capitalize shadow-md pt-2 rtl:first:ml-2 rtl:last:mr-2  ltr:first:mr-2 ltr:last:ml-2`}
                      >
                        <button
                          onClick={() => dispatch(toggleGendersSelected(g))}
                          className={`flex w-full h-16 items-center justify-between`}
                        >
                          <span
                            suppressHydrationWarning={suppressText}
                            className={`capitalize`}
                          >
                            {t(g)}
                          </span>
                          <span>
                            <CheckIcon
                              className={`relative -top-4 text-white`}
                            />
                          </span>
                        </button>
                      </motion.div>
                    ))
                  : isEmpty(searchSubCategory) &&
                    map(genders, (g, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 1 }}
                        className={`${
                          indexOf(searchGendersSelected, g) >= 0 &&
                          `bg-primary_BG text-white`
                        } flex w-full h-16 items-center justify-between border border-gray-100 rounded-lg  px-6 capitalize shadow-md pt-2 rtl:first:ml-2 rtl:last:mr-2  ltr:first:mr-2 ltr:last:ml-2`}
                      >
                        <button
                          onClick={() => dispatch(toggleGendersSelected(g))}
                          className={`flex w-full h-16 items-center justify-between`}
                        >
                          <span
                            suppressHydrationWarning={suppressText}
                            className={`capitalize`}
                          >
                            {t(g)}
                          </span>
                          <span>
                            <CheckIcon
                              className={`relative -top-4 text-white`}
                            />
                          </span>
                        </button>
                      </motion.div>
                    ))}
              </div>
            )}
            {/* select Date */}
            <SelectDateBtn />
            {/* select area */}
            <SelectAreaBtn />
          </div>
          <div className="flex flex-row justify-between items-center py-2">
            <div className={`flex w-full`}>
              <button
                onClick={() => handleSearchClick()}
                disabled={!isSearchable}
                className={`disabled:bg-gray-100 disabled:text-gray-400 flex justify-between items-center bg-primary_BG text-white w-full p-3 rounded-lg shadow-md`}
              >
                <span
                  suppressHydrationWarning={suppressText}
                  className={`capitalize`}
                >
                  {t('search')}
                </span>
                <MagnifyingGlassIcon
                  className={`w-6 h-6 text-white drop-shadow-sm`}
                />
              </button>
            </div>
          </div>
        </div>
      </MainContentLayout>
      {/*   Area & Date Model */}
      <AreaModal />
      <PickDateModal />
    </Suspense>
  );
};

export default CategoryIndex;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const lang: any = context.locale;
    const { categoryName, categoryId, country }: any = context.query;
    if (!categoryId || !categoryName || !country) {
      return {
        notFound: true,
      };
    }
    const {
      data: types,
      isError,
    }: {
      data: AppQueryResult<CategoriesType>;
      isError: boolean;
    } = await store.dispatch(
      categoryApi.endpoints.getMainCategories.initiate({ lang, country })
    );
    await Promise.all(store.dispatch(apiSlice.util.getRunningQueriesThunk()));
    if (isError || !types.data) {
      return {
        notFound: true,
      };
    }
    const mainCategory: any[] = [];
    types.data.types.map((t: Category) =>
      t.id == categoryId ? mainCategory.push(t) : null
    );
    return {
      props: {
        mainCategory: mainCategory[0],
      },
    };
  }
);
