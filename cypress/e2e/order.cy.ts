describe('проверка создания заказа', () => {
  const bun_id = '643d69a5c3f7b9001cfa093c';
  const main_id = '643d69a5c3f7b9001cfa0941';
  const sauce_id = '643d69a5c3f7b9001cfa0942';
  const ingredients_id = [bun_id, main_id, sauce_id];

  const mockAccessToken = 'accessToken';
  const mockRefreshToken = 'refreshToken';

  const BURGER_API_URL = Cypress.env('BURGER_API_URL');

  beforeEach(() => {
    // Мокируем авторизацию с помощью сессии
    cy.session(
      'auth',
      () => {
        // Устанавливаем токены
        cy.setCookie('accessToken', mockAccessToken);
        cy.window().then((win) => {
          win.localStorage.setItem('refreshToken', mockRefreshToken);
        });

        // Перехватываем запрос данных пользователя
        cy.intercept('GET', `${BURGER_API_URL}/auth/user`, {
          fixture: 'user.json'
        }).as('getUser');
      },
      {
        validate() {
          // Проверка на валидность авторизации
          cy.getCookie('accessToken').should('exist');
        }
      }
    );

    // Перехватываем остальные запросы на сервер
    cy.intercept('GET', `${BURGER_API_URL}/ingredients`, {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.intercept('GET', `${BURGER_API_URL}/auth/user`, {
      fixture: 'user.json'
    }).as('getUser');

    cy.intercept('POST', `${BURGER_API_URL}/orders`, {
      fixture: 'order.json'
    }).as('postOrder');

    // Открываем сайт
    cy.visit('localhost:4000');
    cy.wait('@getIngredients');
  });

  // Очищаем cookie и localStorage после тестов
  afterEach(() => {
    cy.clearCookie('accessToken');
    cy.window().then((win) => {
      win.localStorage.removeItem('refreshToken');
    });
  });

  it('должен собраться бургер', () => {
    // Добавляем булочки, начинку и соус в бургер
    ingredients_id.forEach((id) => {
      cy.get(`[data-testid="ingredient-${id}"]`).find('button').click();
    });

    // Создаём заказ
    cy.get('[data-testid="postOrder"]').click();
    cy.wait('@postOrder');

    // Проверяем, что окно открыто и номер заказа соответствует номеру в фикстуре
    cy.get('[data-testid="modal"]').as('modal').should('be.visible');
    cy.fixture('order.json').then(({ order }) => {
      cy.get('@modal').contains(order.number);
    });

    // Проверяем, что конструктор бургера пуст
    cy.get('[data-testid^="constructor-"]').should('not.exist');
    cy.get('[data-testid^="constructor-bun-"').should('not.exist');

    // Закрываем окно и проверяем, что оно закрыто
    cy.get('@modal').find('button').click();
    cy.get('@modal').should('not.exist');
  });
});
