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

    it("should edit properties in body and save correctly", () => {
      // Test editing properties in the body tab and saving
      // ...
    });

    it("should add and edit param and save it", () => {
      // Test adding and editing a param and saving
      // ...
    });

    it("should add and edit new types", () => {
      // Test adding and editing new types
      // ...
    });
  });

  describe("Add Mode: Method", () => {
    beforeEach(() => {
      // Open the APIDialog in add mode for method
      cy.get("@projectId").then((projectId) => {
        cy.visit(`/${projectId}/api?mode=local`);
      });
      cy.waitEvent("CONTAINER_LOADED").then(() => {
        // Simulate opening the APIDialog in add mode for method
        // ...
      });
    });

    it("should allow choosing between available methods and add new method", () => {
      // Test choosing available methods and adding a new method
      // ...
    });
  });

  describe("Add Mode: Resource", () => {
    beforeEach(() => {
      // Open the APIDialog in add mode for resource
      cy.get("@projectId").then((projectId) => {
        cy.visit(`/${projectId}/api?mode=local`);
      });
      cy.waitEvent("CONTAINER_LOADED").then(() => {
        // Simulate opening the APIDialog in add mode for resource
        // ...
      });
    });

    it("should allow adding a new resource", () => {
      // Test adding a new resource
      // ...
    });

    it("should disable the save button when inputting an invalid path", () => {
      // Test disabling the save button when the path is invalid
      // ...
    });
  });
});
