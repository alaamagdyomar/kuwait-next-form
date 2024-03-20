import MainHead from '@/components/MainHead';
import { NextPage } from 'next';
import { wrapper } from '@/redux/store';
import MainContentLayout from '@/layouts/MainContentLayout';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { isAuthenticated } from '@/redux/slices/authSlice';
import { useEffect, useState } from 'react';
import {
  setCurrentModule,
  showToastMessage,
} from '@/redux/slices/appSettingSlice';
import { isGuestMode } from '@/redux/slices/guestSlice';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useGetAllAreasQuery } from '@/redux/api/countryApi';
import { AppQueryResult, Area } from '@/types/queries';
import { UserAddress, UserAddressFields } from '@/types/index';
import {
  useCreateAddressMutation,
  useDeleteAddressMutation,
  useGetAddressFieldsQuery,
  useGetAllAddressesQuery,
  useUpdateAddressMutation,
} from '@/redux/api/addressApi';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { appLinks, submitBtnClass } from '@/constants/*';
import { useRouter } from 'next/router';
import { setGuestAddress, setUserAddress } from '@/redux/slices/addressSlice';
import { isEmpty, map } from 'lodash';
import LoadingSpinner from '@/components/LoadingSpinner';

const CartProductAddressDetailsPage: NextPage = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isAuth = useAppSelector(isAuthenticated);

  const {
    searchParams: {
      searchArea: { id: areaId, name: areaName },
    },
    locale: { lang },
    country: { id },
    auth: { user, access_token: token },
    guest: { guestMode: isGuest },
    address: { userAddress, GuestAddress },
  } = useAppSelector((state) => state);

  const [process, setProcess] = useState<string>(
    isAuth ? 'displayAll' : isGuest ? 'create' : ''
  );

  // address info
  const [AddressInfo, SetAddressInfo] = useState({
    type: 'house',
    area_id: areaId ?? '',
    area_name: areaName ?? '',
    address: {},
    longitude: '',
    latitude: '',
  });

  // if user is not authenticated
  useEffect(() => {
    if (!isAuth && !isGuest) {
      router.push(appLinks.login.path);
    }
  }, [isAuth, isGuest]);

  // get areas
  const { data: areas, isSuccess: areaSuccess } = useGetAllAreasQuery<{
    data: AppQueryResult<Area[]>;
    isSuccess: boolean;
  }>({
    locale: lang,
    country: id,
    params: { type: 'store' },
  });

  // get address fields
  const {
    data: addressFields,
    isSuccess: addressFieldsSuccess,
    // refetch: addressFieldsRefetch,
  } = useGetAddressFieldsQuery<{
    data: AppQueryResult<any>;
    isSuccess: boolean;
  }>(
    {
      lang: lang,
      country: id,
    },
    { refetchOnMountOrArgChange: true }
  );

  // get all addresses in case of user
  const {
    data: AllAddresses,
    isSuccess: allAdressSuccess,
    isLoading: allAddressLoading,
    refetch: AllAdressesRefetch,
  } = useGetAllAddressesQuery<{
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

  // set area when it is selected
  const HandelSelectAreaName = (areaId: string | number) => {
    // console.log(
    //   'a id',
    //   areaId,
    //   areas.data.filter((i) => i.id.toString() === areaId.toString())[0].name
    // );
    SetAddressInfo((prev) => ({
      ...prev,
      area_name: areas.data.filter((i) => i.id.toString() === areaId.toString())[0].name,
    }));
  };

  // handel delete address
  const [
    DeleteAddress,
    { data: DeleteResult, isLoading: DeleteLoading, error: DeleteError },
  ] = useDeleteAddressMutation();
  const HandelDeleteAddress = async (addressId: string) => {
    await DeleteAddress({
      lang: lang,
      country: id,
      token: token,
      id: addressId,
    }).then((r: any) => {
      if (r.data) {
        AllAdressesRefetch();
        dispatch(
          showToastMessage({
            content: `${t(r.data.message)}`,
            type: 'success',
          })
        );
      }
    });
  };

  // validate data before continue
  const HandelValidateSelection = () => {
    let valid = true;

    if (!AddressInfo.area_id) {
      return { valid: false, msg: t('area_is_required') };
    }

    if (Object.keys(AddressInfo.address).length === 0) {
      return { valid: false, msg: t('select_at_least_one_address_field') };
    }

    return { valid: true, msg: '' };
  };

  // handel create
  const [
    CreateAddress,
    { data: Createresult, isLoading: CreateLoading, error: CreateError },
  ] = useCreateAddressMutation();

  const HandelCreateAddress = async () => {
    const { valid, msg } = HandelValidateSelection();

    if (valid) {
      if (isGuest) {
        dispatch(setGuestAddress(AddressInfo));
        router.push(appLinks.cartProductReview.path);
      }
      if (isAuth) {
        await CreateAddress({
          lang: lang,
          country: id,
          token: token,
          body: AddressInfo,
        }).then((r: any) => {
          if (r.data) {
            AllAdressesRefetch();
            dispatch(
              showToastMessage({
                content: 'address_created',
                type: 'success',
              })
            );
            setProcess('displayAll');
          }
        });
      }
    } else {
      dispatch(
        showToastMessage({
          content: `${t(msg)}`,
          type: 'info',
        })
      );
    }
  };

  // on click update
  const OnClickUpdate = (address: UserAddress) => {
    setProcess('update');
    let modified_add = {};

    address.address.map((item: UserAddressFields) => {
      modified_add[item.id] = { [item.key]: item.value };
    });

    SetAddressInfo((prev) => ({
      ...prev,
      ...address,
      address: modified_add,
    }));
  };

  // update address
  const [
    updateAddress,
    { data: Upadeteresult, isLoading: UpadeteLoading, error: UpadeteError },
  ] = useUpdateAddressMutation();

  const HandelUpdateAddress = async () => {
    const { valid, msg } = HandelValidateSelection();

    if (valid) {
      // if (isGuest) {
      //   dispatch(setGuestAddress(address))
      // }
      if (isAuth) {
        await updateAddress({
          lang: lang,
          country: id,
          token: token,
          id: AddressInfo.id,
          body: AddressInfo,
        }).then((r: any) => {
          if (r.data) {
            AllAdressesRefetch();
            dispatch(
              showToastMessage({
                content: `${t(r.data.message)}`,
                type: 'success',
              })
            );
            setProcess('displayAll');
          }
        });
      }
    } else {
    }
  };

  useEffect(() => {
    dispatch(setCurrentModule(t('address_details')));
  }, []);

  if (allAddressLoading && process === 'displayAll') {
    return <LoadingSpinner />;
  }

  return (
    <>
      <MainHead
        title={`CartProductAddressDetails`}
        description={`CartProductAddressDetails`}
      />
      <MainContentLayout>
        <div className="flex justify-center my-5">
          <p>{`${t('select_an_adress_or_create_a_new_one')}`}</p>
        </div>
        <div>
          {areaSuccess &&
            addressFieldsSuccess &&
            (process === 'create' || process === 'update') && (
              <div>
                <Tabs
                  centered={true}
                  value={AddressInfo.type}
                  onChange={(event, newValue) => {
                    SetAddressInfo((prev) => ({
                      ...prev,
                      type: newValue,
                    }));
                  }}
                >
                  <Tab label={t('house')} value={'house'} />
                  <Tab label={t('appratement')} value={'appartement'} />
                  <Tab label={t('office')} value={'office'} />
                </Tabs>

                {/* inputs */}
                <div className="w-full mt-3">
                  <div className="text-sm">
                    {/* area */}
                    <select
                      onChange={(e) => {
                        SetAddressInfo((prev) => ({
                          ...prev,
                          area_id: e.target.value,
                        }));
                        HandelSelectAreaName(e.target.value);
                      }}
                      value={AddressInfo.area_id ?? ''}
                      className="w-full py-1  rounded-lg outline-none bg-gray  mb-4"
                    >
                      <option hidden value="">
                        {t('select_area')}
                      </option>
                      {areas.data.map((a: Area) => (
                        <option
                          key={a.id}
                          selected={areaId === a.id}
                          value={a.id}
                        >
                          {a.name}
                        </option>
                      ))}
                    </select>

                    {addressFields.data.map((field: any) => {
                      return (
                        <input
                          key={field.id}
                          className="bg-gray rounded-lg outline-none px-2 py-1 w-full mb-4"
                          name={field.key}
                          type={field.type}
                          {...(field.type === 'number' ? { min: 1 } : {})}
                          {...(process === 'update'
                            ? AddressInfo.address[field.id] && {
                                value: AddressInfo.address[field.id][field.key],
                              }
                            : {})}
                          placeholder={
                            field.selection === 'required'
                              ? `${field.key} *`
                              : field.key
                          }
                          onChange={(e) => {
                            SetAddressInfo((prev) => ({
                              ...prev,
                              address: {
                                ...prev.address,
                                [field.id]: { [field.key]: e.target.value },
                              },
                            }));
                          }}
                        />
                      );
                    })}

                    <button
                      onClick={() => {
                        process === 'update'
                          ? HandelUpdateAddress()
                          : HandelCreateAddress();
                      }}
                      className={`${submitBtnClass} text-sm`}
                    >
                      {process === 'update' ? t('update') : t('continue')}
                    </button>
                  </div>
                </div>
              </div>
            )}
        </div>

        {/* all adresses */}
        {process === 'displayAll' && allAdressSuccess && (
          <div>
            {AllAddresses.data.length === 0 ? (
              <div className="flex justify-center my-8">
                {t('no_adresses_found')}
              </div>
            ) : (
              <div className="flex flex-col  gap-y-5">
                {AllAddresses.data.map((address: UserAddress, i: number) => {
                  return (
                    <div
                      key={address.id}
                      className="rounded-xl shadow-HomeCard flex items-center py-4 px-3 text-sm cursor-pointer"
                    >
                      <div className="flex justify-between w-full">
                        <div
                          onClick={() => {
                            dispatch(setUserAddress(address));
                            router.push(appLinks.cartProductReview.path);
                          }}
                        >
                          <div className="flex gap-x-2 font-semibold">
                            <p className="">
                              {t('address')} {i + 1}
                            </p>
                            {address.default === true && (
                              <p className="text-primary_BG">
                                ({t('default')})
                              </p>
                            )}
                          </div>
                          <p>
                            <span className="text-primary_BG">
                              {t('area')} :
                            </span>{' '}
                            {address.area}
                          </p>
                          <p>
                            <span className="text-primary_BG">
                              {`${t('address_details')}`} :
                            </span>{' '}
                            {map(address.address, (item: UserAddressFields) => {
                              return (
                                <span key={item.id}>
                                  {item.key} : {item.value} ,{' '}
                                </span>
                              );
                            })}
                          </p>
                        </div>
                        <div className="flex gap-x-2">
                          <div
                            className="cursor-pointer"
                            onClick={() => {
                              OnClickUpdate(address);
                            }}
                          >
                            <EditOutlinedIcon sx={{ color: '#189EC9' }} />
                          </div>

                          <div
                            className="cursor-pointer"
                            onClick={() =>
                              HandelDeleteAddress(address.id.toString())
                            }
                          >
                            <DeleteOutlineIcon sx={{ color: '#dc2626' }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <button
              // disabled={AllAddresses.data.length == 3}
              className={`${submitBtnClass} py-1 text-sm mt-4`}
              onClick={() => setProcess('create')}
            >
              {`${t('create_address')}`}
            </button>
          </div>
        )}
      </MainContentLayout>
    </>
  );
};

export default CartProductAddressDetailsPage;
