import { apiSlice } from './index';
import { AppQueryResult, Area, Country } from '@/types/queries';
import { Cart, Locale } from '@/types/index';
import { isEmpty } from 'lodash';

export const cartApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    setClass: builder.mutation<
      AppQueryResult<{
        class: Cart['classes'];
        payment_methods: Cart['paymentMethods'];
      }>,
      {
        lang: Locale['lang'] | undefined | string;
        country: string;
        params: { class_id: string; date: string };
      }
    >({
      query: ({ lang, country, params }) => ({
        url: `class/proceed-to-booking`,
        headers: {
          'Accept-Language': lang,
          country,
        },
        params,
        validateStatus: (response, result) =>
          response.status === 200 && result.success,
      }),
    }),
    setEvent: builder.mutation<
      AppQueryResult<{
        event: Cart['event'];
        payment_methods: Cart['paymentMethods'];
      }>,
      {
        lang: Locale['lang'] | undefined | string;
        country: string;
        params: { event_id: string; date: string };
      }
    >({
      query: ({ lang, country, params }) => ({
        url: `event/proceed-to-booking`,
        headers: {
          'Accept-Language': lang,
          country,
        },
        params,
        validateStatus: (response, result) =>
          response.status === 200 && result.success,
      }),
    }),
    setVenue: builder.mutation<
      AppQueryResult<{
        tax: string;
        sub_total: string;
        total: string;
        payment_methods: Cart['paymentMethods'];
      }>,
      {
        lang: Locale['lang'] | undefined | string;
        country: string;
        params: { venue_id: string; time: string; date: string };
      }
    >({
      query: ({ lang, country, params }) => ({
        url: `venue/proceed-to-booking`,
        headers: {
          'Accept-Language': lang,
          country,
        },
        params,
        validateStatus: (response, result) =>
          response.status === 200 && result.success,
      }),
    }),
    setSubscription: builder.mutation<
      AppQueryResult<{
        subscription: Cart['subscription'];
        payment_methods: Cart['paymentMethods'];
      }>,
      {
        lang: Locale['lang'] | undefined | string;
        country: string;
        params: { subscription_id: string | undefined; date: string };
      }
    >({
      query: ({ lang, country, params }) => ({
        url: `subscription/proceed-to-booking`,
        headers: {
          'Accept-Language': lang,
          country,
        },
        params,
        validateStatus: (response, result) =>
          response.status === 200 && result.success,
      }),
    }),
    GetCartProducts: builder.query<
      AppQueryResult<any>,
      {
        lang: Locale['lang'];
        country: string;
        params: any;
      }
    >({
      query: ({ country, params, lang }) => ({
        url: `cart`,
        params: { ...params },
        headers: {
          'Accept-Language': lang,
          country,
        },
        refetchOnMountOrArgChange: true,
        validateStatus: (response, result) =>
          response.status === 200 && result.success,
      }),
      providesTags: (result, error, arg) =>
        result && result.data && result.data !== null
          ? [
              ...result.data.items?.map(({ item_id }: { item_id: number }) => ({
                type: 'CartProducts' as const,
                item_id,
              })),
              'CartProducts',
            ]
          : ['CartProducts'],
    }),
    AddProductToCart: builder.mutation<
      AppQueryResult<any>,
      {
        lang: Locale['lang'];
        country: string;
        body: any;
      }
    >({
      query: ({ country, body, lang }) => ({
        url: `cart/store`,
        method: `POST`,
        body,
        headers: {
          'Accept-Language': lang,
          country,
        },
        validateStatus: (response, result) =>
          response.status === 200 && result.success,
      }),
      invalidatesTags: ['CartProducts'],
    }),
    RemoveFromCart: builder.mutation<
      AppQueryResult<any>,
      {
        lang: Locale['lang'];
        country: string;
        body: any;
      }
    >({
      query: ({ country, body, lang }) => ({
        url: `cart/clear/item`,
        method: `POST`,
        body,
        headers: {
          'Accept-Language': lang,
          country,
        },
        validateStatus: (response, result) =>
          response.status === 200 && result.success,
      }),
      invalidatesTags: ['CartProducts'],
    }),
    UpdateItemInCart: builder.mutation<
      AppQueryResult<any>,
      {
        lang: Locale['lang'];
        country: string;
        body: any;
      }
    >({
      query: ({ country, body, lang }) => ({
        url: `cart/update`,
        method: `POST`,
        body,
        headers: {
          'Accept-Language': lang,
          country,
        },
        validateStatus: (response, result) =>
          response.status === 200 && result.success,
      }),
      invalidatesTags: ['CartProducts'],
    }),
  }),
});

export const {
  useSetClassMutation,
  useSetEventMutation,
  useSetVenueMutation,
  useSetSubscriptionMutation,
  useAddProductToCartMutation,
  useGetCartProductsQuery,
  useLazyGetCartProductsQuery,
  useRemoveFromCartMutation,
  useUpdateItemInCartMutation,
} = cartApi;
