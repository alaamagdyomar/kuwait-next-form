import { apiSlice } from './index';
import { AppQueryResult, Class, PaymentProcess } from '@/types/queries';
import { Locale, Order } from '@/types/index';

export const classApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getClasses: builder.query<
      AppQueryResult<Class[]>,
      {
        lang: Locale['lang'];
        country: string;
        date: string;
        category: string | number;
        query?: string | any;
      }
    >({
      query: ({ date, country, category, query = ``, lang }) => ({
        url: `classes?${query}`,
        method: 'POST',
        params: {
          date,
          type: category,
        },
        headers: {
          'Accept-Language': lang,
          country,
        },
      }),
    }),
    getClass: builder.query<
      AppQueryResult<Class>,
      {
        lang: Locale['lang'];
        country: string;
        id: string | number;
        date: string;
      }
    >({
      query: ({ lang, country, id, date }) => ({
        url: `class/details`,
        params: { date, class_id: id },
        headers: {
          'Accept-Language': lang,
          country,
        },
      }),
    }),
    proceedToClassPayment: builder.mutation<
      PaymentProcess,
      {
        lang: Locale['lang'];
        country: string;
        params: {
          guest_name: string;
          guest_phone: string;
          guest_gender: string;
          user_id: string;
          class_id: string;
          date: string;
          payment_method: string;
          channel: `web`;
        };
      }
    >({
      query: ({ lang, country, params }) => ({
        url: `class/proceed-to-payment`,
        method: 'POST',
        params,
        headers: {
          'Accept-Language': lang,
          country,
        },
      }),
    }),
    getOrderStatus: builder.query<
      AppQueryResult<Order>,
      {
        lang: Locale['lang'];
        country: string;
        invoice_id: number | string;
      }
    >({
      query: ({ lang, country, invoice_id }) => ({
        url: `appointment/payment/status`,
        params: { invoice_id },
        headers: {
          'Accept-Language': lang,
          country,
        },
      }),
    }),
  }),
});

export const {
  useGetClassesQuery,
  useGetClassQuery,
  useProceedToClassPaymentMutation,
  useGetOrderStatusQuery,
} = classApi;
