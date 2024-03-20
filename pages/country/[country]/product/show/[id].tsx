import { NextPage } from 'next';
import { wrapper } from '@/redux/store';
import { productApi } from '@/redux/api/productApi';
import { Product, ProductAddon } from '@/types/index';
import { AppQueryResult } from '@/types/queries';
import GeneralCarousel from '@/components/GeneralCarousel';
import GreyLine from '@/components/GreyLine';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useEffect, useState, Suspense } from 'react';
import {
  setCurrentModule,
  showToastMessage,
} from '@/redux/slices/appSettingSlice';
import MainHead from '@/components/MainHead';
import MainContentLayout from '@/layouts/MainContentLayout';
import { apiSlice } from '@/redux/api';
import {
  appLinks,
  inputFieldClass,
  splitPrice,
  suppressText,
} from '@/constants/*';
import { setCurrentElement } from '@/redux/slices/currentElementSlice';
import dynamic from 'next/dynamic';
import {
  useAddProductToCartMutation,
  useGetCartProductsQuery,
  useLazyGetCartProductsQuery,
} from '@/redux/api/cartApi';
import { isAuthenticated } from '@/redux/slices/authSlice';
import { setTempId } from '@/redux/slices/cartSlice';
import { useRouter } from 'next/router';
import { debounce } from 'lodash';
const ChangeVendorModal = dynamic(
  () => import(`@/components/ChangeVendorModal`),
  {
    ssr: false,
  }
);
const Counter = dynamic(() => import(`@/components/Counter`), {
  ssr: false,
});

type Props = {
  element: Product;
};

type SelectedAddons = {
  id: string;
  options: option[];
  price?: string;
};
type option = {
  id: string;
  quantity: string | number;
  price: string;
};

const ProductShow: NextPage<Props> = ({ element }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { price, currency } = splitPrice(element.price.toString());
  const [Msg, SetMsg] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(parseFloat(price));
  const [selectedAddons, setSelectedAddons] = useState<SelectedAddons[]>([]);
  const [openVendorModal, setOpenVendorModal] = useState(false);
  const [requiredOrOptional, setRequiredOrOptional] = useState(() => {
    let arr: any = [];
    element.addons?.map((i) => {
      arr.push({ addonID: i.id.toString(), selection: i.selection });
    });
    return arr;
  });
  const isAuth = useAppSelector(isAuthenticated);
  const {
    locale: { lang },
    country: { id },
    auth: { user },
    cart: { tempId },
  } = useAppSelector((state) => state);
  const [triggerGetCartProducts] = useLazyGetCartProductsQuery();
  // when add item from diffrent vendor

  useEffect(() => {
    dispatch(setCurrentModule(element.name));
    dispatch(setCurrentElement({ element, type: `product` }));
  }, []);

  // when addon is selceted or changed
  const handelSelectAddon = (
    addonID: string,
    type: string,
    optionID: string,
    price: string
  ) => {
    if (selectedAddons.length === 0) {
      setSelectedAddons([
        { id: addonID, options: [{ id: optionID, quantity: 1, price: price }] },
      ]);
      handelUpdateTotal(price);
    } else {
      if (type === 'radio') {
        updateRadionSelectAddons(addonID, optionID, price);
      } else if (type === 'checkbox') {
        updateCheckBoxAddon(addonID, optionID, price);
      } else if (type === 'dropdown') {
        let opID = optionID.split('-')[0];
        let prc = optionID.split('-')[1];
        updateRadionSelectAddons(addonID, opID, prc);
      }
    }
  };

  const updateRadionSelectAddons = (
    addonID: string,
    optionID: string,
    price: string
  ) => {
    let addonExist = checkIfAddonExist(addonID);
    if (addonExist.Exist) {
      let items = [...selectedAddons];
      items[addonExist.index] = {
        id: addonID,
        options: [{ id: optionID, price: price, quantity: 1 }],
      };
      // update total
      handelUpdateTotal(price, items[addonExist.index].options[0].price);
      // update addon
      setSelectedAddons(items);
    } else {
      // update total
      handelUpdateTotal(price);
      // update addons
      setSelectedAddons((prev) => [
        ...prev,
        {
          id: addonID,
          options: [{ id: optionID, price: price, quantity: 1 }],
        },
      ]);
    }
  };

  const updateCheckBoxAddon = (
    addonID: string,
    optionID: string,
    price: string
  ) => {
    let addonExist = checkIfAddonExist(addonID);

    if (addonExist.Exist) {
      let optionExist = false;
      let Options = [];

      // check if option exist
      for (
        let j = 0;
        j < selectedAddons[addonExist.index].options.length;
        j++
      ) {
        if (selectedAddons[addonExist.index].options[j].id === optionID) {
          optionExist = true;
          handelUpdateTotal(
            '0',
            selectedAddons[addonExist.index].options[j].price
          );
        }
      }

      // if option exsist and remove it if not add it
      if (optionExist) {
        Options = selectedAddons[addonExist.index].options.filter((option) => {
          if (option.id !== optionID) {
            return option;
          }
        });
      } else {
        Options = [
          ...selectedAddons[addonExist.index].options,
          { id: optionID, quantity: 1, price: price },
        ];
        handelUpdateTotal(price);
      }

      // modify state
      if (Options.length === 0) {
        let items = [...selectedAddons];
        items.splice(addonExist.index, 1);
        setSelectedAddons(items);
      } else {
        let items = [...selectedAddons];
        items[addonExist.index] = {
          id: addonID,
          price: price,
          options: Options,
        };
        setSelectedAddons(items);
      }
    } else {
      setSelectedAddons((prev) => [
        ...prev,
        {
          id: addonID,
          options: [{ id: optionID, quantity: 1, price: price }],
        },
      ]);

      handelUpdateTotal(price);
    }
  };

  // check if addon is already selected
  const checkIfAddonExist = (addonID: string) => {
    let addonExist = false;
    let indx = -1;
    for (let i = 0; i < selectedAddons.length; i++) {
      if (selectedAddons[i].id.toString() === addonID.toString()) {
        addonExist = true;
        indx = i;
      }
    }

    return { Exist: addonExist, index: indx };
  };

  // update total
  const handelUpdateTotal = (newPrice: string, prevPrice = '0') => {
    setTotalPrice(
      (prev) => prev + parseFloat(newPrice) - parseFloat(prevPrice)
    );
  };

  // quantity change
  const handelIncDecQuantity = (plus: boolean) => {
    if (plus === true) {
      setQuantity((prev) => prev + 1);
    }

    if (plus === false) {
      if (quantity > 1) {
        setQuantity((prev) => prev - 1);
      }
    }
  };

  // handel add to cart
  const handelAddToCart = (changeVendor = false) => {
    let requiredSelected = handleCheckRequiredOptional();

    if (requiredSelected === true) {
      addToCartReq(changeVendor);
    }
    // else if (requiredSelected === false) {
    //   dispatch(
    //     ToggleShowHideAction({
    //       Open: true,
    //       Type: 'info',
    //       Msg: t('Please select all required addons'),
    //     })
    //   );
    // }
  };

  // check mendatory or optional
  const handleCheckRequiredOptional = () => {
    let requiredSelected = true;

    for (let i = 0; i < requiredOrOptional.length; i++) {
      if (requiredOrOptional[i].selection === 'mandatory') {
        let checkExist = checkIfAddonExist(requiredOrOptional[i].addonID);
        if (checkExist.Exist === false) {
          requiredSelected = false;
        }
      }
    }

    return requiredSelected;
  };

  // add to cart req
  const [AddToCart, { data: result, isLoading, error: loginError }] =
    useAddProductToCartMutation();

  const addToCartReq = async (ChangeVendor: boolean) => {
    await AddToCart({
      lang: lang,
      body: {
        ...(isAuth && {
          user_id: user.id,
        }),
        tempId: tempId ? tempId : null,
        // if vendor is diffrnt send it with true
        change: ChangeVendor,
        vendor_id: element.vendor_id,
        item_id: element.id,
        note: Msg,
        quantity,
        addons: selectedAddons,
      },
      country: id.toString(),
    }).then((r: any) => {
      console.log('the r', r);

      if (r.data) {
        if (tempId === '') {
          dispatch(setTempId(r.data.data.tempId));
        }
        if (r.data.success) {
          dispatch(
            showToastMessage({
              content: `${t(r.data.message)}`,
              type: 'success',
            })
          );
          if (window.history.state && window.history.length > 2) {
            router.back();
          } else {
            router.push(appLinks.home.path);
          }
        }
        if (r.error) {
          if (r.error.data?.status === '502') {
            // vendor is diffrent
            setOpenVendorModal(true);
          } else {
            dispatch(
              showToastMessage({
                content: `${t(r.error.data.message)}`,
                type: 'error',
              })
            );
          }
        }
      } else if (r.error && r.error?.data && r.error.data.message) {
        if (r.error.data?.status === '502') {
          // vendor is diffrent
          setOpenVendorModal(true);
        } else
          dispatch(
            showToastMessage({
              content: `${t(r.error.data.message)}`,
              type: 'error',
            })
          );
      }
    });
  };
  return (
    <>
      <MainHead
        title={`${element.name}`}
        description={`${element.description} - ${element.categories}`}
        mainImage={element?.images?.[0]}
      />
      <MainContentLayout>
        <Suspense>
          {element.images && element.images.length > 0 && (
            <div className="py-5">
              <GeneralCarousel
                slides={element.images}
                w={`w-full`}
                h="16rem"
                cover={false}
              />
            </div>
          )}

          {/* name and price */}
          <div className="flex justify-between my-3 text-sm">
            <div>
              <p className="text-start text-primary_BG">{element.name}</p>
              <p className="text-start text-ellipsis overflow-hidden text-DarkGrey">
                {element.categories}
              </p>
            </div>

            <div>
              <p
                className="text-primary_BG"
                suppressHydrationWarning={suppressText}
              >
                {price} {t(currency)}
              </p>
            </div>
          </div>
          <GreyLine />

          {/* addons */}
          <div>
            {element.addons?.map((item: ProductAddon, i) => {
              return (
                <div key={i} className="text-start text-sm mb-7">
                  <div className="flex mb-2">
                    <p className="text-primary_BG">{item.name}</p>
                    {item.selection === 'mandatory' && (
                      <p
                        className="text-xs text-red-600 px-2"
                        suppressHydrationWarning={suppressText}
                      >
                        ({t('required')})
                      </p>
                    )}
                    {item.selection === 'optional' && (
                      <p
                        className="text-xs  px-2"
                        suppressHydrationWarning={suppressText}
                      >
                        ({t('optional')})
                      </p>
                    )}
                  </div>

                  {(item.type === 'radio' || item.type === 'checkbox') && (
                    <div className="px-2">
                      {item.options?.map((i) => {
                        return (
                          <div
                            className="flex items-center justify-between mb-1"
                            key={i.id}
                          >
                            <div className="flex items-center">
                              <input
                                disabled={i.stock === 0 ? true : undefined}
                                onChange={() => {
                                  handelSelectAddon(
                                    item.id.toString(),
                                    item.type,
                                    i.id,
                                    i.price
                                  );
                                }}
                                id={i.name + i.id}
                                type={item.type}
                                name={item.id.toString()}
                              ></input>
                              <label
                                className={
                                  i.stock === 0 ? 'opacity-50 px-1' : 'px-1'
                                }
                              >
                                {i.name}
                              </label>
                            </div>
                            <p
                              className={
                                i.stock === 0
                                  ? 'opacity-50 text-primary_BG'
                                  : 'text-primary_BG'
                              }
                            >
                              {i.price}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {item.type === 'dropdown' && (
                    <div className="px-2">
                      <select
                        onChange={(e) => {
                          handelSelectAddon(
                            item.id.toString(),
                            item.type,
                            e.target.value,
                            '0'
                          );
                        }}
                        className="outline-none border-b w-full border-slate-600"
                      >
                        <option
                          defaultValue={`select_please`}
                          value="0"
                          disabled
                          hidden
                          suppressHydrationWarning={suppressText}
                        >
                          {t('select_please')}
                        </option>
                        {item.options?.map((i) => {
                          return (
                            <option
                              disabled={i.stock === 0 ? true : undefined}
                              key={i.id}
                              value={`${i.id}-${i.price}`}
                            >
                              {i.name}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* notes */}
          <div className="w-full text-start">
            <p
              className="text-sm text-primary_BG my-2"
              suppressHydrationWarning={suppressText}
            >
              {t('extra_notes')}
            </p>
            <textarea
              onChange={(e) => SetMsg(e.target.value)}
              className={`${inputFieldClass} w-full`}
            />
          </div>

          {/* quantity meter */}
          <div className="flex justify-between items-center gap-x-2 py-3">
            <p
              className="text-sm text-primary_BG"
              suppressHydrationWarning={suppressText}
            >
              {t('quantity')}
            </p>
            <Counter
              val={quantity.toString()}
              inc={() => handelIncDecQuantity(true)}
              dec={() => handelIncDecQuantity(false)}
            />
          </div>

          {/* add to cart btn */}
          <button
            onClick={debounce(() => handelAddToCart(), 1000)}
            className="flex w-full capitalize justify-between items-center text-white bg-primary_BG rounded-lg cursor-pointer py-2 px-3  mt-8"
          >
            <p suppressHydrationWarning={suppressText}>{t('add_to_cart')}</p>
            <p>
              {totalPrice.toFixed(3)} {t(currency)}
            </p>
          </button>
          {/* change vendor modal */}
          <ChangeVendorModal
            OpenModal={openVendorModal}
            OnClose={() => setOpenVendorModal(false)}
            ChangeVendor={() => handelAddToCart(true)}
          />
        </Suspense>
      </MainContentLayout>
    </>
  );
};

export default ProductShow;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ locale, query }) => {
      const { country, id: item_id }: any = query;
      if (!item_id || !country) {
        return {
          notFound: true,
        };
      }
      const {
        data: element,
        isError,
      }: { data: AppQueryResult<Product>; isError: boolean } =
        await store.dispatch(
          productApi.endpoints.getProductShow.initiate({
            lang: locale,
            country,
            item_id,
          })
        );
      await Promise.all(store.dispatch(apiSlice.util.getRunningQueriesThunk()));
      if (isError || !element.data) {
        return {
          notFound: true,
        };
      }
      return {
        props: {
          element: element.data,
        },
      };
    }
);
