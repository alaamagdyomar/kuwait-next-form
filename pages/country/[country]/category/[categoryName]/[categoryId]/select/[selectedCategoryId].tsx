import MainHead from '@/components/MainHead';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { wrapper } from '@/redux/store';
import { categoryApi } from '@/redux/api/categoryApi';
import CategoryLoadingSkeleton from '@/widgets/category/CategoryLoadingSkeleton';
import { map } from 'lodash';
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { AppQueryResult, Category } from '@/types/queries';
import Image from 'next/image';
import { appLinks, imageSizes, subCategoryBtnClass } from '@/constants/*';
import { apiSlice } from '@/redux/api';
import {
  dateSelected,
  setSearchSubCategoryCategory,
} from '@/redux/slices/searchParamsSlice';
import MainContentLayout from '@/layouts/MainContentLayout';
import { motion } from 'framer-motion';
import { setCurrentMode } from '@/redux/slices/cartSlice';
import { resetOrder } from '@/redux/slices/orderSlice';

type Props = {
  subCategories: Category;
};
const SubCategoryIndex: NextPage<Props> = ({ subCategories }): JSX.Element => {
  const {
    country: { id: country_id },
    searchParams: { searchGendersSelected, searchArea },
  } = useAppSelector((state) => state);
  const searchDateSelected = useAppSelector<string>(dateSelected);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { categoryName, categoryId, country }: any = router.query;


  const handleClick = useCallback(
    async (c: Category) => {
      await dispatch(setSearchSubCategoryCategory(c));
      if (c.gender_filter === 0 && categoryName === 'Subscription') {
        await router
          .push(
            appLinks.subscriptionIndex(
              searchDateSelected,
              c.id,
              country_id,
              searchArea?.id
            )
          )
          .then(() => dispatch(setCurrentMode(`subscription`)))
          .then(() => dispatch(resetOrder()));
      } else {
        await router.replace(
          appLinks.category(categoryName, categoryId, country, c.id)
        );
      }
    },
    [categoryId]
  );
  return (
    <>
      <MainHead
        title={`sub_category_index`}
        description={`sub_category_index`}
      />
      <MainContentLayout>
        {!subCategories ? (
          <CategoryLoadingSkeleton />
        ) : (
          <div className={`space-y-4`}>
            {map(subCategories, (c: Category, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 1 }}
              >
                <button
                  onClick={() => handleClick(c)}
                  className={`${subCategoryBtnClass}`}
                >
                  <div
                    className={`text-xl text-left font-bold text-white pr-10`}
                  >
                    {c.name}
                  </div>
                  <div>
                    <Image
                      src={`${c.image}`}
                      alt={`left-arrow`}
                      width={imageSizes.xl}
                      height={imageSizes.xl}
                      className={`w-24 h-24 object-contain`}
                    />
                  </div>
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </MainContentLayout>
    </>
  );
};

export default SubCategoryIndex;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const lang: any = context.locale;
    const { selectedCategoryId, categoryName, country }: any = context.query;
    if (!selectedCategoryId || !country) {
      return {
        notFound: true,
      };
    }
    // sports unfortunately it's hard coded !!! due to API
    if (selectedCategoryId === '1') {
      const {
        data: sportSubCategories,
        isError: isErrorSportSubCategories,
      }: {
        data: AppQueryResult<Category[]>;
        isError: boolean;
      } = await store.dispatch(
        categoryApi.endpoints.getSportSubCategories.initiate({
          lang,
          country,
        })
      );
      await Promise.all(store.dispatch(apiSlice.util.getRunningQueriesThunk()));
      if (isErrorSportSubCategories) {
        return {
          notFound: true,
        };
      }
      return {
        props: {
          subCategories: sportSubCategories.data,
        },
      };
    }
    // classs
    if (selectedCategoryId === '2') {
      const {
        data: classSubCategories,
        isError: isErrorClassSubCategories,
      }: {
        data: AppQueryResult<Category[]>;
        isError: boolean;
      } = await store.dispatch(
        categoryApi.endpoints.getClassSubCategories.initiate({
          lang,
          country,
        })
      );
      await Promise.all(store.dispatch(apiSlice.util.getRunningQueriesThunk()));
      if (isErrorClassSubCategories) {
        return {
          notFound: true,
        };
      }
      return {
        props: {
          subCategories: classSubCategories.data,
        },
      };
    }
    // subscription
    if (selectedCategoryId === '3') {
      const {
        data: subscriptionSubCategories,
        isError: isErrorSubscriptionSubCategories,
      }: {
        data: AppQueryResult<Category[]>;
        isError: boolean;
      } = await store.dispatch(
        categoryApi.endpoints.getSubscriptionSubCategories.initiate({
          lang,
          country,
        })
      );
      await Promise.all(store.dispatch(apiSlice.util.getRunningQueriesThunk()));
      if (isErrorSubscriptionSubCategories) {
        return {
          notFound: true,
        };
      }
      return {
        props: {
          subCategories: subscriptionSubCategories.data,
        },
      };
    }
    // event
    if (selectedCategoryId === '5') {
      const {
        data: eventSubCategories,
        isError: isErrorEventSubCategories,
      }: {
        data: AppQueryResult<Category[]>;
        isError: boolean;
      } = await store.dispatch(
        categoryApi.endpoints.getEventSubCategories.initiate({
          lang,
          country,
          type: selectedCategoryId,
        })
      );
      await Promise.all(store.dispatch(apiSlice.util.getRunningQueriesThunk()));
      if (isErrorEventSubCategories) {
        return {
          notFound: true,
        };
      }
      return {
        props: {
          subCategories: eventSubCategories.data,
        },
      };
    }
    return {
      notFound: true,
    };
  }
);
