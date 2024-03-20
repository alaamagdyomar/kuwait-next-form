import { apiSlice } from './index';
import { AppQueryResult, Event, PaymentProcess } from '@/types/queries';
import { Locale } from '@/types/index';

export const eventApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEvents: builder.query<
      AppQueryResult<Event[]>,
      {
        lang: Locale['lang'];
        country: string;
        date: string;
        category: string | number;
        query?: string | any;
      }
    >({
      query: ({ date, country, category, query = ``, lang }) => ({
        url: `events?${query}`,
        method: 'GET',
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
    getEvent: builder.query<
      AppQueryResult<Event>,
      {
        lang: Locale['lang'];
        country: string;
        id: string | number;
        date: string;
      }
    >({
      query: ({ lang, country, id, date }) => ({
        url: `event/details`,
        params: { date, event_id: id },
        headers: {
          'Accept-Language': lang,
          country,
        },
      }),
    }),
    proceedToEventPayment: builder.mutation<
      PaymentProcess,
      {
        lang: Locale['lang'];
        country: string;
        params: {
          guest_name: string;
          guest_phone: string;
          guest_gender: string;
          user_id: string;
          event_id: string;
          date: string;
          payment_method: string;
          channel: `web`;
        };
      }
    >({
      query: ({ lang, country, params }) => ({
        url: `event/proceed-to-payment`,
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
  useGetEventsQuery,
  useGetEventQuery,
  useProceedToEventPaymentMutation,
} = eventApi;
