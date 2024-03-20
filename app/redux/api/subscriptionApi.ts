import { apiSlice } from './index';
import {
  AppQueryResult,
  Subscription,
  Club,
  PaymentProcess,
} from '@/types/queries';
import { Locale, Order } from '@/types/index';

export const subscriptionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSubscriptions: builder.query<
      AppQueryResult<Club[]>,
      {
        lang: Locale['lang'];
        country: string;
        date: string;
        category: string | number;
        query?: string | any;
      }
    >({
      query: ({ lang, country, date, category, query = `` }) => ({
        url: `subscription?${query}`,
        method: 'POST',
        params: {
          date,
          category,
        },
        headers: {
          'Accept-Language': lang,
          country,
        },
      }),
    }),
    getSubscriptionPlan: builder.query<
      Subscription,
      {
        lang: Locale['lang'];
        country: string;
        id: string | number;
      }
    >({
      query: ({ lang, country, id }) => ({
        url: `subscription/details`,
        params: { subscription_id: id.toString() },
        headers: {
          'Accept-Language': lang,
          country,
        },
      }),
    }),
    getSubscription: builder.query<
      Club,
      {
        lang: Locale['lang'];
        country: string;
        id: string | number;
        categoryId: string | number;
        query: string | any;
      }
    >({
      query: ({ lang, country, id, categoryId, query }) => ({
        url: `subscription/vendor-details?${query}`,
        params: {
          category: categoryId,
          vendor_id: id.toString(),
        },
        headers: {
          'Accept-Language': lang,
          country,
        },
      }),
    }),
    getAllSubscriptionTypes: builder.query<any, string | object | any | void>({
      query: (params) => ({ url: `category/subscription`, params }),
    }),
    proceedToSubscriptionPayment: builder.mutation<
      PaymentProcess,
      {
        lang: Locale['lang'];
        country: string;
        params: {
          guest_name: string;
          guest_phone: string;
          guest_gender: string;
          user_id: string;
          start_date: string;
          subscription_id: string;
          payment_method: string;
          channel?: `web`;
        };
      }
    >({
      query: ({ lang, country, params }) => ({
        url: `subscription/proceed-to-payment`,
        method: 'POST',
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
  useGetSubscriptionsQuery,
  useGetSubscriptionQuery,
  useGetSubscriptionPlanQuery,
  useProceedToSubscriptionPaymentMutation,
} = subscriptionApi;
