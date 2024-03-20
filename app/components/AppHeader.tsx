import { FC, Suspense } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import Link from 'next/link';
import { appLinks, imageSizes } from '@/constants/*';
import burgerIcon from '@/appIcons/burger_menu.svg';
import Image from 'next/image';
import { hideSideMenu, showSideMenu } from '@/redux/slices/appSettingSlice';
import { isAuthenticated } from '@/redux/slices/authSlice';
import { useGetCartProductsQuery } from '@/redux/api/cartApi';
import { AppQueryResult } from '@/types/queries';
import { ShoppingCartOutlined } from '@mui/icons-material';
import Badge from '@mui/material/Badge';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
const HeaderLogoSection = dynamic(
  () => import(`@/components/HeaderLogoSection`),
  {
    ssr: true,
  }
);
const SideMenu = dynamic(() => import(`@/components/sideMenu`), {
  ssr: false,
});

const AppHeader: FC = (): JSX.Element => {
  const {
    locale: { lang },
    appSetting: { sideMenuOpen, showCart },
    country: {
      id: country_id,
      name: country_name,
      name_ar: country_name_ar,
      currency: country_currency,
    },
    auth: {
      user: { avatar, name, id: user_id },
    },
    cart: { tempId, currentMode },
  } = useAppSelector((state) => state);
  const isAuth = useAppSelector(isAuthenticated);
  const { locale } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const { data: cartElements, isSuccess: cartSuccess } =
    useGetCartProductsQuery<{
      data: AppQueryResult<any>;
      isSuccess: boolean;
      isLoading: boolean;
    }>({
      country: country_id.toString(),
      lang,
      params: {
        ...(isAuth && { user_id: user_id }),
        tempId: tempId ? tempId : null,
      },
    });

  return (
    <Suspense>
      <SideMenu />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="grid grid-cols-3 w-full p-5 items-center"
      >
        <button
          onClick={() =>
            sideMenuOpen
              ? dispatch(hideSideMenu(undefined))
              : dispatch(showSideMenu(undefined))
          }
        >
          <div className="col-span-1 cursor-pointer w-fit items-center justify-center ">
            <Image
              src={burgerIcon}
              className={`w-6 h-6`}
              alt={`home`}
              width={imageSizes.xl}
              height={imageSizes.xl}
            />
          </div>
        </button>
        {/* logo */}
        <HeaderLogoSection />
        <div className="col-span-1 flex justify-end items-center gap-x-5">
          {/* cart */}
          {showCart && cartSuccess ? (
            <Link scroll={true} href={`${appLinks.cartProductIndex.path}`}>
              {cartElements.data === null ? (
                <ShoppingCartOutlined fontSize="medium" />
              ) : (
                <Badge
                  sx={{
                    '& .MuiBadge-badge': {
                      color: 'white',
                      backgroundColor: 'red',
                      fontSize: 9,
                      height: 15,
                      minWidth: 15,
                    },
                  }}
                  badgeContent={cartElements.data.items.length}
                  max={99}
                >
                  <ShoppingCartOutlined fontSize="medium" />
                </Badge>
              )}
            </Link>
          ) : null}

          {isAuth && avatar && (
            <div className="w-full text-end flex justify-end">
              <Link
                scroll={true}
                href={`${appLinks.account.path}`}
                className={`rounded-full h-10 w-10 shadow-lg border border-gray-400`}
              >
                <Image
                  src={avatar}
                  width={imageSizes.xl}
                  height={imageSizes.xl}
                  className={`w-10 w-10 rounded-full object-cover `}
                  alt={name}
                />
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </Suspense>
  );
};

export default AppHeader;
