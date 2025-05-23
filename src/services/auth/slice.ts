import { registerUserApi, TAuthResponse, TRegisterData } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { RootState, useSelector } from '../store';
import { setCookie } from '../../utils/cookie';

type TErrorResponse = {
  rejectValue: string;
};

export const register = createAsyncThunk<
  TAuthResponse,
  TRegisterData,
  TErrorResponse
>('user/register', async (regData: TRegisterData, { rejectWithValue }) =>
  registerUserApi(regData)
    .then((res) => res)
    .catch((err) => {
      console.log(err);
      return rejectWithValue(err.message);
    })
);

export type TAuthState = {
  user: TUser | null;
  accessToken: string | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: TAuthState = {
  user: null,
  accessToken: null,
  isLoading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        setCookie('accessToken', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const authReducer = authSlice.reducer;

export const selectAuthError = (state: RootState) => state.auth.error;
export const selectAuthLoading = (state: RootState) => state.auth.isLoading;
