describe('проверка конструктора бургера', () => {
  const bun_id = '643d69a5c3f7b9001cfa093c';
  const main_id = '643d69a5c3f7b9001cfa0941';
  const sauce_id = '643d69a5c3f7b9001cfa0942';

  const BURGER_API_URL = Cypress.env('BURGER_API_URL');

  beforeEach(() => {
    // Настраиваем перехват запроса
    cy.intercept('GET', `${BURGER_API_URL}/ingredients`, {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    // Открываем сайт
    cy.visit('localhost:4000');

    // Ждём загрузки ингредиентов
    cy.wait('@getIngredients');
  });

  it('должен отобразить все моковые ингредиенты', () => {
    cy.get('[data-testid^="ingredient-"]') // Находим карточки ингредиентов
      .should('have.length', 5); // Проверяем, что появились все ингредиенты
  });

  it('должен добавлять ингредиенты по кнопке "добавить"', () => {
    // Добавляем начинку и соус
    [main_id, sauce_id].forEach((id) => {
      // Проверяем, что ингредиента изначально нет в конструкторе
      cy.get(`[data-testid="constructor-el-${id}"]`).should('not.exist');

      // Добавляем ингредиент
      cy.get(`[data-testid="ingredient-${id}"]`).find('button').click();

      // Проверяем, что выбранный ингредиент появился в констркуторе
      cy.get(`[data-testid="constructor-el-${id}"]`).should('exist');
    });

    // Проверяем, что булочек изначально нет в конструкторе
    cy.get('[data-testid^="constructor-bun-"]').should('not.exist');

    // Добавляем булочки
    cy.get(`[data-testid="ingredient-${bun_id}"]`).find('button').click();

    // Проверяем, что в конструкторе появились выбранные булочки
    cy.get(`[data-testid="constructor-bun-top-${bun_id}"]`).should('exist');
    cy.get(`[data-testid="constructor-bun-bottom-${bun_id}"]`).should('exist');
  });
});
