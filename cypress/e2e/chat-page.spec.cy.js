let seedData;
let messages;

before(() => {
  cy.fixture("seedData").then((data) => {
    seedData = data;
  });
  cy.fixture("messages").then((data) => {
    messages = data;
  });
});

describe("ChatWidget", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.storageSet(
      `ide.chat.sessions.${seedData.chatData.id}`,
      seedData.chatData
    );
    cy.visit(`/ide/chat/${seedData.chatData.id}`);
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
    cy.intercept("POST", "/ide/api/expert/chat/sessions/*", (req) => {
      if (req.body.content === "hello") {
        req.reply({
          statusCode: 200,
          body: messages.helloMessage,
        });
      }
    }).as("postMessage");

    cy.getBySel("message-input").type("hello");
    cy.getBySel("send-button").click();

    cy.wait("@postMessage");

    cy.getBySel("message-box")
      .should("have.length.at.least", 5)
      .last()
      .within(() => {
        cy.getBySel("message-role").should("have.text", "ASSISTANT");
        cy.getBySel("message-content").should(
          "have.text",
          '"Nucleoid Chat" is a platform specifically designed for posing and discussing formal logic questions. Nucleoid Runtime is a software system that executes and manages logical rules and inferences.'
        );
      });
  });

  it("should send a message and receive a response with code", () => {
    cy.intercept("POST", "/ide/api/expert/chat/sessions/*", (req) => {
      if (req.body.content === "define a human") {
        req.reply({
          statusCode: 200,
          body: messages.defineHumanMessage,
        });
      }
    }).as("postMessage");

    cy.getBySel("message-input").type("define a human");
    cy.getBySel("send-button").click();

    cy.wait("@postMessage");

    cy.getBySel("message-box")
      .should("have.length.at.least", 5)
      .last()
      .within(() => {
        cy.getBySel("message-role").should("have.text", "ASSISTANT");
        cy.getBySel("message-content").should(
          "have.text",
          "Define a Human class with a name property and constructor"
        );
        cy.getBySel("code-block").should("contain.text", "class Human");
      });
  });

  it("should handle error response", () => {
    cy.intercept("POST", "/ide/api/expert/chat/sessions/*", (req) => {
      if (req.body.content === "trigger error") {
        req.reply({
          statusCode: 400,
          body: messages.errorMessage,
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
    cy.intercept("POST", "/ide/api/expert/chat/sessions/*", (req) => {
      if (req.body.content === "hello") {
        req.reply({
          statusCode: 200,
          body: messages.helloMessage,
        });
      } else if (req.body.content === "define a human") {
        req.reply({
          statusCode: 200,
          body: messages.defineHumanMessage,
        });
      }
    }).as("postMessage");

    cy.getBySel("message-input").type("hello");
    cy.getBySel("send-button").click();
    cy.wait("@postMessage");

    cy.getBySel("message-input").type("define a human");
    cy.getBySel("send-button").click();
    cy.wait("@postMessage");

    cy.getBySel("message-box")
      .should("have.length.at.least", 8)
      .eq(5)
      .within(() => {
        cy.getBySel("message-role").should("have.text", "ASSISTANT");
        cy.getBySel("message-content").should(
          "have.text",
          '"Nucleoid Chat" is a platform specifically designed for posing and discussing formal logic questions. Nucleoid Runtime is a software system that executes and manages logical rules and inferences.'
        );
      });

    cy.getBySel("message-box")
      .eq(7)
      .within(() => {
        cy.getBySel("message-role").should("have.text", "ASSISTANT");
        cy.getBySel("message-content").should(
          "have.text",
          "Define a Human class with a name property and constructor"
        );
        cy.getBySel("code-block").should("contain.text", "class Human");
      });
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
