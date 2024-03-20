import { Country } from '@/types/queries';
// export const baseUrl = `https://mybusiness.letsform.app/`;
export const baseUrl = `https://form.testbedbynd.com/`;
export const apiUrl = `${baseUrl}api/`;
export const appLinks = {
  root: { path: '/home' },
  home: { path: '/home' },
  stores: { path: '/stores' },
  category: (
    categoryName: string,
    categoryId: string | number,
    country: string | number,
    subCategoryId?: string | number
  ) =>
    `/country/${country}/category/${categoryName}/${categoryId.toString()}${subCategoryId ? `?subcategory_id=${subCategoryId.toString()}` : ``
    }`,
  subCategoryList: (
    categoryName: string,
    categoryId: string | number,
    country: string
  ) =>
    `/country/${country}/category/${categoryName}/${categoryId}/select/${categoryId}`,
  store: { path: '/stores' },
  vendorIndex: { path: '/vendor' },
  vendorShow: { path: '/vendor/show/' },
  productIndex: { path: '/product' },
  productShow: { path: '/product/show/' },
  venueIndex: (
    dateSelected: string,
    subCategoryId: string | number,
    country: string,
    areaId?: string | number,
    gender?: string
  ) =>
    `/country/${country}/venue/${dateSelected}/${subCategoryId.toString()}/${gender ? gender : `gender[0]=male`
    }&area=${areaId?.toString() ?? ``}`,
  venueShow: { path: '/venue/show/' },
  classIndex: (
    dateSelected: string,
    subCategoryId: string | number,
    country: string,
    areaId?: string | number,
    gender?: string
  ) =>
    `/country/${country}/class/${dateSelected}/${subCategoryId.toString()}/${gender ? gender : `gender[0]=male`
    }&area=${areaId?.toString() ?? ``}`,
  classShow: { path: '/class/show/' },
  eventIndex: (
    dateSelected: string,
    subCategoryId: string | number,
    country: string,
    areaId?: string | number,
    gender?: string
  ) =>
    `/country/${country}/event/${dateSelected}/${subCategoryId.toString()}/${gender ? gender : `gender[0]=male`
    }&area=${areaId?.toString() ?? ``}`,
  eventShow: { path: '/event/show/' },
  subscriptionIndex: (
    dateSelected: string,
    subCategoryId: string | number,
    country: string,
    areaId?: string | number,
    gender?: string
  ) =>
    `/country/${country}/subscription/${dateSelected}/${subCategoryId.toString()}/${gender ?? `gender[0]=male`
    }&area_id=${areaId?.toString() ?? ``}`,
  subscriptionShow: (
    country: string,
    id: string,
    subCategoryId: string | number,
    query: string
  ) =>
    `/country/${country}/subscription/show/club/${id}/${subCategoryId.toString()}/${query}`,
  subscriptionPlan: (country: string, id: string) =>
    `/country/${country}/subscription/show/plan/${id}`,
  subscriptions: { path: '/subscriptions' },
  login: { path: '/login' },
  register: { path: '/register' },
  verificationOTP: { path: '/login/verification/otp' },
  verificationMobileNo: { path: '/login/verification/mobile' },
  guest: { path: '/guest' },
  account: { path: '/account' },
  forgetPassword: { path: '/forgetpassword' },
  order: { path: '/order/history' },
  orderDetails: { path: '/order/details' },
  cartIndex: { path: '/cart' },
  cartReview: { path: '/cart/review' },
  cartProductIndex: { path: '/cart/product' },
  cartProductDetails: { path: '/cart/product/details' },
  cartProductReview: { path: '/cart/product/review' },
  orderRedirect: { path: `/appointment/redirect` },
  orderSuccess: { path: `/appointment/payment/success` },
  orderFailure: { path: `/appointment/payment/failure` },
  terms: { path: '/terms' },
  about: { path: '/about' },
};

export const isClient = typeof window !== undefined;
export const isLocal = process.env.NODE_ENV !== 'production'; // false
// export const isLocal = true;
export const inputFieldClass = `rounded-md px-3 py-2.5 mb-2 text-sm bg-gray-100 outline-none w-full border-none capitalize`;
export const submitBtnClass = `w-full bg-gradient-to-tl from-primary_BG via-primary_BG to-primaryLight rounded-md text-sm text-white py-4 my-2 cursor-pointer shadow-lg capitalize disabled:from-gray-200 disabled:to-gray-400 drop-shadow-md`;
export const subCategoryBtnClass = `flex w-full flex-row items-center justify-between border border-gray-200 rounded-lg p-4 shadow-md capitalize
                  rtl:bg-gradient-to-r ltr:bg-gradient-to-l from-gray-100 via-gray-200 to-gray-300 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-gray-300 drop-shadow-md
                  `;
export const grayBtnClass = `rounded-lg bg-SearchGrey text-xs px-[6px] border border-SearchGrey shadow-sm py-1 capitalize drop-shadow-md`;
export const tajwalFont = `font-tajwal-medium`;
export const futureFont = `font-future-bold`;
export const langOptions = [
  {
    image: 'en.png',
    value: 'en',
    label: 'English',
  },
  {
    image: 'ar.png',
    value: 'ar',
    label: 'العربية',
  },
];

export const suppressText = true;
export const splitPrice = (
  price: string
): { price: string; currency: string } => {
  const element = price.split(' ');
  return { price: element[0], currency: element[1] };
};

export const apiLogin = async ({ access_token }: { access_token: string }) =>
  await fetch(`/api/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ access_token }),
  });

export const apiVerified = async ({ verified }: { verified: boolean }) =>
  await fetch(`/api/verified`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ verified }),
  });

export const apiLogout = async () =>
  await fetch(`/api/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  });

export const setApiCountry = (country: any) =>
  fetch(`/api/set/country`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ country }),
  });

export const getApiCountry = async () =>
  await fetch(`/api/get/country`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
export const imageSizes = {
  xs: 100,
  sm: 150,
  md: 250,
  lg: 500,
  xl: 650,
};
export const withCountryQueryString = (country: Country) =>
  `?country_id=${country.id}&country_name=${country.name}&country_name_ar=${country.name_ar}&country_currency=${country.currency}`;

export const logoImageBase64 = `data:image/png;base64,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`;
