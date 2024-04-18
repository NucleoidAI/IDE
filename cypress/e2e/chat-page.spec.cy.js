describe("ChatWidget", () => {
  beforeEach(() => {
    cy.setup("CHAT");
  });

  it("should display the initial chat messages from seed data", () => {
    cy.getBySel("message-box").should("have.length", 4);
    cy.getBySel("message-box")
      .eq(0)
      .within(() => {
        cy.getBySel("message-role").should("have.text", "USER");
        cy.getBySel("message-content").should("have.text", "define a human");
      });
    cy.getBySel("message-box")
      .eq(1)
      .within(() => {
        cy.getBySel("message-role").should("have.text", "ASSISTANT");
        cy.getBySel("message-content").should(
          "have.text",
          "Define a Human class with a name property and constructor"
        );
        cy.getBySel("code-block").should("contain.text", "class Human");
      });
    cy.getBySel("message-box")
      .eq(2)
      .within(() => {
        cy.getBySel("message-role").should("have.text", "USER");
        cy.getBySel("message-content").should(
          "have.text",
          "all humans are mortals"
        );
      });
    cy.getBySel("message-box")
      .eq(3)
      .within(() => {
        cy.getBySel("message-role").should("have.text", "ASSISTANT");
        cy.getBySel("message-content").should(
          "have.text",
          "Set the mortality property of all Human instances to true."
        );
        cy.getBySel("code-block").should(
          "contain.text",
          "$Human.mortal = true;"
        );
      });
  });

  it("should send a message and receive a response without code", () => {
    cy.sendMessage("hello", "MESSAGES/hello");
    const expectedRespnse =
      '"Nucleoid Chat" is a platform specifically designed for posing and discussing formal logic questions. Nucleoid Runtime is a software system that executes and manages logical rules and inferences.';

    cy.checkMessageResponse("ASSISTANT", expectedRespnse, 5);
  });

  it("should send a message and receive a response with code", () => {
    cy.sendMessage("define a human", "MESSAGES/define-human");

    cy.checkMessageResponse(
      "ASSISTANT",
      "Define a Human class with a name property and constructor",
      5,
      "class Human",
      "last"
    );
  });

  it.only("should handle error response", () => {
    cy.intercept("POST", "/ide/api/expert/chat/sessions/*", (req) => {
      if (req.body.content === "trigger error") {
        req.reply({
          statusCode: 400,
          fixture: "MESSAGES/error",
        });
      }
    }).as("postMessage");

    cy.getBySel("message-input").type("trigger error");
    cy.getBySel("send-button").click();

    cy.wait("@postMessage");

    cy.getBySel("error-message").should("be.visible");
    cy.getBySel("error-title").should("have.text", "EXPERT ERROR");
    cy.getBySel("error-type").should("have.text", "CONVERSION_FAILED");
    cy.getBySel("error-content").should("contain.text", "class Human");
    cy.getBySel("error-content").should("contain.text", "user1.mortal");
  });

  it("should send multiple messages and receive responses", () => {
    cy.sendMessage("hello", "MESSAGES/hello");
    cy.sendMessage("define a human", "MESSAGES/define-human");

    const expectedResponse =
      '"Nucleoid Chat" is a platform specifically designed for posing and discussing formal logic questions. Nucleoid Runtime is a software system that executes and manages logical rules and inferences.';

    cy.checkMessageResponse("ASSISTANT", expectedResponse, 8, false, 5);
    cy.checkMessageResponse(
      "ASSISTANT",
      "Define a Human class with a name property and constructor",
      8,
      "class Human",
      7
    );
  });

  it("should handle suggestions and update the overlay", () => {
    cy.storageSet(
      `ide.chat.sessions.${seedData.emptyChatData.id}`,
      seedData.emptyChatData
    );
    cy.visit(`/ide/chat/${seedData.emptyChatData.id}`);

    cy.intercept("POST", "/ide/api/expert/chat/sessions/*", (req) => {
      if (req.body.content === "Option 1") {
        req.reply({
          statusCode: 200,
          body: {
            role: "ASSISTANT",
            content: "You selected Option 1",
          },
        });
      } else if (req.body.content === "Option 1.1") {
        req.reply({
          statusCode: 200,
          body: {
            role: "ASSISTANT",
            content: "You selected Option 1.1",
          },
        });
      }
    }).as("postMessage");

    cy.getBySel("suggestions-overlay").should("be.visible");

    cy.getBySel("suggestion-button-0")
      .find('[data-cy="suggestion-summary"]')
      .invoke("text")
      .then((firstSuggestionSummary) => {
        cy.getBySel("suggestion-button-0").click();
        cy.wait("@postMessage");

        cy.getBySel("message-box")
          .should("have.length.at.least", 2)
          .eq(-2)
          .within(() => {
            cy.getBySel("message-role").should("have.text", "USER");
            cy.getBySel("message-content").should(
              "have.text",
              firstSuggestionSummary
            );
          });

        cy.getBySel("suggestion-button-0")
          .find('[data-cy="suggestion-summary"]')
          .invoke("text")
          .then((secondSuggestionSummary) => {
            cy.getBySel("suggestion-button-0").click();
            cy.wait("@postMessage");

            cy.getBySel("message-box")
              .should("have.length.at.least", 4)
              .eq(-2)
              .within(() => {
                cy.getBySel("message-role").should("have.text", "USER");
                cy.getBySel("message-content").should(
                  "have.text",
                  secondSuggestionSummary
                );
              });

            cy.getBySel("message-box").should("have.length", 4);
          });
      });
  });
});
