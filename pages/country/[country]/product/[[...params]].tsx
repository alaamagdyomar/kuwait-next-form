import MainHead from '@/components/MainHead';
import { NextPage } from 'next';
import { wrapper } from '@/redux/store';
import { AppQueryResult } from '@/types/queries';
import { Product } from '@/types/index';
import { debounce, isEmpty, map } from 'lodash';
import PaginationComponent from '@/components/PaginationComponent';
import HorProductWidget from '@/widgets/product/HorProductWidget';
import { productApi } from '@/redux/api/productApi';
import MainContentLayout from '@/layouts/MainContentLayout';
import { apiSlice } from '@/redux/api';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import React, { useEffect, useState } from 'react';
import { setCurrentModule } from '@/redux/slices/appSettingSlice';
import dynamic from 'next/dynamic';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { suppressText } from '@/constants/*';
import { storeApi, useLazyGetStoreSearchQuery } from '@/redux/api/storeApi';
import { ArrowPathIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/router';
const NoDataFound = dynamic(() => import(`@/components/NoDataFound`), {
  ssr: false,
});

type Props = {
  elements: AppQueryResult<Product[]>;
};
const ProductIndex: NextPage<Props> = ({ elements }): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const {
    locale: { lang },
    country: { id: country },
  } = useAppSelector((state) => state);
  const [trigger] = useLazyGetStoreSearchQuery<{
    trigger: () => void;
    data: AppQueryResult<any>;
    isSuccess: boolean;
  }>();
  const [currentProducts, setCurrentProducts] = useState<any>([]);

  useEffect(() => {
    dispatch(setCurrentModule(t('product_index')));
  }, []);

  const handleChange = (key: string) => {
    if (key.length > 3) {
      trigger({ lang, key, country }).then((r: any) =>
        setCurrentProducts(r.data.data.item)
      );
    } else {
      setCurrentProducts(elements.data);
    }
  };

  useEffect(() => {
    setCurrentProducts(elements.data);
  }, []);

  return (
    <>
      <MainHead
        title={`product_index`}
        description={`product_index_description`}
      />
      {isEmpty(elements) ? (
        <NoDataFound title={`no_results_found`} />
      ) : (
        <MainContentLayout>
          {/* Search Input */}
          <div
            className={`flex flex-1 w-auto flex-grow pb-8 border-b border-stone-100`}
          >
            <div
              className={`w-full flex flex-row justify-between items-center`}
            >
              <div className="relative flex-1 mt-1 rounded-md shadow-sm text-gray-400">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-6">
                  <MagnifyingGlassIcon className="h-8 w-8" aria-hidden="true" />
                </div>
                <input
                  type="search"
                  name="search"
                  id="search"
                  onChange={debounce((e) => handleChange(e.target.value), 400)}
                  className="block w-full rounded-md  pl-20 focus:ring-1 focus:ring-primary_BG border-none  bg-gray-100 py-3 h-14 text-lg capitalize"
                  suppressHydrationWarning={suppressText}
                  placeholder={`${t(`search_products`)}`}
                />
              </div>
              {/*<button*/}
              {/*  onClick={() => set}*/}
              {/*  className={`flex w-fit justify-between items-center bg-red-600 text-white p-3 rounded-lg shadow-md h-14`}*/}
              {/*>*/}
              {/*  /!* reset all ==> Date / Area  / SubCategory *!/*/}
              {/*  <ArrowPathIcon className={`text-white w-6 h-6`} />*/}
              {/*</button>*/}
            </div>
          </div>
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 mb-6 gap-4 items-center justify-between w-full`}
          >
            {map(currentProducts, (e: Product, i) => (
              <div className={`col-span-1 w-60 mx-auto h-auto sm:w-full`} key={i}>
                <div className=''>
                <HorProductWidget element={e} key={i} />
                </div>
              </div>
            ))}
          </div>
          <PaginationComponent pagination={elements.pagination} />
        </MainContentLayout>
      )}
    </>
  );
};

export default ProductIndex;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ locale, query }) => {
      const { country, page }: any = query;
      if (!country) {
        return {
          notFound: true,
        };
      }
      const {
        data: elements,
        isError,
      }: { data: AppQueryResult<Product[]>; isError: boolean } =
        await store.dispatch(
          productApi.endpoints.getProductIndex.initiate({
            lang: locale,
            country,
            query: `?page=${page}`,
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
          elements,
        },
      };
    }
);
