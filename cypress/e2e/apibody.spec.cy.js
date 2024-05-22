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

    it("should edit schema of response and save it", () => {
      cy.getBySel("response-schema-editor")
        .find("[data-cy^='property-type-select-']")
        .then(($properties) => {
          const initialPropertyCount = $properties.length;

          cy.getBySel("response-schema-editor")
            .find("[data-cy^='add-property-button-']")
            .first()
            .click();

          cy.getBySel("response-schema-editor")
            .find("[data-cy^='property-type-select-']")
            .should("have.length", initialPropertyCount + 1);

          cy.getBySel("response-schema-editor")
            .find("[data-cy^='property-name-field-']")
            .eq(1)
            .clear()
            .type("test");

          cy.getBySel("response-schema-editor")
            .find("[data-cy^='property-type-select-']")
            .eq(1)
            .click();

          cy.getBySel("property-type-option-number").click();

          cy.getBySel("save-api-button").click();
          cy.getBySel("edit-api-button").click();

          cy.getBySel("response-schema-editor")
            .find("[data-cy^='property-type-select-']")
            .should("have.length", initialPropertyCount + 1);

          cy.getBySel("response-schema-editor")
            .find("[data-cy^='property-name-field-']")
            .eq(1)
            .find("input")
            .should("have.value", "test");

          cy.getBySel("response-schema-editor")
            .find("[data-cy^='property-type-select-']")
            .eq(1)
            .should("contain", "number");
        });
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
