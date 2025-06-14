describe('проверка конструктора бургера', () => {
  const bun_id = '643d69a5c3f7b9001cfa093c';
  const main_id = '643d69a5c3f7b9001cfa0941';
  const sauce_id = '643d69a5c3f7b9001cfa0942';
  const ingredients_id = [bun_id, main_id, sauce_id];

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
    // Добавляем булочки, начинку и соус
    ingredients_id.forEach((id) => {
      cy.get(`[data-testid="ingredient-${id}"]`).find('button').click();
    });

    // Проверяем, что в коснтруктор бургера добавились ингредиенты
    cy.get('[data-testid^="constructor-"]').should('have.length', 4);
    cy.get('[data-testid^="constructor-bun-"').should('have.length', 2);
  });
});
