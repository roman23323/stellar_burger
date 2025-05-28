import { getOrdersApi, orderBurgerApi, TErrorResponse } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { RootState } from '../store';

export const postOrder = createAsyncThunk<
  { order: TOrder; name: string },
  string[],
  { rejectValue: string }
>('orders/create', async (ingredients, { rejectWithValue }) => {
  try {
    const data = await orderBurgerApi(ingredients);
    return data;
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const getOrders = createAsyncThunk<TOrder[], void, TErrorResponse>(
  'orders/get',
  async (_, { rejectWithValue }) =>
    getOrdersApi()
      .then((res) => res)
      .catch((err) => rejectWithValue(err.message))
);

export type TOrderState = {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  orders: TOrder[];
  isLoading: boolean;
  isUpToDate: boolean;
};

const initialState: TOrderState = {
  orderRequest: false,
  orderModalData: null,
  orders: [],
  isLoading: false,
  isUpToDate: false
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderModalData: (state: TOrderState) => {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(postOrder.pending, (state) => {
        state.orderRequest = true;
        state.orderModalData = null;
      })
      .addCase(postOrder.fulfilled, (state, action) => {
        const order = action.payload.order;
        state.orderRequest = false;
        state.isUpToDate = false;
        state.orderModalData = order;
      })
      .addCase(postOrder.rejected, (state, action) => {
        state.orderRequest = false;
      })

      .addCase(getOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.isUpToDate = true;
        state.isLoading = false;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.isLoading = false;
      });
  }
});

export const orderReducer = orderSlice.reducer;
export const { clearOrderModalData } = orderSlice.actions;

export const selectOrderRequest = (state: RootState) =>
  state.orders.orderRequest;
export const selectOrderModalData = (state: RootState) =>
  state.orders.orderModalData;
export const selectOrders = (state: RootState) => state.orders.orders;
export const IsOrderLoading = (state: RootState) => state.orders.isLoading;
export const isUpToDate = (state: RootState) => state.orders.isUpToDate;
