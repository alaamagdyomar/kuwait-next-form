import { apiSlice } from './index';
import {
  AppQueryResult,
  Category,
  PaymentProcess,
  StoreProps,
} from '@/types/queries';
import { Locale, PaymentMethod, Product, Vendor } from '@/types/index';

export const storeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStoreIndex: builder.query<
      AppQueryResult<StoreProps>,
      {
        lang: Locale['lang'] | string | undefined;
        country: string;
        params?: {};
      }
    >({
      query: ({ lang, country, params = {} }) => ({
        url: `store`,
        params,
        headers: {
          'Accept-Language': lang,
          country,
        },
        validateStatus: (response, result) =>
          response.status === 200 && result.success,
      }),
    }),
    getStoreCategories: builder.query<
      AppQueryResult<Category[]>,
      {
        lang: Locale['lang'] | string | undefined;
        country: string;
      }
    >({
      query: ({ lang, country }) => ({
        url: `store/categories`,
        headers: {
          'Accept-Language': lang,
          country,
        },
        validateStatus: (response, result) =>
          response.status === 200 && result.success,
      }),
    }),
    getStoreSearch: builder.query<
      AppQueryResult<Product[] | Vendor[]>,
      {
        lang: Locale['lang'] | string | undefined;
        key: string;
        country: string;
      }
    >({
      query: ({ lang, key, country }) => ({
        url: `store/search`,
        params: { key },
        headers: {
          'Accept-Language': lang,
          country,
        },
        validateStatus: (response, result) =>
          response.status === 200 && result.success,
      }),
      providesTags: ['ProductSearchResult'],
    }),
    getPaymentMethods: builder.query<
      AppQueryResult<PaymentMethod[]>,
      {
        lang: Locale['lang'] | string | undefined;
        country: string;
      }
    >({
      query: ({ lang, country }) => ({
        url: `store/payment-methods`,
        headers: {
          'Accept-Language': lang,
          country,
        },
        validateStatus: (response, result) =>
          response.status === 200 && result.success,
      }),
    }),
    proceedToStorePayment: builder.mutation<
      PaymentProcess,
      {
        lang: Locale['lang'];
        country: string;
        body: {
          guest_name: string;
          guest_phone: string;
          guest_gender: string;
          user_id: string;
          tempId: string;
          address: any;
          address_id: string;
          address_type: string;
          longitude: string;
          latitude: string;
          area_id: string;
          total: string;
          payment_method: string;
          channel?: `web`;
        };
      }
    >({
      query: ({ lang, country, body }) => ({
        url: `store/place-order`,
        method: 'POST',
        body,
        headers: {
          'Accept-Language': lang,
          country,
        },
      }),
    }),
  }),
});

export const {
  useGetStoreCategoriesQuery,
  useGetStoreIndexQuery,
  useGetPaymentMethodsQuery,
  useProceedToStorePaymentMutation,
  useLazyGetStoreSearchQuery,
} = storeApi;
