describe("ChatWidget", () => {
  beforeEach(() => {
    cy.visit("/ide/chat");
  });

  it("should send a message and display it in the chat", () => {
    cy.get('[data-cy="message-input"]').type("Hello, Cypress!");
    cy.get('[data-cy="send-button"]').click();
    cy.get('[data-cy="message-box"]')
      .should("have.length.at.least", 1)
      .last()
      .within(() => {
        cy.get('[data-cy="message-role"]').should("have.text", "USER");
        cy.get('[data-cy="message-content"]').should(
          "have.text",
          "Hello, Cypress!"
        );
      });
  });

  it("should send a message when clicking on a suggestion", () => {
    cy.get('[data-cy="suggestions-overlay"]').should("be.visible");
    cy.get('[data-cy^="suggestion-button-"]')
      .should("have.length.at.least", 1)
      .first()
      .within(() => {
        cy.get('[data-cy="suggestion-summary"]')
          .invoke("text")
          .then((text) => {
            cy.wrap(text.trim()).as("suggestionText");
          });
      });

    cy.get('[data-cy^="suggestion-button-"]').first().click();

    cy.get('[data-cy="message-box"]')
      .should("have.length.at.least", 1)
      .last()
      .within(() => {
        cy.get('[data-cy="message-role"]').should("have.text", "USER");
        cy.get('[data-cy="message-content"]').then(($messageContent) => {
          cy.get("@suggestionText").then((suggestionText) => {
            expect($messageContent.text().trim()).to.equal(suggestionText);
          });
        });
      });
  });
});
