describe("SchemaEditor", () => {
  beforeEach(() => {
    cy.setup("IDE", "SEED", "LOCAL");
    cy.fixture("PROJECTS/LOCAL/project.json").as("project");
    cy.wrap("3450f289-0fc5-45e9-9a4a-606c0a63cdfe").as("projectId");

    cy.get("@projectId").then((projectId) => {
      cy.visit(`/${projectId}/api?mode=local`);
    });

    cy.waitEvent("CONTAINER_LOADED").then(() => {
      cy.getBySel("edit-api-button").click();
    });
  });

  it("adds string/number to root object", () => {
    cy.getBySel("response-schema-editor")
      .find("[data-cy^='property-type-select-']")
      .then(($properties) => {
        const initialPropertyCount = $properties.length;

        cy.getBySel("response-schema-editor")
          .find("[data-cy^='add-property-button-']")
          .first()
          .click()
          .click();

        cy.getBySel("response-schema-editor")
          .find("[data-cy^='property-type-select-']")
          .eq(initialPropertyCount)
          .click();
        cy.getBySel("property-type-option-number").click();

        cy.getBySel("response-schema-editor")
          .find("[data-cy^='property-type-select-']")
          .eq(initialPropertyCount + 1)
          .click();
        cy.getBySel("property-type-option-string").click();

        cy.getBySel("save-api-button").click();
        cy.getBySel("edit-api-button").click();

        cy.getBySel("response-schema-editor")
          .find("[data-cy^='property-type-select-']")
          .eq(initialPropertyCount)
          .should("contain", "number");
        cy.getBySel("response-schema-editor")
          .find("[data-cy^='property-type-select-']")
          .eq(initialPropertyCount + 1)
          .should("contain", "string");
      });
  });

  it("adds TS type to root object", () => {
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
          .eq(initialPropertyCount)
          .click();
        cy.getBySel("property-type-option-Order").click();

        cy.getBySel("save-api-button").click();
        cy.getBySel("edit-api-button").click();

        cy.getBySel("response-schema-editor")
          .find("[data-cy^='property-type-select-']")
          .eq(initialPropertyCount)
          .should("contain", "Order");
      });
  });

  it("adds TS type to root array", () => {
    cy.getBySel("response-schema-editor")
      .find("[data-cy^='property-type-select-']")
      .first()
      .click();
    cy.getBySel("property-type-option-array").click();

    cy.getBySel("response-schema-editor")
      .find("[data-cy^='property-type-select-']")
      .eq(1)
      .click();
    cy.getBySel("property-type-option-Order").click();

    cy.getBySel("save-api-button").click();
    cy.getBySel("edit-api-button").click();

    cy.getBySel("response-schema-editor")
      .find("[data-cy^='property-type-select-']")
      .first()
      .should("contain", "array");
    cy.getBySel("response-schema-editor")
      .find("[data-cy^='property-type-select-']")
      .eq(1)
      .should("contain", "Order");
  });

  it("adds string/number to root array", () => {
    cy.getBySel("response-schema-editor")
      .find("[data-cy^='property-type-select-']")
      .first()
      .click();
    cy.getBySel("property-type-option-array").click();

    cy.getBySel("response-schema-editor")
      .find("[data-cy^='property-type-select-']")
      .eq(1)
      .click();
    cy.getBySel("property-type-option-number").click();

    cy.getBySel("save-api-button").click();
    cy.getBySel("edit-api-button").click();

    cy.getBySel("response-schema-editor")
      .find("[data-cy^='property-type-select-']")
      .first()
      .should("contain", "array");
    cy.getBySel("response-schema-editor")
      .find("[data-cy^='property-type-select-']")
      .eq(1)
      .should("contain", "number");
  });

  it("prevents choosing string/number as root object", () => {
    cy.getBySel("response-schema-editor")
      .find("[data-cy^='property-type-select-']")
      .first()
      .click();

    cy.getBySel("property-type-option-string").should("not.exist");
    cy.getBySel("property-type-option-number").should("not.exist");
  });

  it("adds string/number to nested object", () => {
    cy.getBySel("response-schema-editor")
      .find("[data-cy^='add-property-button-']")
      .first()
      .click();

    cy.getBySel("response-schema-editor")
      .find("[data-cy^='property-type-select-']")
      .eq(1)
      .click();
    cy.getBySel("property-type-option-object").click();

    cy.getBySel("response-schema-editor")
      .find("[data-cy^='add-property-button-']")
      .eq(1)
      .click();

    cy.getBySel("response-schema-editor")
      .find("[data-cy='expand-icon']")
      .first()
      .click();

    cy.getBySel("response-schema-editor")
      .find("[data-cy^='property-type-select-']")
      .eq(2)
      .click();
    cy.getBySel("property-type-option-number").click();

    cy.getBySel("save-api-button").click();
    cy.getBySel("edit-api-button").click();

    cy.getBySel("response-schema-editor")
      .find("[data-cy='expand-icon']")
      .first()
      .click();

    cy.getBySel("response-schema-editor")
      .find("[data-cy^='property-type-select-']")
      .eq(2)
      .should("contain", "number");
  });

  it("adds array to nested object", () => {
    cy.getBySel("response-schema-editor")
      .find("[data-cy^='add-property-button-']")
      .first()
      .click();

    cy.getBySel("response-schema-editor")
      .find("[data-cy^='property-type-select-']")
      .eq(1)
      .click();
    cy.getBySel("property-type-option-object").click();

    cy.getBySel("response-schema-editor")
      .find("[data-cy^='add-property-button-']")
      .eq(1)
      .click();

    cy.getBySel("response-schema-editor")
      .find("[data-cy='expand-icon']")
      .first()
      .click();

    cy.getBySel("response-schema-editor")
      .find("[data-cy^='property-type-select-']")
      .eq(2)
      .click();
    cy.getBySel("property-type-option-array").click();

    cy.getBySel("save-api-button").click();
    cy.getBySel("edit-api-button").click();

    cy.getBySel("response-schema-editor")
      .find("[data-cy='expand-icon']")
      .first()
      .click();

    cy.getBySel("response-schema-editor")
      .find("[data-cy^='property-type-select-']")
      .eq(2)
      .should("contain", "array");
  });

  it("adds TS type to nested object", () => {
    cy.getBySel("response-schema-editor")
      .find("[data-cy^='add-property-button-']")
      .first()
      .click();

    cy.getBySel("response-schema-editor")
      .find("[data-cy^='property-type-select-']")
      .eq(1)
      .click();
    cy.getBySel("property-type-option-object").click();

    cy.getBySel("response-schema-editor")
      .find("[data-cy^='add-property-button-']")
      .eq(1)
      .click();

    cy.getBySel("response-schema-editor")
      .find("[data-cy='expand-icon']")
      .first()
      .click();

    cy.getBySel("response-schema-editor")
      .find("[data-cy^='property-type-select-']")
      .eq(2)
      .click();
    cy.getBySel("property-type-option-Order").click();

    cy.getBySel("save-api-button").click();
    cy.getBySel("edit-api-button").click();

    cy.getBySel("response-schema-editor")
      .find("[data-cy='expand-icon']")
      .first()
      .click();

    cy.getBySel("response-schema-editor")
      .find("[data-cy^='property-type-select-']")
      .eq(2)
      .should("contain", "Order");
  });

  it("adds TS type to nested array", () => {
    cy.getBySel("response-schema-editor")
      .find("[data-cy^='add-property-button-']")
      .first()
      .click();

    cy.getBySel("response-schema-editor")
      .find("[data-cy^='property-type-select-']")
      .eq(1)
      .click();
    cy.getBySel("property-type-option-array").click();

    cy.getBySel("response-schema-editor")
      .find("[data-cy='expand-icon']")
      .first()
      .click();

    cy.getBySel("response-schema-editor")
      .find("[data-cy^='property-type-select-']")
      .eq(2)
      .click();
    cy.getBySel("property-type-option-Order").click();

    cy.getBySel("save-api-button").click();
    cy.getBySel("edit-api-button").click();

    cy.getBySel("response-schema-editor")
      .find("[data-cy='expand-icon']")
      .first()
      .click();

    cy.getBySel("response-schema-editor")
      .find("[data-cy^='property-type-select-']")
      .eq(2)
      .should("contain", "Order");
  });
});
