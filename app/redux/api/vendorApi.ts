import { apiSlice } from './index';
import { AppQueryResult } from '@/types/queries';
import { Locale, Vendor } from '@/types/index';

export const vendorApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getVendors: builder.query<
      AppQueryResult<Vendor[]>,
      {
        lang: Locale['lang'] | string | undefined;
        country: string;
        query?: string;
      }
    >({
      query: ({ lang, country, query = `?page=1` }) => ({
        url: `store/vendors${query}`,
        headers: {
          'Accept-Language': lang,
          country,
        },
      }),
    }),
    getVendor: builder.query<
      AppQueryResult<Vendor>,
      {
        lang: Locale['lang'] | string | undefined;
        country: string;
        id: string | unknown;
      }
    >({
      query: ({ lang, country, id }) => ({
        url: `store/vendor/details`,
        params: { vendor_id: id },
        headers: {
          'Accept-Language': lang,
          country,
        },
      }),
    }),
    getVendorDetails: builder.query<AppQueryResult<any>, string | object | any>(
      {
        // store/vendor/items?vendor_id=7
        query: (params) => ({ url: `store/vendor/details`, params }),
      }
    ),

    getVendorItemCategories: builder.query<
      AppQueryResult<any>,
      {
        lang: Locale['lang'] | string ;
        country: string;
        id: string;
      }
    >({
      query: ({ lang, country, id }) => ({
        url: `store/vendor/categories`,
        params: { vendor_id: id },
        headers: {
          'Accept-Language': lang,
          country,
        },
      }),
    }),

    getVendorCategoriesItems: builder.query<
    AppQueryResult<any>,
    {
      lang: Locale['lang'] | string ;
      country: string;
      id: string;
    }
  >({
    query: ({ lang, country, id }) => ({
      url: `store/vendor/category-items`,
      params: { vendor_id: id },
      headers: {
        'Accept-Language': lang,
        country,
      },
    }),
  }),

    getVendorItems: builder.mutation<
      AppQueryResult<any>,
      {
        lang: Locale['lang'] | string | undefined;
        country: string;
        params: { vendor_id: string | number; category_id?: string };
      }
    >({
      query: ({ lang, country, params }) => ({
        url: `store/vendor/items`,
        params,
        headers: {
          'Accept-Language': lang,
          country,
        },
      }),
    }),


  }),
});

export const {
  useGetVendorsQuery,
  useGetVendorQuery,
  useGetVendorItemsMutation,
  useGetVendorItemCategoriesQuery,
  useGetVendorCategoriesItemsQuery
} = vendorApi;
