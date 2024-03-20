import { Area, Category, Country, Venue } from '@/types/queries';
import { TypeOptions } from 'react-toastify';

export interface Product {
  cart_item_id: string | number;
  item_id: string | number;
  item_qty: string | number;
  item_name: string;
  item_price: string | number;
  item_options: ProductAddon[];
  id: string | number;
  getLocalized?: (name?: string) => string;
  name: string;
  name_ar?: string;
  name_en?: string;
  image: string;
  addons?: ProductAddon[];
  images?: string[];
  description: string;
  description_ar?: string;
  description_en?: string;
  vendor_id: number;
  price: number;
  sale_price?: number;
  categories: string;
}

export interface ProductAddon {
  id: string | number;
  qty: string | number;
  getLocalized?: (name?: string) => string;
  name: string;
  name_ar?: string;
  name_en?: string;
  selection?: string;
  type?: string;
  options?: AddonOption[];
}

export interface AddonOption {
  id: string | number;
  getLocalized?: (name?: string) => string;
  name: string;
  name_ar?: string;
  name_en?: string;
  price?: string | number;
  stock?: string | number;
}

export interface Vendor {
  id: string | number;
  getLocalized?: (name?: string) => string;
  name: string;
  name_ar?: string;
  name_en?: string;
  logo: string;
  banner?: string;
  description?: string;
  description_ar?: string;
  description_en?: string;
  categories?: string;
  delivery_time?: string;
  delivery_fee: string;
  min_price?: string | number;
  categories?: string[];
}

export interface User {
  [key: string]: string;
  id: string | number;
  name: string;
  name_ar: string;
  name_en: string;
  image?: string;
  email: string;
  mobile?: string;
  description_ar?: string;
  description_en?: string;
}

type auth = {
  id: string | null;
  email: string | null;
  accessToken: string | null;
};

export interface Locale {
  lang: 'ar' | 'en';
  isRTL: boolean;
  dir: 'ltr' | 'rtl';
  label: string;
  otherLang: 'ar' | 'en';
}

export interface Categories {
  data: [Category];
  links?: any;
  meta?: any;
}

export type ItemList<T> = {
  data: T[];
  links?: {
    first: string | null;
    last?: string | null;
    prev?: string | null;
    next: string | null;
  };
  meta?: {};
  isLoading?: boolean;
  categories?: Categories[] | [];
};
export type ProductList<T extends Product> = ItemList<T> & {
  selectedElement?: Product;
};

export interface User {
  id: number | string;
  name: string;
}

export type hor = `left` | `right`;
export type ver = `top` | `bottom`;
export type position = {
  position: Exclude<`${hor}-${ver}`, 'left-left'> | 'center';
};

export type appSetting = {
  showHeader: boolean;
  showFooter: boolean;
  showCart: boolean;
  sideMenuOpen: boolean;
  currentModule: string;
  showAreaModal: boolean;
  showPickDateModal: boolean;
  showChangePasswordModal: boolean;
  toastMessage: {
    content: string;
    type: string;
    title?: string;
    showToast: boolean;
  };
};

export interface Cart {
  tempId: string;
  products: Product[] | [];
  isEmpty: boolean;
  currentMode:
    | 'classes'
    | 'product'
    | 'subscription'
    | 'venue'
    | `event`
    | string;
  classes: {
    id: string | number;
    class_name: string;
    vendor_name: string;
    area: string;
    date: string;
    time: string;
    date_without_format: string;
    price: string;
    currency: string;
    subtotal: string;
    tax: string;
    total: string;
  };
  subscription: {
    id: string | number;
    subscription_name: string;
    vendor_name: string;
    address: string;
    area: string;
    start_date: string;
    price: string;
    currency: string;
    subtotal: string;
    tax: string;
    total: string;
  };
  event: {
    id: string | number;
    event_name: string;
    vendor_name: string;
    area: string;
    date: string;
    time: string;
    date_without_format: string;
    price: string;
    currency: string;
    subtotal: string;
    tax: string;
    total: string;
  };
  venue: {
    tax: string;
    sub_total: string;
    total: string;
  };
  paymentMethods: PaymentMethod[];
}

export interface PaymentMethod {
  id: string | number;
  name: string;
  image: string;
}

export interface SearchParams {
  searchArea: Area | object;
  searchCountry: Country;
  searchMainCategory: Category | null;
  searchSubCategory: Category | null;
  searchDateSelected: string | Date;
  searchTimeSelected: string;
  searchGendersSelected: string[];
}

export interface Order {
  isEmpty: boolean;
  orderMode: string;
  order_id: string | number;
  class_id?: string | number;
  event_id?: string | number;
  recieptId?: string | number;
  transactionId?: string | number;
  class_name?: string;
  status: string;
  event_name?: string;
  vendor_name?: string;
  venue_name?: string;
  vendor_logo?: string;
  date?: string;
  date_without_format?: string;
  time?: string;
  gender?: string;
  address: string;
  area: string;
  price: string;
  currency: string;
  payment_method: string;
  payment_status: string;
  customer_name: string;
  customer_phone: string;
  transaction_date: string;
  longitude: string;
  latitude: string;
  start_date?: string;
  subscription_name?: string;
  share_message: string;
  invoice_id: number | null;
  category?: string;
}

export interface UserAddress {
  id: number | string;
  area_id: number | string;
  customer_id?: number | string;
  area_id: number | string;
  address: UserAddressFields[];
  area: string;
  latitude?: string;
  longitude?: string;
  type: string;
  default: boolean;
}

export interface UserAddressFields {
  id: number | string;
  key: string;
  value: string;
}
