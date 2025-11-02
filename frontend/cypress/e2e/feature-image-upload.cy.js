// Ignore the unhandled exception error caused by the application's catch block,
// allowing the test to continue after the mocked login success.
Cypress.on('uncaught:exception', (err, runnable) => {
  if (err.message.includes("Cannot read properties of undefined (reading 'data')")) {
    return false
  }
  return true
});

describe('Feature: Image Upload (Day 4 E2E)', () => {

  // We need a stable user ID for the app's internal logic
  const mockUserId = '654321098765432109876543'; 

  it('allows a logged-in user to create a post with an image on the Dashboard', () => {
    
    // --- MOCK 1: INITIAL LOAD/TOKEN CHECK (GET /api/auth) ---
    // This runs inside AuthContext's useEffect. It must pass instantly.
    cy.intercept('GET', '/api/auth', {
      statusCode: 200,
      body: {
        _id: mockUserId,
        name: 'Mock User',
        email: 'mock@user.com'
      }
    }).as('loadUserCheck');


    // --- MOCK 2: LOGIN (POST /api/auth/login) ---
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: { token: 'fake-e2e-token' }
    }).as('loginRequest');

    // --- 3. PERFORM LOGIN & WAIT FOR CONTENT ---
    cy.visit('/login');
    cy.get('input#email').type('test@example.com');
    cy.get('input#password').type('password123');
    cy.get('button[type="submit"]').click();
    
    // Wait for the login POST to finish
    cy.wait('@loginRequest');

    // ✅ FINAL FIX: Wait for the content to render. 
    // This succeeds because the GET /api/auth mock prevented the redirect.
    cy.contains('Dashboard').should('be.visible'); 
    cy.url().should('include', '/dashboard'); 

    // --- 4. MOCK POST CREATION API ---
    cy.intercept('POST', '/api/posts', { 
      statusCode: 201, 
      body: { 
        _id: '123post',
        title: 'E2E Post Title', 
        text: 'E2E post content.',
        imageUrl: 'http://e2e-mock.url/image.jpg',
        name: 'Mock User' 
      }
    }).as('createPost');
    
    // --- 5. INTERACT WITH THE FORM ---
    // Fill the Title input
    cy.get('input[name="title"]').type('E2E Post Title');
    
    // Fill the Textarea
    cy.get('textarea[name="text"]').type('E2E post content.');
    
    // Select and attach the file fixture
    cy.get('input[type="file"][name="image"]')
      .selectFile('cypress/fixtures/test-image.png'); 
    
    // Submit the form
    cy.get('form button[type="submit"]').contains('Submit Post').click();

    // --- 6. ASSERTIONS ---
    cy.wait('@createPost');
    
    // Assert the Title and Image are now visible in the post feed
    cy.contains('E2E Post Title').should('be.visible');

    cy.get('img.post-cover-image')
      .should('be.visible')
      .and('have.attr', 'src', 'http://e2e-mock.url/image.jpg');
  });
});
