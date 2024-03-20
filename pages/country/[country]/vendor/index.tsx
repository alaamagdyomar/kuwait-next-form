import MainHead from '@/components/MainHead';
import { NextPage } from 'next';
import { wrapper } from '@/redux/store';
import { AppQueryResult } from '@/types/queries';
import { Product, Vendor } from '@/types/index';
import { debounce, map } from 'lodash';
import VendorWidget from '@/widgets/vendor/VendorWidget';
import PaginationComponent from '@/components/PaginationComponent';
import { vendorApi } from '@/redux/api/vendorApi';
import MainContentLayout from '@/layouts/MainContentLayout';
import React, { useEffect, useState } from 'react';
import { setCurrentModule } from '@/redux/slices/appSettingSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useTranslation } from 'react-i18next';
import { storeApi, useLazyGetStoreSearchQuery } from '@/redux/api/storeApi';
import { useRouter } from 'next/router';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { suppressText } from '@/constants/*';
import { ArrowPathIcon } from '@heroicons/react/24/solid';
import HorProductWidget from '@/widgets/product/HorProductWidget';

type Props = {
  elements: AppQueryResult<Vendor[]>;
};
const VendorIndex: NextPage<Props> = ({ elements }): JSX.Element => {
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
  const router = useRouter();

  useEffect(() => {
    dispatch(setCurrentModule(t('vendor_index')));
  }, []);

  const handleChange = (key: string) => {
    if (key.length > 3) {
      trigger({ lang, key, country }).then((r: any) =>
        setCurrentProducts(r.data.data.vendor)
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
      <MainHead title={`vendor_index`} description={`vendor_index_description`} />
      <MainContentLayout>
        <div
          className={`flex flex-1 w-auto flex-grow pb-8 border-b border-stone-100`}
        >
          <div className={`w-full flex flex-row justify-between items-center`}>
            <div className="relative flex-1 mt-1 ltr:mr-4 rtl:ml-4 rounded-md shadow-sm text-gray-400">
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
                placeholder={`${t(`search_vendors`)}`}
              />
            </div>
          </div>
        </div>
        <div
          className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 mb-6 gap-4 items-center justify-center`}
        >
          {map(currentProducts, (e: Vendor, i) => (
            <div className={`col-span-1`} key={i}>
              <VendorWidget element={e} key={i} />
            </div>
          ))}
        </div>
        <PaginationComponent pagination={elements.pagination} />
      </MainContentLayout>
    </>
  );
};

export default VendorIndex;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ locale, query }) => {
      const { country, page }: any = query;
      const {
        data: elements,
        isError,
      }: { data: AppQueryResult<Vendor[]>; isError: boolean } =
        await store.dispatch(
          vendorApi.endpoints.getVendors.initiate({
            lang: locale,
            country,
            query: `?page=${page}`,
          })
        );
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
