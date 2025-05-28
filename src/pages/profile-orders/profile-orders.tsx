import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import {
  getOrders,
  IsOrderLoading,
  isUpToDate,
  selectOrders
} from '../../services/slices/orderSlice';
import { useDispatch, useSelector } from '../../services/store';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const orders: TOrder[] = useSelector(selectOrders);
  const isLoading = useSelector(IsOrderLoading);
  const isUpdated = useSelector(isUpToDate);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isUpdated) {
      dispatch(getOrders());
    }
  }, [isUpdated]);

  if (isLoading) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
