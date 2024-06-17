describe("Side Chat", () => {
  describe("creates a project by default", () => {
    beforeEach(() => {
      cy.setup("IDE", "SEED", "LOCAL");
      cy.fixture("PROJECTS/LOCAL/project.json").as("project");
      cy.wrap("3450f289-0fc5-45e9-9a4a-606c0a63cdfe").as("projectId");
    });
    it("should create and save a new session when side chat is opened", () => {
      cy.get("@projectId").then((projectId) => {
        cy.visit(`/${projectId}/api?mode=local`);
      });

      cy.waitEvent("CONTAINER_LOADED").then(() => {
        cy.getBySel("side-chat-button").click();

        cy.getBySel("chat-welcome-message").should("to.visible");

        cy.sendMessage("hello", "MESSAGES/hello");

        const expectedRespnse =
          '"Nucleoid Chat" is a platform specifically designed for posing and discussing formal logic questions. Nucleoid Runtime is a software system that executes and manages logical rules and inferences.';

        cy.checkMessageResponse("ASSISTANT", expectedRespnse, 2, false, "last");

        cy.get("@projectId").then((id) => {
          cy.storageGet(`ide.chat.sessions.${id}`).then((session) => {
            expect(session.messages[0]).to.deep.equal({
              role: "USER",
              content: "hello",
            });
            expect(session.messages[1]).to.deep.equal({
              role: "ASSISTANT",
              type: "EXCLAMATORY",
              content: expectedRespnse,
            });
          });
        });
      });
    });
  });

  describe("creates a project by chat", () => {
    beforeEach(() => {
      cy.setup("IDE", "SEED", "LOCAL");
      cy.fixture("PROJECTS/LOCAL/project.json").as("project");
      cy.wrap("3450f289-0fc5-45e9-9a4a-606c0a63cdfe").as("projectId");
      cy.fixture("CHAT/chat-data.json").then((session) => {
        cy.get("@projectId").then((id) => {
          session.id = id;
          cy.storageSet(`ide.chat.sessions.${id}`, session);
          cy.visit(`/${id}/api?mode=local`);
        });
      });
    });
    it("should load old messages when side chat is opened", () => {
      cy.waitEvent("CONTAINER_LOADED").then(() => {
        cy.getBySel("side-chat-button").click();

        cy.getBySel("chat-welcome-message").should("to.not.exist");

        cy.checkMessageResponse(
          "ASSISTANT",
          "Set the mortality property of all Human instances to true.",
          3,
          false,
          "last"
        );
      });
    });
  });
});
