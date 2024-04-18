describe("ChatWidget", () => {
  beforeEach(() => {
    cy.setup("CHAT", "SEED");
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
    //eslint-disable-next-line
    cy.wait(2000);
    cy.checkMessageResponse("ASSISTANT", expectedRespnse, 5, false, "last");
  });

  it("should send a message and receive a response with code", () => {
    cy.sendMessage("define a human", "MESSAGES/define-human");
    //eslint-disable-next-line
    cy.wait(2000);
    cy.checkMessageResponse(
      "ASSISTANT",
      "Define a Human class with a name property and constructor",
      5,
      "class Human",
      "last"
    );
  });

  it("should handle error response", () => {
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
    cy.fixture("MESSAGES/hello").then((hello) => {
      cy.fixture("MESSAGES/define-human").then((defineHuman) => {
        cy.intercept("POST", "/ide/api/expert/chat/sessions/*", (req) => {
          if (req.body.content === "hello") {
            req.reply({
              statusCode: 200,
              body: hello,
            });
          } else if (req.body.content === "define a human") {
            req.reply({
              statusCode: 200,
              body: defineHuman,
            });
          }
        }).as("postMessage");
      });
    });

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
});
