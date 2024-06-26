import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserAddress } from '@/types/index';
import { HYDRATE } from 'next-redux-wrapper';
import { guestSlice } from './guestSlice';
import { authSlice } from './authSlice';

const initialState: any = {
  userAddress: {
    id: '',
    customer_id: '',
    area: '',
    area_id: ``,
    type: ``,
    longitude: ``,
    latitude: ``,
    address: [],
  },
  GuestAddress: {
    area: '',
    area_id: ``,
    type: ``,
    longitude: ``,
    latitude: ``,
    address: [],
  },
};

export const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    setGuestAddress: (
      state: typeof initialState,
      action: PayloadAction<any>
    ) => {
      return {
        ...state,
        GuestAddress: action.payload,
      };
    },

    setUserAddress: (
      state: typeof initialState,
      action: PayloadAction<UserAddress>
    ) => {
      return {
        ...state,
        userAddress: action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      authSlice.actions.logout,
      (state, action) => {
        state.GuestAddress = initialState.GuestAddress;
      }
    )
  },
});
export const { setGuestAddress, setUserAddress } = addressSlice.actions;
