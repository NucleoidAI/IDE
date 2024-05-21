describe("APIDialog", () => {
  beforeEach(() => {
    cy.setup("IDE", "SEED", "LOCAL");
    cy.fixture("PROJECTS/LOCAL/project.json").as("project");
    cy.wrap("3450f289-0fc5-45e9-9a4a-606c0a63cdfe").as("projectId");
  });

  describe("Edit Mode", () => {
    beforeEach(() => {
      cy.get("@projectId").then((projectId) => {
        cy.visit(`/${projectId}/api?mode=local`);
      });
      cy.waitEvent("CONTAINER_LOADED").then(() => {
        cy.getBySel("edit-api-button").click();
      });
    });

    it("should navigate between params, body, and types", () => {
      cy.getBySel("api-body").should("be.visible");
      cy.getBySel("params-toggle").click();
      cy.getBySel("api-params").should("be.visible");
      cy.getBySel("types-button").click();
      cy.getBySel("api-types").should("be.visible");
    });
  });

  describe("Add Mode: Method", () => {
    beforeEach(() => {
      cy.get("@projectId").then((projectId) => {
        cy.visit(`/${projectId}/api?mode=local`);
      });
      cy.waitEvent("CONTAINER_LOADED").then(() => {
        cy.getBySel("resource-menu").click();
        cy.getBySel("add-method").click();
      });
    });

    it("should open dialog in add method mode", () => {
      cy.getBySel("method-select").should("be.visible");
    });
  });

  describe("Add Mode: Resource", () => {
    beforeEach(() => {
      cy.get("@projectId").then((projectId) => {
        cy.visit(`/${projectId}/api?mode=local`);
      });
      cy.waitEvent("CONTAINER_LOADED").then(() => {
        cy.getBySel("resource-menu").click();
        cy.getBySel("add-resource").click();
      });
    });

    it("should open dialog in add resource mode", () => {
      cy.getBySel("path-input").should("be.visible");
    });
  });
});
