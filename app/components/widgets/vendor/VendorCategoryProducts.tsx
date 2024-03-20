import { useGetVendorItemsMutation } from '@/redux/api/vendorApi';
import { useAppSelector } from '@/redux/hooks';
import { Product } from '@/types/index';
import { AppQueryResult } from '@/types/queries';
import { map } from 'lodash';
import React, { FC, useEffect } from 'react';
import LoadingSpinner from '../../LoadingSpinner';
import HorProductWidget from '../product/HorProductWidget';

type Props = {
  element: any;
};
const VendorCategoryProducts: FC<Props> = ({
  element
}): JSX.Element => {
  // const {
  //   country: { id: country },
  //   locale: { lang },
  // } = useAppSelector((state) => state);

  // const [trigger, { data: vendorItems, isSuccess: vendorItemsSuccess }] =
  //   useGetVendorItemsMutation<{
  //     data: AppQueryResult<Product>;
  //     isSuccess: boolean;
  //   }>();

  // useEffect(() => {
  //   trigger({
  //     lang,
  //     country,
  //     params: { vendor_id: VenId.toString(), category_id: Cat.id.toString() },
  //   });

  //   // console.log('venid',VenId,Cat.id)
  // }, [Cat]);

  // if (!vendorItemsSuccess) {
  //   return <LoadingSpinner />;
  // }

  // console.log({element})

  return (
    <div key={element.id} id={element.id} className={`mb-2`}>
      <div
        className={`grid grid-cols-2 lg:grid-cols-3 gap-2 justify-center items-center`}
      >
        {map(element?.items, (p: Product) => (
          <HorProductWidget element={p} key={p.id} />
        ))}
      </div>
    </div>
  );
};

export default VendorCategoryProducts;
