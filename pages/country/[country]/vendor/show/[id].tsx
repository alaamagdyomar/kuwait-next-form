import { NextPage } from 'next';
import { wrapper } from '@/redux/store';
import { Product, Vendor } from '@/types/index';
import { AppQueryResult } from '@/types/queries';
import ClockIcon from '@/appIcons/clock.svg';
import TruckIcon from '@/appIcons/truck.svg';
import MinCharge from '@/appIcons/min_cart.svg';
import Image from 'next/image';
import {
  useGetVendorCategoriesItemsQuery,
  useGetVendorItemCategoriesQuery,
  useGetVendorItemsMutation,
  vendorApi,
} from '@/redux/api/vendorApi';
import MainHead from '@/components/MainHead';
import MainContentLayout from '@/layouts/MainContentLayout';
import { useEffect, useState } from 'react';
import { setCurrentModule } from '@/redux/slices/appSettingSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setCurrentElement } from '@/redux/slices/currentElementSlice';
import { imageSizes, suppressText } from '@/constants/*';
import { map } from 'lodash';
import HorProductWidget from '@/widgets/product/HorProductWidget';
import LoadingSpinner from '@/components/LoadingSpinner';
import GreyLine from '@/components/GreyLine';
import { useTranslation } from 'react-i18next';
import Scrollspy from 'react-scrollspy';
import Link from 'next/link';
import VendorCategoryProducts from '@/components/widgets/vendor/VendorCategoryProducts';

type Props = {
  element: Vendor;
};

const VendorShow: NextPage<Props> = ({ element }): JSX.Element => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const {
    country: { id: country },
    locale: { lang },
  } = useAppSelector((state) => state);
  const { data: vendorCategoriesElements, isSuccess: vendorCategoriesSuccess } =
    useGetVendorCategoriesItemsQuery<{
      data: AppQueryResult<any>;
      isSuccess: boolean;
      isLoading: boolean;
    }>({
      country: country.toString(),
      lang: lang,
      id: element.id.toString(),
    });

  const handelCategoryIds = () => {
    let ids = vendorCategoriesElements.data.map((cat: any) =>
      cat.id.toString()
    );
    return ids;
  };

  useEffect(() => {
    dispatch(setCurrentModule(element.name));
    dispatch(setCurrentElement({ element, type: 'vendor' }));
  }, []);

  if(!vendorCategoriesSuccess){
    return <LoadingSpinner/>
  }

  // console.log({ vendorCategoriesElements });

  return (
    <>
      <MainHead title={`vendor_show`} description={`vendor_show_description`} />
      <MainContentLayout>
        <div>
          {element.banner && (
            <div className="h-32 relative rounded-lg border border-gray-100">
              <Image
                className="object-cover"
                fill={true}
                alt={'banner'}
                src={element.banner}
              />
            </div>
          )}

          {/* vendor info */}
          <div className="flex items-center gap-x-2">
            <div className="w-16 h-16 relative">
              <Image
                className="object-cover"
                alt={'logo'}
                src={element.logo}
                width={imageSizes.xl}
                height={imageSizes.xl}
              />
            </div>
            <div className="flex justify-between items-center gap-x-2 w-full">
              <div>
                <p className="text-start truncate text-xs text-primary_BG mb-3">
                  {element.name}
                </p>
                <p className="text-start truncate text-xs text-DarkGrey break-all">
                  {element.description}
                </p>
              </div>

              <div className="text-xs text-DarkBlue space-y-2 mt-3">
                <div className={'flex items-center gap-x-2'}>
                  <Image
                    className={`w-4 h-4`}
                    src={ClockIcon}
                    width={imageSizes.xl}
                    height={imageSizes.xl}
                    alt={'clock'}
                    fill={false}
                  />
                  <p
                    className="whitespace-nowrap"
                    suppressHydrationWarning={suppressText}
                  >
                    {element.delivery_time}
                  </p>
                </div>

                <div className={'flex items-center gap-x-2'}>
                  <Image
                    className={`w-4 h-4`}
                    src={TruckIcon}
                    alt={'clock'}
                    width={imageSizes.xl}
                    height={imageSizes.xl}
                    fill={false}
                  />
                  <p className="whitespace-nowrap">
                    {element.delivery_fee ? element.delivery_fee : 0}
                  </p>
                </div>
                {element.min_price && (
                  <div className={'flex items-center gap-x-2'}>
                    <Image
                      className={`w-4 h-4`}
                      src={MinCharge}
                      alt={'clock'}
                      width={imageSizes.xl}
                      height={imageSizes.xl}
                      fill={false}
                    />
                    <p className="whitespace-nowrap">{element.min_price}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* description */}
          <div className="mt-3">
            <p className="text-xs text-start">{element.description}</p>
          </div>

          <GreyLine className="my-2" />

          {/* categories */}
          {vendorCategoriesSuccess && (
            <>
              <div className="overflow-x-scroll sticky top-0 z-50 bg-white rounded-b-lg mb-5">
                <Scrollspy
                  currentClassName="text-primary_BG font-semibold border-b border-primary_BG"
                  scrolledPastClassName="text-DarkBlue"
                  items={handelCategoryIds()}
                  style={{
                    display: 'flex',
                    justifyItems: 'center',
                    columnGap: '1rem',
                    paddingBlock: '1.5rem',
                  }}
                >
                  {vendorCategoriesElements.data.map((category: any) => {
                    return (
                      <li key={category.id}>
                        <Link
                          href={`#${category.id}`}
                          className="whitespace-nowrap"
                        >
                          {category.name}
                        </Link>
                      </li>
                    );
                  })}
                </Scrollspy>
              </div>
              {vendorCategoriesElements.data.map((element: any) => {
                return <VendorCategoryProducts element={element} />;
              })}
            </>
          )}
        </div>
      </MainContentLayout>
    </>
  );
};

export default VendorShow;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ locale, query }) => {
      const { id, country }: any = await query;
      if (!id) {
        return {
          notFound: true,
        };
      }
      const {
        data: element,
        isError,
      }: { data: AppQueryResult<Vendor>; isError: boolean } =
        await store.dispatch(
          vendorApi.endpoints.getVendor.initiate({ lang: locale, country, id })
        );
      if (isError || !element.data) {
        return {
          notFound: true,
        };
      }
      return {
        props: {
          element: element.data,
        },
      };
    }
);
