import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { HYDRATE } from 'next-redux-wrapper';
import { apiUrl } from '../../constants';
import { AppQueryResult, StaticPage } from '@/types/queries';
import { RootState } from '@/redux/store';
import { Locale } from '@/types/index';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiUrl}`,
    prepareHeaders: async (
      headers,
      { getState, type, endpoint, extra }: RootState
    ) => {
      const { auth } = getState() as RootState;
      headers.set(
        'Access-Control-Allow-Headers',
        'X-Requested-With,Accept,Authentication,Content-Type'
      );
      headers.set(
        'Access-Control-Allow-Methods',
        'GET,PUT,POST,DELETE,PATCH,OPTIONS'
      );
      if (auth.access_token) {
        headers.set('Authorization', `Bearer ${auth.access_token}`);
      }
      return headers;
    },
    credentials: 'include',
  }),
  tagTypes: ['CartProducts', 'ProductSearchResult', 'OrderHistory'],
  keepUnusedDataFor: 60 * 60,
  refetchOnReconnect: false,
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  endpoints: (builder) => ({
    getStaticPages: builder.query<AppQueryResult<StaticPage[]>, Locale['lang']>(
      {
        query: (lang) => ({
          url: `pages`,
          headers: {
            'Accept-Language': lang,
          },
        }),
      }
    ),
  }),
});

export const { useGetStaticPagesQuery } = apiSlice;
