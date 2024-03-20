import { combineReducers } from '@reduxjs/toolkit';
import { localeSlice } from './localeSlice';
import { productApi } from './../api/productApi';
import { appLoadingSlice } from './appLoadingSlice';
import { apiSlice } from '../api';
import { countrySlice } from '@/redux/slices/countrySlice';
import { appSettingSlice } from '@/redux/slices/appSettingSlice';
import { authSlice } from '@/redux/slices/authSlice';
import { storeApi } from '@/redux/api/storeApi';
import { categoryApi } from '@/redux/api/categoryApi';
import { subscriptionApi } from '@/redux/api/subscriptionApi';
import { classApi } from '@/redux/api/classApi';
import { countryApi } from '@/redux/api/countryApi';
import { authApi } from '@/redux/api/authApi';
import { cartSlice } from '@/redux/slices/cartSlice';
import { searchParamsSlice } from '@/redux/slices/searchParamsSlice';
import { venueApi } from '@/redux/api/venueApi';
import { vendorApi } from '@/redux/api/vendorApi';
import { guestSlice } from './guestSlice';
import { currentElementSlice } from '@/redux/slices/currentElementSlice';
import { orderSlice } from '@/redux/slices/orderSlice';
import { addressSlice } from './addressSlice';

export const rootReducer = combineReducers({
  [appLoadingSlice.name]: appLoadingSlice.reducer,
  [localeSlice.name]: localeSlice.reducer,
  [countrySlice.name]: countrySlice.reducer,
  [appSettingSlice.name]: appSettingSlice.reducer,
  [authSlice.name]: authSlice.reducer,
  [guestSlice.name]: guestSlice.reducer,
  [appLoadingSlice.name]: appLoadingSlice.reducer,
  [cartSlice.name]: cartSlice.reducer,
  [orderSlice.name]: orderSlice.reducer,
  [searchParamsSlice.name]: searchParamsSlice.reducer,
  [addressSlice.name]: addressSlice.reducer,
  [currentElementSlice.name]: currentElementSlice.reducer,
  [apiSlice.reducerPath]: productApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
  [categoryApi.reducerPath]: categoryApi.reducer,
  [classApi.reducerPath]: classApi.reducer,
  [countryApi.reducerPath]: countryApi.reducer,
  [productApi.reducerPath]: productApi.reducer,
  [storeApi.reducerPath]: storeApi.reducer,
  [subscriptionApi.reducerPath]: subscriptionApi.reducer,
  [vendorApi.reducerPath]: vendorApi.reducer,
  [venueApi.reducerPath]: venueApi.reducer,
});
