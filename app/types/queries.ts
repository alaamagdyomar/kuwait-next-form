import { Product, Vendor } from '@/types/index';

export type AppQueryResult<T> = {
  success: boolean;
  status: string | number;
  message: string;
  data: T;
  pagination?: Pagination;
};

export type Pagination = {
  meta: {
    page: {
      previous: string;
      next: string;
      isPrevious: boolean;
      isNext: boolean;
      [key: string]: string | boolean;
    };
  };
  links: {
    path: string;
    first: string;
    last: string;
    previous: string;
    next: string;
  };
};

export type CategoriesType = {
  slider: string;
  resizeSlider: string;
  types: Category[];
};

export type Category = {
  id: string | number;
  name: string;
  image: string;
  gender_filter?: string | number;
  color?: string;
};

export interface Country {
  id: string | number;
  name: string;
  name_ar: string;
  name_en: string;
  code: string;
  currency: string;
  image: string;
  tax_status?: string | number;
  inclusive?: string | number;
  tax?: string;
  address_field?: [any];
}

export interface Auth {
  access_token: string | null;
  user: {
    id: string | number;
    name: string;
    phone: string;
    email: string;
    date_of_birth: string;
    gender: string;
    status: number | boolean;
    phone_verified: number;
    country_code: string;
    country_id?: string | number;
    avatar: string;
  };
}

export interface StoreProps {
  home_slider_images: [{ image: string }];
  just_added_products: Product[];
  bestselling_products: Product[];
  featured_vendors: Vendor[];
}

export interface Area {
  id: string | number;
  name: string;
}

export interface Venue {
  id: string | number;
  background_image_slider: string[];
  booking_times: booking_times[];
  lat: string;
  long: string;
  price: string;
  currency: string;
  space: string;
  venue_name: string;
  background_image: string;
  vendor_name: string;
  vendor_logo: string;
  amenities?: Amenities[];
  area: string;
}

export interface booking_times {
  active: boolean | string;
  name: string;
}

export interface Amenities {
  id: string | number;
  name: string;
  icon: string;
}

export interface Class {
  id: string;
  main_image: string;
  images: string[];
  discription: string;
  vendor_logo: string;
  class_name: string;
  vendor_name: string;
  class_price: string;
  currency: string;
  categories: Category[] | string;
  amenities: Amenities[];
  longitude: string;
  latitude: string;
  coach_name: string;
  is_capacity: number;
  available_seats: number;
  gender: string;
  area: string;
  date: string;
  time: string;
  date_without_format: string;
}

export interface Event {
  id: string;
  main_image: string;
  images: string[];
  description: string;
  vendor_logo: string;
  event_name: string;
  vendor_name: string;
  event_price: string;
  organizer: string;
  currency: string;
  categories: Category[] | string;
  longitude: string;
  latitude: string;
  coach_name: string;
  is_capacity: number;
  available_seats: number;
  gender: string;
  area: string;
  date: string;
  time: string;
  date_without_format: string;
}

export interface Club {
  vendor_id: string;
  vendor_banner: string;
  vendor_logo: string;
  vendor_name: string;
  space: string;
  area: string;
  price: string;
  currency: string;
  description?: string;
  categories: string;
  amenities: Amenities[];
  subscription_duration: string;
  name?: string;
  images?: string[];
  address: string;
  longitude: string;
  latitude: string;
  pre_starting_date: number;
  date: string;
  max_days: number;
  subscriptions: Subscription[];
}

export interface Subscription {
  id: string;
  name?: string;
  subscription_duration: string;
  price: string;
  amenities: Amenities[];
  vendor_logo?: string;
  vendor_name: string;
  area: string;
  currency: string;
  description?: string;
  categories: string;
  images?: string[];
  latitude: string;
  longitude: string;
  pre_starting_date: number;
}

export interface StaticPage {
  id: string | number;
  body: string;
  title: string;
}

export interface PreviousOrder {
  order_code: string;
  status: string;
  address: {
    street: string;
  };
  total: string;
  orderedOn: string;
}

export interface Guest {
  name: string;
  phone: string | number;
  // gender: string;
  guestMode: boolean;
  backPath: null | string;
}
export interface AppointmentHistory {
  vendor_name: string;
  venue?: string;
  class_name?: string;
  status: string;
  address: string;
  area: string;
  space: string;
  longitude: string;
  latitude: string;
  date: string;
  time: string;
  price: string;
  currency: string;
  booked_on?: string;
  bookedOn?: string;
  share_message: string;
  subscription_name: string;
  subscription_duration: string;
  start_date: string;
  subscribed_on: string;
}

export interface PaymentProcess {
  url: string;
  invoice_id: number;
  category: string;
}
