import {
  authReducer,
  getUserWithToken,
  initialState,
  login,
  logout,
  register,
  updateUserData
} from './authSlice';

describe('authSlice reducer', () => {
  it('должен вернуть initialState', () => {
    const state = authReducer(undefined, { type: 'unknown' });
    expect(state).toEqual(initialState);
  });

  it('должен обновить данные пользователя', () => {
    // Создаём начальный стейт и обновлённые данные пользователя
    const state = {
      user: { name: 'Имя 1', email: 'mail1@email.com' },
      isLoading: false,
      error: null
    };
    const userUpdated = { name: 'Имя 2', email: 'mail2@email.com' };

    // Создаём экшен, применяем его и проверяем новый стейт
    const actionUpdate = updateUserData(userUpdated);
    const stateUpdated = authReducer(state, actionUpdate);
    expect(stateUpdated).toEqual({ ...state, user: userUpdated });
  });

  describe('экшены register', () => {
    it('должен присвоить isLoading = true, error = null', () => {
      // Создаём начальный стейт и экшен register.pending
      const state = { ...initialState, error: 'Предыдущая ошибка' };
      const registerPending = { type: register.pending.type };

      // Применяем экшен и проверяем новый стейт
      const statePending = authReducer(state, registerPending);
      expect(statePending).toEqual({ ...state, isLoading: true, error: null });
    });

    it('должен присвоить isLoading = false и новые данные пользователя', () => {
      // Создаём начальный стейт и экшен pending.fulfilled
      const state = { ...initialState, isLoading: true };
      const userData = { email: 'mail@email.com', name: 'Имя' };
      const payload = {
        success: true,
        accessToken: 'at',
        refreshToken: 'rt',
        user: userData
      };
      const registerFulfilled = {
        type: register.fulfilled.type,
        payload: payload
      };

      // Применяем экшен и проверяем новый стейт
      const stateFulfilled = authReducer(state, registerFulfilled);
      expect(stateFulfilled).toEqual({
        ...state,
        isLoading: false,
        user: { name: userData.name, email: userData.email }
      });
    });

    it('должен присвоить isLoading = false и заполнить error', () => {
      // Создаём начальный стейт и экшен register.rejected
      const state = { ...initialState, isLoading: true };
      const errorMessage = 'Ошибка при регистрации';
      const registerRejected = {
        type: register.rejected.type,
        payload: errorMessage
      };

      // Применяем экшен и проверяем новый стейт
      const stateRejected = authReducer(state, registerRejected);
      expect(stateRejected).toEqual({
        ...initialState,
        isLoading: false,
        error: errorMessage
      });
    });
  });

  describe('экшены login', () => {
    it('должен присвоить isLoading = true, error = null', () => {
      // Создаём начальный стейт и экшен login.pending
      const state = { ...initialState, error: 'Предыдущая ошибка' };
      const loginPending = { type: login.pending.type };

      // Применяем экшен и проверяем новое состояние
      const statePending = authReducer(state, loginPending);
      expect(statePending).toEqual({
        ...initialState,
        isLoading: true,
        error: null
      });
    });

    it('должен присвоить isLoading = false и заполнить данные о пользователе', () => {
      // Создаём начальный стейт и экшен login.fulfilled
      const state = { ...initialState, isLoading: true };
      const userData = { email: 'mail@email.com', name: 'Имя' };
      const payload = {
        success: true,
        accessToken: 'at',
        refreshToken: 'rt',
        user: userData
      };
      const loginfulfilled = { type: login.fulfilled.type, payload };

      // Применяем экшен и проверяем новый стейт
      const stateFulfilled = authReducer(state, loginfulfilled);
      expect(stateFulfilled).toEqual({
        ...initialState,
        isLoading: false,
        user: userData
      });
    });

    it('должен присвоить isLoading = false и заполнить error', () => {
      // Создаём стейт и экшен login.rejected
      const state = { ...initialState, isLoading: true };
      const errorMessage = 'Ошибка входа в аккаунт';
      const loginRejected = {
        type: login.rejected.type,
        payload: errorMessage
      };

      // Применяем экшен и проверяем стейт
      const stateRejected = authReducer(state, loginRejected);
      expect(stateRejected).toEqual({
        ...initialState,
        isLoading: false,
        error: errorMessage
      });
    });
  });

  describe('экшены getUserWithToken', () => {
    it('должен присвоить isLoading = true, error = null', () => {
      // Создаём стейт и экшен getUserWithToken.pending
      const state = { ...initialState, error: 'Предыдущая ошибка' };
      const userPending = { type: getUserWithToken.pending.type };

      // Применяем экшен и проверяем стейт
      const statePending = authReducer(state, userPending);
      expect(statePending).toEqual({
        ...initialState,
        isLoading: true,
        error: null
      });
    });

    it('должен присвоить isLoading = false и заполнить данные пользователя', () => {
      // Создаём стейт и экшен getUserWithToken.fulfilled
      const state = { ...initialState, isLoading: true };
      const userData = { email: 'mail@email.com', name: 'Имя' };
      const payload = { success: true, user: userData };
      const userFulfilled = { type: getUserWithToken.fulfilled.type, payload };

      // Применяем экшен и проверяем стейт
      const stateFulfilled = authReducer(state, userFulfilled);
      expect(stateFulfilled).toEqual({
        ...initialState,
        isLoading: false,
        user: userData
      });
    });

    it('должен присвоить isLoading = false и заполнить error', () => {
      // Создаём стейт и экшен getUserWithToken.rejected
      const state = { ...initialState, isLoading: true };
      const errorMessage = 'Ошибка получения данных пользователя';
      const userRejected = {
        type: getUserWithToken.rejected.type,
        payload: errorMessage
      };

      // Применяем экшен и проверяем стейт
      const stateRejected = authReducer(state, userRejected);
      expect(stateRejected).toEqual({
        ...initialState,
        isLoading: false,
        error: errorMessage
      });
    });
  });

  describe('экшены logout', () => {
    it('должен прсивоить isLoading = true', () => {
      // Создаём стейт и экшен logout.pending
      const state = { ...initialState };
      const logoutPending = { type: logout.pending.type };

      // Применяем экшен и проверяем стейт
      const statePending = authReducer(state, logoutPending);
      expect(statePending).toEqual({
        ...initialState,
        isLoading: true
      });
    });

    it('должен присвоить isLoading = false, user = null', () => {
      // Создаём стейт и экшен logout.fulfilled
      const userData = { email: 'mail@email.com', name: 'Имя' };
      const state = { ...initialState, isLoading: true, user: userData };
      const logoutFulfilled = { type: logout.fulfilled.type };

      // Применяем экшен и проверяем стейт
      const stateFulfilled = authReducer(state, logoutFulfilled);
      expect(stateFulfilled).toEqual({
        ...initialState,
        isLoading: false,
        user: null
      });
    });

    it('должен присвоить isLoading = false и заполнить error', () => {
      // Создаём стейт и экшен logout.rejected
      const state = { ...initialState, isLoading: true };
      const errorMessage = 'Ошибка выхода из аккаунта';
      const logoutRejected = {
        type: logout.rejected.type,
        payload: errorMessage
      };

      // Применяем экшен и проверяем стейт
      const stateRejected = authReducer(state, logoutRejected);
      expect(stateRejected).toEqual({
        ...initialState,
        isLoading: false,
        error: errorMessage
      });
    });
  });
});
