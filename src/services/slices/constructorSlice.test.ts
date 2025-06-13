import { TIngredient } from '@utils-types';
import {
  addIngredient,
  constructorReducer,
  initialState,
  moveIngredient,
  removeAll,
  removeIngredient
} from './constructorSlice';

describe('constructorSlice reducer', () => {
  const main: TIngredient = {
    _id: '1',
    name: 'Ингредиент 1',
    type: 'main',
    proteins: 1,
    fat: 1,
    carbohydrates: 1,
    calories: 1,
    price: 1,
    image: '',
    image_large: '',
    image_mobile: ''
  };
  const sauce: TIngredient = {
    _id: '2',
    name: 'Ингредиент 2',
    type: 'sauce',
    proteins: 2,
    fat: 2,
    carbohydrates: 2,
    calories: 2,
    price: 2,
    image: '',
    image_large: '',
    image_mobile: ''
  };

  it('должен вернуть initialState', () => {
    const state = constructorReducer(undefined, { type: 'unknown' });
    expect(state).toEqual(initialState);
  });

  it('должен добавить ингредиент в стейт', () => {
    const action = addIngredient(main);
    const state = constructorReducer(initialState, action);
    expect(state).toEqual({ bun: null, ingredients: [action.payload] });
  });

  it('должен добавить ингредиент, а затем удалить его', () => {
    // Готовим стейт - добавляем ингредиент
    const actionAddIngredient = addIngredient(sauce);
    const stateWithIngredient = constructorReducer(
      initialState,
      actionAddIngredient
    );

    // Извлекаем подготовленный (с полем 'id') ингредиент
    const ingredientPrepared = actionAddIngredient.payload;

    // Проверяем, что ингредиент добавлен
    expect(stateWithIngredient).toEqual({
      bun: null,
      ingredients: [actionAddIngredient.payload]
    });

    // Удаляем ингредиент
    const actionRemoveBun = removeIngredient(ingredientPrepared.id);
    const stateWithoutBun = constructorReducer(
      stateWithIngredient,
      actionRemoveBun
    );

    // Проверяем, что ингредиент удалён
    expect(stateWithoutBun).toEqual({ bun: null, ingredients: [] });
  });

  it('должен удалить все ингредиенты', () => {
    // Создаём экшены для добавления ингредиентов
    const actionAddIngredient1 = addIngredient(main);
    const actionAddIngredient2 = addIngredient(sauce);

    // Извлекаем подготовленные ингредиенты из экшенов
    const mainPrepared = actionAddIngredient1.payload;
    const saucePrepared = actionAddIngredient2.payload;

    // Создаём стейт, добавляем ингредиенты
    let state = constructorReducer(initialState, actionAddIngredient1);
    state = constructorReducer(state, actionAddIngredient2);

    // Проверяем, что ингредиенты добавлены
    expect(state).toEqual({
      bun: null,
      ingredients: [mainPrepared, saucePrepared]
    });

    // Удаляем все ингредиенты и проверяем стейт
    state = constructorReducer(state, removeAll());
    expect(state).toEqual(initialState);
  });

  it('должен поменять местами 1-ый и 2-ой ингредиенты', () => {
    // Создаём экшены для добавления ингредиентов
    const actionAddIngredient1 = addIngredient(main);
    const actionAddIngredient2 = addIngredient(sauce);

    // Извлекаем подготовленные ингредиенты из экшенов
    const mainPrepared = actionAddIngredient1.payload;
    const saucePrepared = actionAddIngredient2.payload;

    // Создаём стейт, добавляем ингредиенты
    let state = constructorReducer(initialState, actionAddIngredient1);
    state = constructorReducer(state, actionAddIngredient2);

    // Проверяем, что ингредиенты добавлены
    expect(state).toEqual({
      bun: null,
      ingredients: [mainPrepared, saucePrepared]
    });

    // Создаём экшен перемещения 1-го ингредиента на место 2-го
    const actionMoveIngredient = moveIngredient({
      ingredient: mainPrepared,
      direction: 1
    });

    // Применяем экшен и проверяем, что ингредиенты переместились
    state = constructorReducer(state, actionMoveIngredient);
    expect(state).toEqual({
      bun: null,
      ingredients: [saucePrepared, mainPrepared]
    });
  });
});
