import rootReducer from './rootReducer';
import { initialState as authState } from './slices/authSlice';
import { initialState as ingredientsState } from './slices/ingredientsSlice';
import { initialState as constructorState } from './slices/constructorSlice';
import { initialState as ordersState } from './slices/orderSlice';

describe('rootReducer', () => {
  it('должен вернуть initialState каждого редьюсера', () => {
    const rootState = rootReducer(undefined, { type: 'unknown' });
    expect(rootState).toEqual({
      auth: authState,
      ingredients: ingredientsState,
      burgerConstructor: constructorState,
      orders: ordersState
    });
  });
});
