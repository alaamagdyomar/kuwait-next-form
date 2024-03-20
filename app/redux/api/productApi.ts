import { Product, Locale } from '../../types';
import { apiSlice } from './index';
import { AppQueryResult } from '@/types/queries';

// Define a service using a base URL and expected endpoints
export const productApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProductIndex: builder.query<
      AppQueryResult<Product[]>,
      {
        lang: Locale['lang'] | string | undefined;
        country: string;
        query: string;
      }
    >({
      query: ({ lang, country, query = `?page=1` }) => ({
        url: `store/products${query}`,
        headers: {
          'Accept-Language': lang,
          country,
        },
      }),
    }),
    getProductShow: builder.query<
      AppQueryResult<Product>,
      {
        lang: Locale['lang'] | string | undefined;
        country: string;
        item_id: string | unknown;
      }
    >({
      query: ({ lang, country, item_id }) => ({
        url: `store/vendor/item-details`,
        params: { item_id },
        headers: {
          'Accept-Language': lang,
          country,
        },
      }),
      // transformErrorResponse: (
      //   response: { status: string | number },
      //   meta,
      //   arg
      // ) => response.status,
    }),
    
  }),
});

export const { useGetProductIndexQuery, useGetProductShowQuery } = productApi;
