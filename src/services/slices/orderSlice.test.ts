import {
  clearOrderModalData,
  getOrders,
  initialState,
  orderReducer,
  postOrder
} from './orderSlice';

describe('проверка редьюсера orderSlice', () => {
  const order = {
    _id: '1',
    status: '',
    name: '',
    createdAt: '',
    updatedAt: '',
    number: 1,
    ingredients: ['1', '2']
  };

  it('должен вернуть initialState', () => {
    const state = orderReducer(undefined, { type: 'unknown' });
    expect(state).toEqual(initialState);
  });

  it('должен присвоить orderModalData = null', () => {
    // Создаём стейт и экшен удаления данных окна
    const state = { ...initialState, orderModalData: order };
    const clearData = { type: clearOrderModalData.type };

    // Применяем экшен и проверяем новый стейт
    const stateCleared = orderReducer(state, clearData);
    expect(stateCleared).toEqual({
      ...state,
      orderModalData: null
    });
  });

  describe('экшены postOrder', () => {
    it('должен присвоить orderRequest = true, сбросить данные окна и ошибки', () => {
      // Создаём начальный стейт и экшен postOrder.pending
      const errorMessage = 'Предыдущая ошибка';
      const state = {
        ...initialState,
        orderModaldata: order,
        error: errorMessage
      };
      const orderPending = { type: postOrder.pending.type };

      // Применяем экшен и проверяем стейт
      const statePending = orderReducer(state, orderPending);
      expect(statePending).toEqual({
        ...state,
        orderRequest: true,
        orderModalData: null,
        error: null
      });
    });

    describe('экшены postOrder', () => {
      it('должен обновить флаги создания заказа и данные модального окна', () => {
        // Создаём стейт и экшен postOrder.fulfilled
        const state = { ...initialState, orderRequest: true, isUpToDate: true };
        const payload = { name: 'Бургер', order };
        const orderFulfilled = { type: postOrder.fulfilled.type, payload };

        // Применяем экшен и проверяем новое состояние
        const stateFulfilled = orderReducer(state, orderFulfilled);
        expect(stateFulfilled).toEqual({
          ...state,
          orderRequest: false,
          isUpToDate: false,
          orderModalData: order
        });
      });

      it('должен сбросить флаг создания заказа и заполнить error', () => {
        // Создаём начальный стейт и экшен postOrder.rejected
        const state = { ...initialState, orderRequest: true };
        const errorMessage = 'Ошибка при создании заказа';
        const orderRejected = {
          type: postOrder.rejected.type,
          payload: errorMessage
        };

        // Применяем экшен и проверяем стейт
        const stateRejected = orderReducer(state, orderRejected);
        expect(stateRejected).toEqual({
          ...state,
          orderRequest: false,
          error: errorMessage
        });
      });
    });

    describe('экшены getOrders', () => {
      it('должен присвоить isLoading = true и сбросить ошибку', () => {
        // Создаём стейт и экшен getOrders.pending
        const state = { ...initialState, error: 'Предыдущая ошибка' };
        const getPending = { type: getOrders.pending.type };

        // Приеняем экшен и проверяем стейт
        const statePending = orderReducer(state, getPending);
        expect(statePending).toEqual({
          ...state,
          isLoading: true,
          error: null
        });
      });

      it('должен заполнить заказы, обновить флаги isUpToDate и isLoading', () => {
        // Создаём стейт и экшен getOrders.fulfilled
        const state = { ...initialState, isLoading: true };
        const payload = [order];
        const getFulfilled = { type: getOrders.fulfilled.type, payload };

        // Применяем экшен и проверяем стейт
        const stateFulfilled = orderReducer(state, getFulfilled);
        expect(stateFulfilled).toEqual({
          ...state,
          isLoading: false,
          isUpToDate: true,
          orders: [order]
        });
      });

      it('должен заполнить заказы, обновить флаги isUpToDate и isLoading', () => {
        // Создаём стейт и экшен getOrders.rejected
        const state = { ...initialState, isLoading: true };
        const errorMessage = 'Ошибка при получении списка заказов';
        const getRejected = {
          type: getOrders.rejected.type,
          payload: errorMessage
        };

        // Применяем экшен и проверяем стейт
        const stateRejected = orderReducer(state, getRejected);
        expect(stateRejected).toEqual({
          ...state,
          isLoading: false,
          error: errorMessage
        });
      });
    });
  });
});
