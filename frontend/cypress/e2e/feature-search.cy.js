describe('Feature: Full-Text Search', () => {
  it('allows a user to type in the navbar search, press Enter, and see results', () => {
    // 1. Mock the (not-yet-created) search API endpoint
    const searchQuery = 'pipeline';
    cy.intercept(
      'GET',
      `/api/search?q=${searchQuery}`, // This is the route we will build
      {
        statusCode: 200,
        body: [
          {
            _id: 'post1',
            title: 'My first post about a pipeline',
            text: 'This is the content for the first post.',
          },
          {
            _id: 'post2',
            title: 'My second post about a pipeline',
            text: 'This is the content for the second post.',
          },
        ],
      }
    ).as('searchRequest');

    // 2. Visit the main page
    cy.visit('/'); // Or any page where the Navbar is visible

    // --- THIS SECTION WILL FAIL (RED PHASE) ---

    // 3. Find the (not-yet-created) search bar in the navbar
    cy.get('input[name="search"]').type(searchQuery);

    // 4. Press Enter to submit
    cy.get('input[name="search"]').type('{enter}');

    // --- END OF FAILING SECTION ---

    // 5. Assert: The URL should change to the search results page
    cy.url().should('include', `/search?q=${searchQuery}`);

    // 6. Assert: The API call was made
    cy.wait('@searchRequest');

    // 7. Assert: The results are visible on the new page
    cy.contains('Search Results for "pipeline"').should('be.visible');
    cy.contains('My first post about a pipeline').should('be.visible');
    cy.contains('My second post about a pipeline').should('be.visible');
  });
});
