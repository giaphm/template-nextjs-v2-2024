describe("Navigation", () => {
  it("should navigate to the login page", () => {
    // Start from the index page
    cy.visit("http://localhost:3000/")

    // Find a link with an href attribute containing "login" in the second button and click it
    cy.get('a[href*="login"]').eq(1).click()

    // The new url should include "/login"
    cy.url().should("include", "/login")

    // The new page should contain an h1 with "Login"
    cy.get("h1").contains("Log in")
  })
})
