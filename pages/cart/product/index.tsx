import MainHead from '@/components/MainHead';
import { NextPage } from 'next';
import MainContentLayout from '@/layouts/MainContentLayout';
import { Product, ProductAddon } from '@/types/index';
import {
  useGetCartProductsQuery,
  useRemoveFromCartMutation,
  useUpdateItemInCartMutation,
} from '@/redux/api/cartApi';
import { AppQueryResult } from '@/types/queries';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { isAuthenticated } from '@/redux/slices/authSlice';
import {
  appLinks,
  splitPrice,
  submitBtnClass,
  suppressText,
} from '@/constants/*';
import { useTranslation } from 'react-i18next';
import GreyLine from '@/components/GreyLine';
import ClearIcon from '@mui/icons-material/Clear';
import {
  setCurrentModule,
  showToastMessage,
} from '@/redux/slices/appSettingSlice';
import Link from 'next/link';
import EmptyCart from '@/appImages/empty_cart.png';
import Image from 'next/image';
import { EventHandler, useEffect } from 'react';
import { kebabCase, map } from 'lodash';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useGetAllAddressesQuery } from '@/redux/api/addressApi';
import { setUserAddress } from '@/redux/slices/addressSlice';
import { setBackPath } from '@/redux/slices/guestSlice';
const Counter = dynamic(() => import(`@/components/Counter`), {
  ssr: false,
});

const CartProductIndexPage: NextPage = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isAuth = useAppSelector(isAuthenticated);
  const {
    locale: { lang },
    country: { id },
    auth: { user, access_token: token },
    cart: { tempId },
    guest: { guestMode },
  } = useAppSelector((state) => state);

  const {
    data: cartElements,
    isSuccess: cartSuccess,
    isLoading: CartLoading,
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

  // console.log(cartElements)

  useEffect(() => {
    dispatch(setCurrentModule(t('cart')));
    dispatch(setBackPath(appLinks.cartProductIndex.path));
  }, []);

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

  // remove item from cart
  const [
    RemoveFromCart,
    { data: result, isLoading: RemoveItemLoading, error: RemoveItemError },
  ] = useRemoveFromCartMutation();

  const RemoveFromCartReq = async (itemId: number | string) => {
    await RemoveFromCart({
      country: id.toString(),
      lang: lang,
      body: {
        ...(isAuth && { user_id: user.id }),
        tempId: tempId ? tempId : null,
        cart_item_id: itemId,
      },
    }).then((r: any) => {
      if (r.data) {
        CartRefetch();
        dispatch(
          showToastMessage({
            content: `${t(r.data.message)}`,
            type: 'success',
          })
        );
      } else {
        // dispatch(
        //   showToastMessage({
        //     content: `${t(r.data.message)}`,
        //     type: 'success',
        //   })
        // );
      }
    });
  };

  // update item quantity
  const [
    UpdateCart,
    {
      data: Updateresult,
      isLoading: UpdateItemLoading,
      error: UpdateItemError,
    },
  ] = useUpdateItemInCartMutation();

  const IncDecItem = async (itemId: string, qty: string) => {

    await UpdateCart({
      country: id.toString(),
      lang: lang,
      body: {
        ...(isAuth && { user_id: user.id }),
        tempId: tempId ? tempId : null,
        cart_item_id: itemId,
        quantity: qty,
      },
    }).then((r: any) => {
      console.log({ r });
      if (r.data) {
        CartRefetch();
        dispatch(
          showToastMessage({
            content: `${t(r.data.message)}`,
            type: 'success',
          })
        );
      } else if (r.error) {
        dispatch(
          showToastMessage({
            content: `${t(r.error?.data?.message)}`,
            type: 'error',
          })
        );
      }
    });
  };

  // get all addresses in case of user
  const { data: AllAddresses, isSuccess: allAdressSuccess } =
    useGetAllAddressesQuery<{
      data: AppQueryResult<any>;
      isSuccess: boolean;
      isLoading: boolean;
    }>(
      {
        lang: lang,
        country: id,
        token: token,
      },
      {
        skip: !isAuth,
        refetchOnMountOrArgChange: true,
      }
    );

  const handelContinue = () => {
    if (isAuth || guestMode) {
      if (isAuth && AllAddresses?.data.length === 1) {
        dispatch(setUserAddress(AllAddresses?.data[0]));
        router.push(appLinks.cartProductReview.path);
      } else router.push(appLinks.cartProductDetails.path);
    } else {
      router.push(appLinks.login.path);
    }
  };

  if (CartLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <MainHead title={`Cart`} description={`cart_index_description`} />
      <MainContentLayout>
        {cartSuccess &&
          (cartElements.data === null ? (
            <div className="w-full">
              <div className={`flex flex-col items-center justify-center`}>
                <Image
                  src={EmptyCart}
                  alt="empty"
                  width={100}
                  height={500}
                  className="w-auto h-52"
                />
                <p className="my-5" suppressHydrationWarning={suppressText}>
                  {t(`cart_is_empty`)}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col justify-between w-full">
              <div className="my-5">
                {map(cartElements.data.items, (item: Product, i) => {
                  return (
                    <div
                      onClick={() => {
                        router.push(
                          `/country/${id}${appLinks.productShow.path}${
                            item.item_id
                          }?id=${item.item_id}&slug=${kebabCase(
                            item.item_name
                          )}`
                        );
                      }}
                      key={i}
                      className="rounded-lg cursor-pointer py-2 px-3 mb-5"
                      style={{ boxShadow: '0px 1px 5px 1px #DEDEDE' }}
                    >
                      <div className="flex justify-between">
                        <p className="text-primary_BG text-start">
                          {item.item_name}
                        </p>
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            RemoveFromCartReq(item.cart_item_id);
                          }}
                          className="cursor-pointer"
                        >
                          <ClearIcon fontSize="small" />
                        </div>
                      </div>
                      <p className="text-xs text-start mt-px mb-3">
                        {/* {item.item_options.map((option : any) =>
                        Object.entries(option).map(
                          (entry: any) => `+ ${entry.qty} ${entry.name} | `
                        )
                      )} */}
                        {DisplayAddons(item.item_options)}
                      </p>

                      <div className="flex justify-between mt-5">
                        <Counter
                          val={item.item_qty.toString()}
                          inc={() =>
                            IncDecItem(
                              item.cart_item_id.toString(),
                              (
                                parseInt(item.item_qty.toString()) + 1
                              ).toString()
                            )
                          }
                          dec={() =>
                            parseInt(item.item_qty.toString()) > 1
                              ? IncDecItem(
                                  item.cart_item_id.toString(),
                                  (
                                    parseInt(item.item_qty.toString()) - 1
                                  ).toString()
                                )
                              : {}
                          }
                        />
                        <p>{`${
                          splitPrice(item.item_price.toString()).price
                        } ${t(
                          splitPrice(item.item_price.toString()).currency
                        )}`}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div>
                {cartElements.data.sub_total && (
                  <div className="flex justify-between gap-x-2 text-DarkGrey">
                    <p>{`${t('sub_total')}`}</p>
                    <p>{`${
                      splitPrice(cartElements.data.sub_total.toString()).price
                    } ${t(
                      splitPrice(cartElements.data.sub_total.toString())
                        .currency
                    )}`}</p>
                  </div>
                )}
                <div className="flex justify-between gap-x-2 text-DarkGrey">
                  <p>{`${t('delivery_fee')}`}</p>
                  {cartElements.data.delivery_fee ? (
                    <p>{`${
                      splitPrice(cartElements.data.delivery_fee.toString())
                        .price
                    } ${t(
                      splitPrice(cartElements.data.delivery_fee.toString())
                        .currency
                    )}`}</p>
                  ) : (
                    <p>0</p>
                  )}
                </div>

                {cartElements.data.tax && (
                  <div className="flex justify-between gap-x-2 text-DarkGrey">
                    <p suppressHydrationWarning={suppressText}>{t('tax')}</p>
                    <p>{cartElements.data.tax}</p>
                  </div>
                )}

                <GreyLine className="my-1" />

                <div className="flex justify-between gap-x-2 text-DarkGrey py-1">
                  <p suppressHydrationWarning={suppressText}>{t('total')}</p>
                  <p suppressHydrationWarning={suppressText}>
                    {cartElements.data.total.toString().replace('EGP', '')}{' '}
                    {`${t(cartElements.data.currency)}`}
                  </p>
                </div>

                <div className="py-5">
                  {/* <Link
                    scroll={true}
                    prefetch={guestMode || isAuth}
                    href={
                      guestMode || isAuth
                        ? `${appLinks.cartProductDetails.path}`
                        : `${appLinks.login.path}`
                    }
                  >
                    
                  </Link> */}

                  <div className="flex justify-center py-1 text-sm text-red-800">
                    <p suppressHydrationWarning={suppressText}>
                      {parseFloat(
                        splitPrice(
                          cartElements.data.sub_total
                            .toString()
                            .replace(',', '')
                        ).price
                      ) <
                      parseFloat(
                        cartElements.data.min_price.replace(',', '')
                      ) ? (
                        <>
                          {t('min_price_cart_msg')}{' '}
                          {cartElements.data.min_price}{' '}
                          {t(cartElements.data.currency)}
                        </>
                      ) : (
                        cartElements.data.free_delivery_value && (
                          <>
                            {t('free_delivery')}{' '}
                            {cartElements.data.free_delivery_value}{' '}
                            {t(cartElements.data.currency)}
                          </>
                        )
                      )}
                    </p>
                  </div>

                  <button
                    disabled={
                      parseFloat(
                        splitPrice(
                          cartElements.data.sub_total
                            .toString()
                            .replace(',', '')
                        ).price
                      ) <
                      parseFloat(cartElements.data.min_price.replace(',', ''))
                    }
                    onClick={() => {
                      handelContinue();
                    }}
                    className={`${submitBtnClass}`}
                  >{`${t('continue_to_checkOut')}`}</button>
                </div>
              </div>
            </div>
          ))}
      </MainContentLayout>
    </>
  );
};

export default CartProductIndexPage;
