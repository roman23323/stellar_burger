import { combineReducers } from '@reduxjs/toolkit';
import { authReducer } from './slices/authSlice';
import { ingredientsReducer } from './slices/ingredientsSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  ingredients: ingredientsReducer
});

export default rootReducer;
