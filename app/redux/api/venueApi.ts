import { Locale } from '../../types';
import { apiSlice } from './index';
import { AppQueryResult, PaymentProcess, Venue } from '@/types/queries';

export const venueApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getVenues: builder.query<
      AppQueryResult<Venue[]>,
      {
        lang: Locale['lang'];
        country: string;
        date: string;
        category: string | number;
        query?: string | any;
      }
    >({
      query: ({ lang, country, date, category, query = `` }) => ({
        url: `get-venues?${query}`,
        method: 'POST',
        params: {
          date,
          sport: category,
        },
        headers: {
          'Accept-Language': lang,
          country,
        },
      }),
    }),
    getVenue: builder.query<
      Venue,
      {
        lang: Locale['lang'];
        country: string;
        id: string | number;
        date: string;
      }
    >({
      query: ({ lang, country, id, date }) => ({
        url: `venue-details/${id}`,
        params: { date },
        headers: {
          'Accept-Language': lang,
          country,
        },
      }),
    }),
    proceedToVenuePayment: builder.mutation<
      PaymentProcess,
      {
        lang: Locale['lang'];
        country: string;
        params: {
          guest_name: string;
          guest_phone: string;
          guest_gender: string;
          user_id: string;
          venue_id: string;
          time: string;
          date: string;
          payment_method: string;
          total: string;
          channel?: `web`;
        };
      }
    >({
      query: ({ lang, country, params }) => ({
        url: `venue/proceed-to-payment`,
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
  useGetVenuesQuery,
  useGetVenueQuery,
  useProceedToVenuePaymentMutation,
} = venueApi;
