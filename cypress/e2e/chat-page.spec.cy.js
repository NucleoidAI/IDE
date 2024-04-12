describe("ChatWidget", () => {
  beforeEach(() => {
    cy.visit("/ide/chat");
  });

  it("should send a message and display it in the chat", () => {
    cy.get(".MuiTextField-root").type("Hello, Cypress!");

    cy.get('button[type="submit"]').click();

    cy.get('[data-testid="message-box"]')
      .should("have.length.at.least", 1)
      .last()
      .within(() => {
        cy.get('[data-testid="message-role"]').should("have.text", "USER");
        cy.get('[data-testid="message-content"]').should(
          "have.text",
          "Hello, Cypress!"
        );
      });
  });

  it("should send a message when clicking on a suggestion", () => {
    cy.get('[data-testid="suggestions-overlay"]').should("be.visible");

    cy.get('[data-testid^="suggestion-button-"]')
      .should("have.length.at.least", 1)
      .first()
      .within(() => {
        cy.get('[data-testid="suggestion-summary"]')
          .invoke("text")
          .then((text) => {
            cy.wrap(text.trim()).as("suggestionText");
          });
      });

    // Click on the first suggestion
    cy.get('[data-testid^="suggestion-button-"]').first().click();

    // Wait for the message to appear in the chat display
    cy.get('[data-testid="message-box"]')
      .should("have.length.at.least", 1)
      .last()
      .within(() => {
        cy.get('[data-testid="message-role"]').should("have.text", "USER");
        cy.get('[data-testid="message-content"]').then(($messageContent) => {
          cy.get("@suggestionText").then((suggestionText) => {
            expect($messageContent.text().trim()).to.equal(suggestionText);
          });
        });
      });
  });
});
