import { combineReducers } from '@reduxjs/toolkit';
import { authReducer } from './slices/authSlice';
import { ingredientsReducer } from './slices/ingredientsSlice';
import { constructorReducer } from './slices/constructorSlice';
import { orderReducer } from './slices/orderSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  ingredients: ingredientsReducer,
  burgerConstructor: constructorReducer,
  orders: orderReducer
});

export default rootReducer;
