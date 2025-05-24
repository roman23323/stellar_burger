import { getIngredientsApi, TErrorResponse } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { RootState } from '../store';

export const ingredients = createAsyncThunk<
  TIngredient[],
  void,
  TErrorResponse
>('ingredients', async (_, { rejectWithValue }) =>
  getIngredientsApi()
    .then((res) => {
      console.log('Есть результат: ', res);
      return res;
    })
    .catch((err) => {
      console.log(err);
      return rejectWithValue(err.message);
    })
);

export type TIngredientsState = {
  buns: TIngredient[];
  sauces: TIngredient[];
  mains: TIngredient[];
  _index: Record<string, TIngredient>;
  selectedIngredient: TIngredient | null;
  isLoading: boolean;
  isLoaded: boolean;
  error: string | null;
};

const initialState: TIngredientsState = {
  buns: [],
  sauces: [],
  mains: [],
  _index: {},
  selectedIngredient: null,
  isLoading: false,
  isLoaded: false,
  error: null
};

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(ingredients.pending, (state) => {
        state.isLoading = true;
        state.isLoaded = false;
      })
      .addCase(ingredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoaded = true;
        state.buns = [];
        state.mains = [];
        state.sauces = [];
        action.payload.forEach((ingredient) => {
          state._index[ingredient._id] = ingredient;
          switch (ingredient.type) {
            case 'bun':
              state.buns.push(ingredient);
              break;
            case 'sauce':
              state.sauces.push(ingredient);
              break;
            case 'main':
              state.mains.push(ingredient);
              break;
            default:
              console.warn(`Неизвестный ингредиент: ${ingredient.type}`);
              break;
          }
        });
      })
      .addCase(ingredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Ошибка при получении ингредиентов';
      });
  }
});

export const ingredientsReducer = ingredientsSlice.reducer;

export const selectBuns = (state: RootState) => state.ingredients.buns;
export const selectSauces = (state: RootState) => state.ingredients.sauces;
export const selectMains = (state: RootState) => state.ingredients.mains;
export const selectIngredientById = (id: string) => (state: RootState) =>
  state.ingredients._index[id];
export const selectIsIngredientsLoading = (state: RootState) =>
  state.ingredients.isLoading;
export const selectIsIngredientsLoaded = (state: RootState) =>
  state.ingredients.isLoaded;
