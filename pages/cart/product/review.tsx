import MainHead from '@/components/MainHead';
import { NextPage } from 'next';
import { wrapper } from '@/redux/store';
import MainContentLayout from '@/layouts/MainContentLayout';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { isAuthenticated } from '@/redux/slices/authSlice';
import { useTranslation } from 'react-i18next';
import { isGuestMode } from '@/redux/slices/guestSlice';
import { useGetCartProductsQuery } from '@/redux/api/cartApi';
import { AppQueryResult } from '@/types/queries';
import LoadingSpinner from '@/components/LoadingSpinner';
import {
  appLinks,
  splitPrice,
  submitBtnClass,
  suppressText,
} from '@/constants/*';
import GreyLine from '@/components/GreyLine';
import {
  PaymentMethod,
  Product,
  ProductAddon,
  UserAddressFields,
} from '@/types/index';
import { useGetAddressQuery } from '@/redux/api/addressApi';
import { map } from 'lodash';
import { useRouter } from 'next/router';
import {
  useGetPaymentMethodsQuery,
  useProceedToStorePaymentMutation,
} from '@/redux/api/storeApi';
import PaymentSummary from '@/components/widgets/cart/review/PaymentSummary';
import { useEffect, useMemo, useState } from 'react';
import PaymentMethods from '@/components/widgets/cart/review/PaymentMethods';
import { orderMade, resetOrderIdInvoice } from '@/redux/slices/orderSlice';
import { setCurrentMode } from '@/redux/slices/cartSlice';
import { setCurrentModule } from '@/redux/slices/appSettingSlice';

const CartProductReviewPage: NextPage = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isAuth = useAppSelector(isAuthenticated);
  // const isGuest = useAppSelector(isGuestMode);
  const {
    locale: { lang },
    country: { id },
    auth: { user, access_token: token },
    guest: {
      name: guest_name,
      phone: guest_phone,
      gender: guest_gender,
      guestMode: isGuest,
    },
    cart: { tempId },
    address: { userAddress, GuestAddress },
  } = useAppSelector((state) => state);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(
    null
  );
  const [triggerStoreOrder, { isLoading: StoreOrderLoading }] =
    useProceedToStorePaymentMutation();

  const {
    data: cartElements,
    isSuccess: cartSuccess,
    isLoading: cartLoading,
    refetch: CartRefetch,
  } = useGetCartProductsQuery<{
    data: AppQueryResult<any>;
    isSuccess: boolean;
    isLoading: boolean;
  }>(
    {
      country: id.toString(),
      lang: lang,
      params: {
        ...(isAuth && { user_id: user.id }),
        tempId: tempId ? tempId : null,
      },
    },
    { refetchOnMountOrArgChange: true }
  );

  // display addons of itemms
  const DisplayAddons = (addonarray: ProductAddon[]) => {
    let addons = '';
    for (let i = 0; i < addonarray.length; i++) {
      if (i === addonarray.length - 1) {
        addons = addons.concat(
          '+',
          addonarray[i].qty.toString(),
          ' ',
          addonarray[i].name
        );
      } else {
        addons = addons.concat(
          '+',
          addonarray[i].qty.toString(),
          ' ',
          addonarray[i].name,
          ' | '
        );
      }
    }
    return addons;
  };

  // get address in case of user
  // const {
  //   data: userAddress,
  //   isSuccess: AddressSuccess,
  //   isLoading: AddressLoading,
  //   refetch: AddressRefetch,
  // } = useGetAddressQuery<{
  //   data: AppQueryResult<any>;
  //   isSuccess: boolean;
  //   isLoading: boolean;
  // }>(
  //   {
  //     country: id.toString(),
  //     lang: lang,
  //     token: token,
  //     params: { address_id: addressId },
  //   },
  //   { skip: !isAuth }
  // );

  // get payment methods
  const {
    data: paymentMethodsRes,
    isSuccess: methodsSuccess,
    isLoading: methodsLoading,
  } = useGetPaymentMethodsQuery<{
    data: AppQueryResult<PaymentMethod[]>;
    isSuccess: boolean;
    isLoading: boolean;
  }>({
    country: id.toString(),
    lang: lang,
  });

  // useMemo(() => {
  //   if (methodsSuccess) {
  //     setPaymentMethod(paymentMethodsRes.data[0]);
  //   }
  // }, [methodsSuccess]);

  const handleContinue = async () => {
    dispatch(resetOrderIdInvoice());

    if (isGuest) {
      var address = {};
      Object.values(GuestAddress.address).forEach((obj) => {
        address[Object.keys(obj)[0]] = Object.values(obj)[0];
      });
    }
    if (!isGuest && !isAuth) {
      router.push(appLinks.login.path);
    } else if (
      (!userAddress.id && !GuestAddress.area_id) ||
      (!userAddress.id && isAuth) ||
      (!GuestAddress.area_id && isGuest)
    ) {
      router.push(appLinks.cartProductDetails.path);
    } else {
      dispatch(setCurrentMode('product'));
      await triggerStoreOrder({
        lang,
        country: id,
        body: {
          ...(isAuth && { user_id: user.id }),
          guest_name,
          guest_phone,
          guest_gender,
          tempId,
          ...(isAuth && { address_id: userAddress.id }),
          ...(isGuest && {
            address_type: GuestAddress.type,
            address: address,
            area_id: GuestAddress.area_id,
            latitude: GuestAddress.latitude,
            longitude: GuestAddress.longitude,
          }),
          payment_method: paymentMethod?.name.toString(),
          total: cartElements.data.total,
          channel: 'web',
        },
      }).then((r: any) => {
        dispatch(orderMade(r));
        console.log('placeorder res', r);
      });
    }
  };

  useEffect(() => {
    dispatch(setCurrentModule(t('review_booking_info')));
  }, []);

  console.log(
    'hello',
    cartElements,
    PaymentMethods,
    'GuestAddress',
    GuestAddress,
    'userAddress',
    userAddress
  );

  if (cartLoading || methodsLoading || StoreOrderLoading || StoreOrderLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <MainHead
        title={`review_booking_info`}
        description={`review_booking_info_description`}
      />
      <MainContentLayout>
        <div>
          {cartSuccess && methodsSuccess && (
            <div>
              {cartElements.data === null ? (
                <div className="w-full">
                  <div className={`flex justify-center py-5`}>
                    <p className="my-5">{t(`cart_is_empty`)}</p>
                  </div>
                </div>
              ) : (
                <div className="rounded-lg bg-primary_BG px-3 py-2 text-white mb-5">
                  {cartElements.data.items?.map(
                    (product: Product, idx: number) => {
                      return (
                        <div key={product.item_id}>
                          <div className="flex justify-between">
                            <div className="">
                              <p className="text-start px-px">
                                {product.item_name}
                              </p>
                              <p className="text-xs text-start mt-px">
                                {DisplayAddons(product.item_options)}
                              </p>
                            </div>
                            <div>
                              <p>
                                {
                                  splitPrice(product.item_price.toString())
                                    .price
                                }{' '}
                                {t(
                                  splitPrice(product.item_price.toString())
                                    .currency
                                )}
                              </p>
                            </div>
                          </div>
                          {idx + 1 !== cartElements.data.items.length && (
                            <GreyLine className="my-3" />
                          )}
                        </div>
                      );
                    }
                  )}
                </div>
              )}

              {/* delivery address */}
              {(isGuest || isAuth) && (
                <div>
                  <p className="text-primary_BG w-fit mb-1">
                    {t('delivery_details')}
                  </p>
                  <div className="rounded-lg bg-LightGray2 mb-5 text-sm px-5 py-3">
                    <div className="mb--2 rounded-md">
                      <div className="flex justify-between mb-1">
                        <p className="text-primary_BG">{t('address')}</p>
                        <button
                          onClick={() =>
                            router.push(appLinks.cartProductDetails.path)
                          }
                          className="text-xs bg-slate-200 rounded-full px-2 py-px"
                        >
                          {t('change')}
                        </button>
                      </div>
                    </div>
                    <div className="text-start">
                      {isGuest && (
                        <div className='flex flex-col gap-y-1'>
                          <p>
                            {t('area')}: {GuestAddress.area_name}
                          </p>
                          {Object.values(GuestAddress.address)
                            .map((value: any) =>
                             <p>{`${Object.keys(value)} : ${Object.values(value)}`}</p>
                            )}
                        </div>
                        // <p>
                        //   {t('area')}: {GuestAddress.area},
                        //   {Object.values(GuestAddress.address)
                        //     .map((value: any) =>
                        //       Object.entries(value).join(' : ')
                        //     )
                        //     .join(', ')}
                        // </p>
                      )}

                      {isAuth && (
                        <div className='flex flex-col gap-y-1'>
                          <p>{t('area')}: {userAddress.area}</p>
                          {userAddress.address.map((field: any) => (
                            <p>{`${field.key} : ${field.value}`}</p>
                          ))}
                        </div>
                        // <p>
                        //   {t('area')}: {userAddress.area},
                        //   {userAddress.address.map((field: any) => (
                        //     <>{`${field.key} : ${field.value} | `}</>
                        //   ))}
                        // </p>
                      )}
                    </div>
                    {/* <button
                      // onClick={() => SetShowMap(true)}
                      className="rounded-full py-1 px-2 mt-7 w-full bg-primary_BG text-white"
                    >
                      {t('view_on_map')}
                    </button> */}
                  </div>
                </div>
              )}

              {/* select payment method */}
              <PaymentMethods
                elements={paymentMethodsRes.data}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
              />

              {cartElements.data !== null && (
                <>
                  {/* payment summary */}
                  <PaymentSummary element={cartElements.data} split={true} />
                </>
              )}

              <button
                onClick={() => handleContinue()}
                className={`${submitBtnClass} mt-8`}
                disabled={
                  // StoreOrderLoading ||
                  cartElements.data === null
                }
              >
                {t('continue')}
              </button>
            </div>
          )}
        </div>
      </MainContentLayout>
    </>
  );
};

export default CartProductReviewPage;
