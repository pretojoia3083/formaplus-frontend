describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should display login page', () => {
    cy.get('h1').should('contain', 'Forma+')
    cy.get('input[type="email"]').should('exist')
    cy.get('input[type="password"]').should('exist')
    cy.get('button[type="submit"]').should('contain', 'Entrar')
  })

  it('should show error on invalid login', () => {
    cy.get('input[type="email"]').type('invalid@email.com')
    cy.get('input[type="password"]').type('wrongpassword')
    cy.get('button[type="submit"]').click()
    cy.contains('Erro ao fazer login').should('be.visible')
  })

  it('should login successfully', () => {
    cy.intercept('POST', '/api/v1/auth/login/json', {
      statusCode: 200,
      body: { access_token: 'mock-token' }
    }).as('login')

    cy.get('input[type="email"]').type('test@email.com')
    cy.get('input[type="password"]').type('password123')
    cy.get('button[type="submit"]').click()
    
    cy.wait('@login')
    cy.url().should('include', '/dashboard')
  })

  it('should register new user', () => {
    cy.visit('/register')
    
    cy.intercept('POST', '/api/v1/auth/register', {
      statusCode: 200,
      body: { id: 1, email: 'new@email.com' }
    }).as('register')

    cy.get('input[type="email"]').type('new@email.com')
    cy.get('input[type="password"]').type('password123')
    cy.get('input[type="password"]').type('password123')
    cy.get('button[type="submit"]').click()
    
    cy.wait('@register')
    cy.contains('Cadastro realizado com sucesso').should('be.visible')
  })
})
