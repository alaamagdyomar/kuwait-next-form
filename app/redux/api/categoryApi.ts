import { apiSlice } from './index';
import { AppQueryResult, CategoriesType, Category } from '@/types/queries';
import { Locale } from '@/types/index';

export const categoryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMainCategories: builder.query<
      AppQueryResult<CategoriesType[]>,
      {
        lang: Locale['lang'];
        country: string;
      }
    >({
      query: ({ lang, country = '1' }) => ({
        url: `types`,
        headers: {
          'Accept-Language': lang,
          country,
        },
        validateStatus: (response, result) =>
          response.status === 200 && result.success,
      }),
    }),
    getSportSubCategories: builder.query<
      AppQueryResult<Category[]>,
      {
        lang: Locale['lang'] | string | undefined;
        country: string;
      }
    >({
      query: ({ lang, country }) => ({
        url: `sports`,
        headers: {
          'Accept-Language': lang,
          country,
        },
        validateStatus: (response, result) =>
          response.status === 200 && result.success,
      }),
    }),
    getSubscriptionSubCategories: builder.query<
      AppQueryResult<Category[]>,
      {
        lang: Locale['lang'] | string | undefined;
        country: string;
      }
    >({
      query: ({ lang, country }) => ({
        url: `category/subscription`,
        headers: {
          'Accept-Language': lang,
          country,
        },
        validateStatus: (response, result) =>
          response.status === 200 && result.success,
      }),
    }),
    getClassSubCategories: builder.query<
      AppQueryResult<Category[]>,
      {
        lang: Locale['lang'] | string | undefined;
        country: string;
      }
    >({
      query: ({ lang, country }) => ({
        url: `category/class`,
        headers: {
          'Accept-Language': lang,
          country,
        },
        validateStatus: (response, result) =>
          response.status === 200 && result.success,
      }),
    }),
    getEventSubCategories: builder.query<
      AppQueryResult<Category[]>,
      {
        lang: Locale['lang'] | string | undefined;
        country: string;
        type: string;
      }
    >({
      query: ({ lang, country, type }) => ({
        url: `categories`,
        headers: {
          'Accept-Language': lang,
          country,
        },
        params: { type },
        validateStatus: (response, result) =>
          response.status === 200 && result.success,
      }),
    }),
  }),
});

export const {
  useGetMainCategoriesQuery,
  useGetSportSubCategoriesQuery,
  useGetClassSubCategoriesQuery,
  useGetSubscriptionSubCategoriesQuery,
  useGetEventSubCategoriesQuery,
} = categoryApi;
