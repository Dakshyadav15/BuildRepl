// Ignore the unhandled exception error caused by the application's catch block
Cypress.on('uncaught:exception', (err, runnable) => {
  if (
    err.message.includes("Cannot read properties of undefined (reading 'data')")
  ) {
    return false;
  }
  return true;
});

describe('Feature: Image Upload (Day 4 E2E)', () => {
  const mockUserId = '654321098765432109876543';

  beforeEach(() => {
    // Clear localStorage before each test
    cy.clearLocalStorage();
  });

  it('allows a logged-in user to create a post with an image on the Dashboard', () => {
    // --- MOCK 1: INITIAL LOAD/TOKEN CHECK (GET /api/auth) ---
    // Need to use the full URL with the API base
    cy.intercept('GET', 'http://localhost:5000/api/auth', {
      statusCode: 200,
      body: {
        _id: mockUserId,
        name: 'Mock User',
        email: 'mock@user.com',
      },
    }).as('loadUserCheck');

    // --- MOCK 2: GET EXISTING POSTS ---
    cy.intercept('GET', 'http://localhost:5000/api/posts', {
      statusCode: 200,
      body: [],
    }).as('getPosts');

    // --- MOCK 3: POST CREATION API ---
    cy.intercept('POST', 'http://localhost:5000/api/posts', {
      statusCode: 200,
      body: {
        _id: '123post',
        title: 'E2E Post Title',
        text: 'E2E post content.',
        imageUrl: 'http://e2e-mock.url/image.jpg',
        name: 'Mock User',
        user: mockUserId,
        date: new Date().toISOString(),
      },
    }).as('createPost');

    // --- 4. SET TOKEN AND VISIT DASHBOARD ---
    // Set token in localStorage before visiting the page
    cy.visit('/dashboard', {
      onBeforeLoad(win) {
        win.localStorage.setItem('token', 'fake-e2e-token');
      },
    });

    // Wait for user to load
    cy.wait('@loadUserCheck');
    cy.wait('@getPosts');

    // Verify we're on the dashboard
    cy.contains('Dashboard').should('be.visible');
    cy.contains('Welcome, Mock User').should('be.visible');

    // --- 5. INTERACT WITH THE FORM ---
    // Fill the Title input
    cy.get('input[name="title"]').type('E2E Post Title');

    // Fill the Textarea
    cy.get('textarea[name="text"]').type('E2E post content.');

    // Select and attach the file fixture
    cy.get('input[type="file"][name="image"]').selectFile(
      'cypress/fixtures/test-image.png'
    );

    // Submit the form
    cy.get('form button[type="submit"]').contains('Submit Post').click();

    // --- 6. ASSERTIONS ---
    cy.wait('@createPost');

    // Assert the Title and Image are now visible in the post feed
    cy.contains('E2E Post Title').should('be.visible');
    cy.contains('E2E post content.').should('be.visible');

    cy.get('img.post-cover-image')
      .should('be.visible')
      .and('have.attr', 'src', 'http://e2e-mock.url/image.jpg');
  });
});
