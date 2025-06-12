import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TAuthResponse,
  TErrorResponse,
  TLoginData,
  TRegisterData,
  TUserResponse
} from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { RootState } from '../store';
import { deleteCookie } from '../../utils/cookie';

export const getUserWithToken = createAsyncThunk<
  TUserResponse,
  void,
  TErrorResponse
>('user/getUserWithToken', async (_, { rejectWithValue }) =>
  getUserApi()
    .then((res) => res)
    .catch((err) => rejectWithValue(err))
);

export const register = createAsyncThunk<
  TAuthResponse,
  TRegisterData,
  TErrorResponse
>('user/register', async (regData: TRegisterData, { rejectWithValue }) =>
  registerUserApi(regData)
    .then((res) => res)
    .catch((err) => rejectWithValue(err.message))
);

export const login = createAsyncThunk<
  TAuthResponse,
  TLoginData,
  TErrorResponse
>('user/login', async (loginData: TLoginData, { rejectWithValue }) => {
  try {
    const res = await loginUserApi(loginData);
    return res;
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const logout = createAsyncThunk<
  { success: boolean },
  void,
  TErrorResponse
>('user/logout', async (_, { rejectWithValue }) =>
  logoutApi()
    .then((res) => res)
    .catch((err) => rejectWithValue(err))
);

export type TAuthState = {
  user: TUser | null;
  isLoading: boolean;
  error: string | null;
};

export const initialState: TAuthState = {
  user: null,
  isLoading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateUserData: (state: TAuthState, action: PayloadAction<TUser>) => {
      const { name, email } = action.payload;
      state.user = { name, email };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Ошибка при регистрации';
      })

      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Ошибка входа в аккаунт';
      })

      .addCase(getUserWithToken.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserWithToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
      })
      .addCase(getUserWithToken.rejected, (state, action) => {
        state.isLoading = false;
      })

      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = null;
        deleteCookie('accessToken');
        localStorage.removeItem('refreshToken');
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Ошибка выхода из аккаунта';
      });
  }
});

export const authReducer = authSlice.reducer;

export const { updateUserData } = authSlice.actions;

export const selectAuthError = (state: RootState) => state.auth.error;
export const selectIsAuthLoading = (state: RootState) => state.auth.isLoading;
export const selectUser = (state: RootState) => state.auth.user;
