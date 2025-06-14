describe('проверка работы модального окна ингредиентов', () => {
  const bun_id = '643d69a5c3f7b9001cfa093c';
  const bun_name = 'Краторная булка N-200i';

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

  it('должно открыться окно информации об ингредиенте', () => {
    // Проверяем, что окна изначально нет
    cy.get('[data-testid="modal"]').should('not.exist');

    // Кликаем на булочку
    cy.get(`[data-testid="ingredient-${bun_id}"]`).click();

    // Проверяем, что окно открылось
    cy.get('[data-testid="modal"]').as('modal').should('be.visible');

    // Проверяем, что оно содержит информацию о выбранной булочке
    cy.get('@modal').should('contain', bun_name);
  });

  it('окно должно закрыться по нажатии на крестик', () => {
    // Кликаем на булочку
    cy.get(`[data-testid="ingredient-${bun_id}"]`).click();

    // Ищем крестик и кликаем по нему
    cy.get('[data-testid="modal"]').within(() => {
      cy.get('[data-testid="modal-close"]').click();
    });

    // Проверяем, что окно закрылось
    cy.get('[data-testid="modal"]').should('not.exist');
  });

  it('окно должно закрыться по клику на оверлей', () => {
    // Кликаем на булочку
    cy.get(`[data-testid="ingredient-${bun_id}"]`).click();

    // Ищем оверлей и кликаем по нему
    // Указываем force: true для игнорирования частичного перекрытия окном
    cy.get('[data-testid="modal-overlay"]').click({ force: true });

    // Проверяем, что окно закрылось
    cy.get('[data-testid="modal"]').should('not.exist');
  });
});
