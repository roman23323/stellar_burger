import {
  getIngredients,
  ingredientsReducer,
  initialState
} from './ingredientsSlice';

describe('ingredientsSlice reducer', () => {
  it('должен вернуть initialState', () => {
    const state = ingredientsReducer(undefined, { type: 'unknown' });
    expect(state).toEqual(initialState);
  });

  it('должен присвоить isLoading = true, isLoaded = false', () => {
    // Создадим стейт и экшен getIngredients.pending
    const state = { ...initialState };
    const pending = { type: getIngredients.pending.type };

    // Применяем экшен и проверяем стейт
    const statePending = ingredientsReducer(state, pending);
    expect(statePending).toEqual({
      ...state,
      isLoading: true,
      isLoaded: false
    });
  });

  it('должен присвоить isLoading = false, isLoaded = true и заполнить стор', () => {
    // Создаём ингредиенты
    const baseIngr = {
      _id: '0',
      name: 'Ингредиент',
      type: 'main',
      proteins: 0,
      fat: 0,
      carbohydrates: 0,
      calories: 0,
      price: 0,
      image: '',
      image_large: '',
      image_mobile: ''
    };
    const main = { ...baseIngr };
    const sauce = { ...baseIngr, _id: '1', type: 'sauce' };
    const bun = { ...baseIngr, _id: '2', type: 'bun' };
    const ingredients = [main, sauce, bun];

    // Создаём стейт экшен getIngedients.fulfilled
    const state = { ...initialState };
    const fulfilled = {
      type: getIngredients.fulfilled.type,
      payload: ingredients
    };

    // Применяем экшен и проверяем стейт
    const stateFulfilled = ingredientsReducer(state, fulfilled);
    expect(stateFulfilled).toEqual({
      ...state,
      buns: [bun],
      sauces: [sauce],
      mains: [main],
      _index: {
        [main._id]: main,
        [sauce._id]: sauce,
        [bun._id]: bun
      },
      isLoaded: true,
      isLoading: false
    });
  });

  it('должен присвоить isLoading = false и заполнить error', () => {
    // Создаём экшен rejected
    const errorMessage = 'Ошибка при загрузке ингредиентов';
    const rejected = {
      type: getIngredients.rejected.type,
      payload: errorMessage
    };

    // Создаём стейт в состоянии pending
    const statePending = { ...initialState, isLoading: true };

    // Применяем экшен и проверяем стейт
    const stateRejected = ingredientsReducer(statePending, rejected);
    expect(stateRejected).toEqual({
      ...statePending,
      isLoading: false,
      error: errorMessage
    });
  });
});
