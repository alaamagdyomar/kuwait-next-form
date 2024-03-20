import { call, put, delay, select, all } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import i18n from 'i18next';
import route from 'next/router';
import { toast, TypeOptions } from 'react-toastify';
import { Auth, Guest } from '@/types/queries';
import { appSettingSlice } from '@/redux/slices/appSettingSlice';
import { guestSlice } from '@/redux/slices/guestSlice';
import { isEmpty, isNull, lowerCase, snakeCase } from 'lodash';
import { orderSlice } from '@/redux/slices/orderSlice';
import { apiLogin, apiLogout, apiVerified, appLinks } from '@/constants/*';
import { searchParamsSlice } from '@/redux/slices/searchParamsSlice';
import { cartSlice } from '@/redux/slices/cartSlice';
import { currentElementSlice } from '@/redux/slices/currentElementSlice';
import { appLoadingSlice } from '@/redux/slices/appLoadingSlice';

export function* startResetAppScenario() {
  // yield all([put({ type: `${searchParamsSlice.actions.resetSearchParams}` })]);
  // persistor.purge();
}

export function* startResetEnireAppSceanrio() {
  yield all([
    put({ type: `${cartSlice.actions.resetCart}` }),
    put({ type: `${guestSlice.actions.disableGuestMode}` }),
    put({ type: `${currentElementSlice.actions.removeCurrentElement}` }),
    put({ type: `${orderSlice.actions.resetOrder}` }),
  ]);
}

export function* startEnableLoadingScenario(action: PayloadAction) {
  try {
  } catch (e) {
  } finally {
  }
}

export function* startChangeLangScenario(action: PayloadAction<string>) {
  try {
    yield put({ type: `${appSettingSlice.actions.hideSideMenu}` });
    yield delay(2000);
    i18n.changeLanguage(action.payload);
  } catch (e: any) {
    yield put({
      type: `${appSettingSlice.actions.showToastMessage}`,
      payload: {
        content: e.message,
        type: 'error',
      },
    });
  } finally {
  }
}

export function* startShowToastMessageScenario(
  action: PayloadAction<{
    content: string;
    type: TypeOptions | undefined;
    title?: string;
  }>
) {
  try {
    const content = i18n.t(snakeCase(lowerCase(action.payload.content)));
    toast(content, { type: action.payload.type });
  } catch (e: any) {
    yield put({
      type: `${appSettingSlice.actions.showToastMessage}`,
      payload: {
        content: e.message,
        type: 'error',
      },
    });
  }
}

export function* startSetLoginScenario(action: PayloadAction<Auth>) {
  try {
    const { access_token, user }: any = action.payload;
    yield all([
      call(apiLogin, { access_token }),
      call(apiVerified, { verified: user.phone_verified === 1 }),
      put({
        type: `${appSettingSlice.actions.showToastMessage}`,
        payload: {
          content: user.phone_verified ? 'login_success' : 'verify_email',
          type: user.phone_verified ? 'success' : 'info',
        },
      }),
      put({ type: `${guestSlice.actions.disableGuestMode}` }),
    ]);
    const {
      guest: { backPath },
    } = yield select();
    if (user.phone_verified !== 1) {
      route.router?.replace(appLinks.verificationMobileNo.path);
      // route.router?.push(appLinks.verificationOTP.path);
    } else if (!isNull(backPath)) {
      route.router?.push(backPath);
    } else {
      route.router?.reload();
      // route.router?.replace('/');
    }
  } catch (e: any) {
    yield put({
      type: `${appSettingSlice.actions.showToastMessage}`,
      payload: {
        content: e.message,
        type: 'error',
      },
    });
  } finally {
  }
}

export function* startEnableGuestModeScenario(action: PayloadAction<Guest>) {
  try {
    yield all([
      put({
        type: `${appSettingSlice.actions.showToastMessage}`,
        payload: {
          content: 'logged_in_as_guest',
          type: 'success',
        },
      }),
    ]);
    yield delay(1000);
    const {
      guest: { backPath },
    } = yield select();
    if (!isNull(backPath)) {
      route.router?.replace(backPath);
    } else {
      route.router?.back();
    }
  } catch (e: any) {
    yield put({
      type: `${appSettingSlice.actions.showToastMessage}`,
      payload: {
        content: e.message,
        type: 'error',
      },
    });
  }
}

export function* startOrderMadeScenario(action: PayloadAction<any>) {
  const { data } = action.payload;
  const {
    cart: { currentMode },
  } = yield select();
  try {
    if (data.success) {
      yield all([
        put({
          type: `${appSettingSlice.actions.showToastMessage}`,
          payload: {
            content: `redirecting_ur_order_please_wait`,
            type: 'warning',
          },
        }),
        put({
          type: `${orderSlice.actions.setOrder}`,
          payload: { orderMode: currentMode },
        }),
      ]);
      // K-net / Visa Case
      if (data.data.url && data.data.invoice_id) {
        yield all([
          put({
            type: `${orderSlice.actions.setInvoiceId}`,
            payload: data.data.invoice_id,
          }),
          put({
            type: `${appLoadingSlice.actions.disableAppLoading}`,
          }),
        ]);
        route.router?.replace({
          pathname: `${appLinks.orderRedirect.path}`,
          query: { url: data.data.url },
        });

        // COD case
      } else if (data.success && data.data.order_id) {
        yield all([
          put({ type: `${appSettingSlice.actions.hideToastMessage}` }),
        ]);
        yield all([
          put({
            type: `${appSettingSlice.actions.showToastMessage}`,
            payload: {
              content: data.message,
              type: 'success',
            },
          }),
          put({
            type: `${orderSlice.actions.setOrder}`,
            payload: data.data,
          }),
        ]);
        route.router?.replace({
          pathname: appLinks.orderSuccess.path,
        });
        // yield all([
        //   delay(2000),
        //   put({
        //     type: `${appLoadingSlice.actions.disableAppLoading}`,
        //   }),
        // ]);
      }
    } else {
      yield all([
        put({
          type: `${appSettingSlice.actions.showToastMessage}`,
          payload: {
            content: data.message,
            type: 'error',
          },
        }),
        put({ type: `${appLoadingSlice.actions.disableAppLoading}` }),
      ]);
    }
  } catch (e: any) {
    yield all([
      put({
        type: `${appSettingSlice.actions.showToastMessage}`,
        payload: {
          content: e.message,
          type: 'error',
        },
      }),
      put({ type: `${appLoadingSlice.actions.disableAppLoading}` }),
    ]);
  }
}

export function* startSetLogOutScenario(action: PayloadAction<void>) {
  try {
    const { guest } = yield select();
    yield call(apiLogout); // Api Next server
    yield put({ type: `${appSettingSlice.actions.hideSideMenu}` });
    yield put({ type: `${guestSlice.actions.disableGuestMode}` });
    yield put({ type: `${cartSlice.actions.removeTempId}` });
    if (!guest.guestMode) {
      yield put({
        type: `${appSettingSlice.actions.showToastMessage}`,
        payload: {
          content: 'logout_success',
          type: 'warning',
        },
      });
    }
    route.router?.replace('/');
    yield delay(2000);
    route.router?.reload();
  } catch (e: any) {
    yield put({
      type: `${appSettingSlice.actions.showToastMessage}`,
      payload: {
        content: e.message,
        type: 'error',
      },
    });
  }
}
