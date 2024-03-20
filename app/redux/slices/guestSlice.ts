import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Guest } from '@/types/queries';
import { RootState } from '@/redux/store';
import { HYDRATE } from 'next-redux-wrapper';
import { isEmpty } from 'lodash';

const initialState: Guest = {
  name: ``,
  // gender: ``,
  phone: ``,
  guestMode: false,
  backPath: null,
};

export const guestSlice = createSlice({
  name: 'guest',
  initialState,
  reducers: {
    enableGuestMode: (
      state: typeof initialState,
      action: PayloadAction<Guest>
    ) => {
      return {
        ...action.payload,
        backPath: state.backPath,
        guestMode: true,
      };
    },
    disableGuestMode: (
      state: typeof initialState,
      action: PayloadAction<void>
    ) => {
      return {
        ...initialState,
        backPath: state.backPath,
      };
    },
    setBackPath: (
      state: typeof initialState,
      action: PayloadAction<string>
    ) => {
      return {
        ...state,
        backPath: action.payload,
      };
    },
    resetBackPath: (
      state: typeof initialState,
      action: PayloadAction<void>
    ) => {
      return {
        ...state,
        backPath: null,
      };
    },
  },
});
export const isGuestMode = (state: RootState) =>
  state.guest.guestMode && isEmpty(state.auth.access_token);
export const { enableGuestMode, disableGuestMode, setBackPath, resetBackPath } =
  guestSlice.actions;
