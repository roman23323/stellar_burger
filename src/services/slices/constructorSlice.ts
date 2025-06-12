import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { RootState } from '../store';

export type TConstructorState = {
  ingredients: TConstructorIngredient[];
  bun: TConstructorIngredient | null;
};

export const initialState: TConstructorState = {
  ingredients: [],
  bun: null
};

const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addIngredient: (
      state: TConstructorState,
      action: PayloadAction<TIngredient>
    ) => {
      const ingredient = action.payload;

      if (ingredient.type === 'bun') {
        state.bun = { ...ingredient, id: crypto.randomUUID() };
      } else {
        state.ingredients.push({
          ...ingredient,
          id: crypto.randomUUID()
        });
      }
    },
    removeIngredient: (
      state: TConstructorState,
      action: PayloadAction<string>
    ) => {
      state.ingredients = state.ingredients.filter(
        (i) => i.id != action.payload
      );
    },
    moveIngredient: (
      state: TConstructorState,
      action: PayloadAction<{
        ingredient: TConstructorIngredient;
        direction: 1 | -1;
      }>
    ) => {
      const { ingredient, direction } = action.payload;
      const currentIndex = state.ingredients.findIndex(
        (item) => item.id === ingredient.id
      );

      const newIndex = currentIndex + direction;
      const newIngredients = [...state.ingredients];

      const [movedItem] = newIngredients.splice(currentIndex, 1);
      newIngredients.splice(newIndex, 0, movedItem);

      state.ingredients = newIngredients;
    },
    removeAll: (state: TConstructorState) => (state = initialState)
  }
});

export const { addIngredient, removeIngredient, moveIngredient, removeAll } =
  constructorSlice.actions;

export const constructorReducer = constructorSlice.reducer;
export const selectConstructorItems = (state: RootState) =>
  state.burgerConstructor;
