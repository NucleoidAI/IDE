describe("SchemaEditor", () => {
  beforeEach(() => {
    cy.setup("IDE", "SEED", "LOCAL");
    cy.fixture("PROJECTS/LOCAL/project.json").as("project");
    cy.wrap("3450f289-0fc5-45e9-9a4a-606c0a63cdfe").as("projectId");

    cy.get("@projectId").then((projectId) => {
      cy.visit(`/${projectId}/api?mode=local`);
    });

    cy.waitEvent("CONTAINER_LOADED");
    cy.openAPIDialog("EDIT");
  });

  it("adds string/number to root object", () => {
    cy.getBySel("response-schema-editor")
      .find("[data-cy^='property-type-select-']")
      .then(($properties) => {
        const initialPropertyCount = $properties.length;

        cy.schemaEditorAddProperty();
        cy.schemaEditorAddProperty();

        cy.schemaEditorEditType(initialPropertyCount, "number");
        cy.schemaEditorEditType(initialPropertyCount + 1, "string");

        cy.getBySel("save-api-button").click();
        cy.openAPIDialog("EDIT");

        cy.schemaEditorVerifyType(initialPropertyCount, "number");
        cy.schemaEditorVerifyType(initialPropertyCount + 1, "string");
      });
  });

  it("adds TS type to root object", () => {
    cy.getBySel("response-schema-editor")
      .find("[data-cy^='property-type-select-']")
      .then(($properties) => {
        const initialPropertyCount = $properties.length;

        cy.schemaEditorAddProperty();

        cy.schemaEditorEditType(initialPropertyCount, "Order");

        cy.getBySel("save-api-button").click();
        cy.openAPIDialog("EDIT");

        cy.schemaEditorVerifyType(initialPropertyCount, "Order");
      });
  });

  it("adds TS type to root array", () => {
    cy.schemaEditorEditType(0, "array");
    cy.schemaEditorEditType(1, "Order");

    cy.getBySel("save-api-button").click();
    cy.openAPIDialog("EDIT");

    cy.schemaEditorVerifyType(0, "array");
    cy.schemaEditorVerifyType(1, "Order");
  });

  it("adds string/number to root array", () => {
    cy.schemaEditorEditType(0, "array");
    cy.schemaEditorEditType(1, "number");

    cy.getBySel("save-api-button").click();
    cy.openAPIDialog("EDIT");

    cy.schemaEditorVerifyType(0, "array");
    cy.schemaEditorVerifyType(1, "number");
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
    cy.schemaEditorAddProperty();
    cy.schemaEditorEditType(1, "object");

    cy.schemaEditorAddProperty(1);

    cy.getBySel("response-schema-editor")
      .find("[data-cy='expand-icon']")
      .first()
      .click();

    cy.schemaEditorEditType(2, "number");

    cy.getBySel("save-api-button").click();
    cy.openAPIDialog("EDIT");

    cy.getBySel("response-schema-editor")
      .find("[data-cy='expand-icon']")
      .first()
      .click();

    cy.schemaEditorVerifyType(2, "number");
  });

  it("adds array to nested object", () => {
    cy.schemaEditorAddProperty();
    cy.schemaEditorEditType(1, "object");

    cy.schemaEditorAddProperty(1);

    cy.getBySel("response-schema-editor")
      .find("[data-cy='expand-icon']")
      .first()
      .click();

    cy.schemaEditorEditType(2, "array");

    cy.getBySel("save-api-button").click();
    cy.openAPIDialog("EDIT");

    cy.getBySel("response-schema-editor")
      .find("[data-cy='expand-icon']")
      .first()
      .click();

    cy.schemaEditorVerifyType(2, "array");
  });

  it("adds TS type to nested object", () => {
    cy.schemaEditorAddProperty();
    cy.schemaEditorEditType(1, "object");

    cy.schemaEditorAddProperty(1);

    cy.getBySel("response-schema-editor")
      .find("[data-cy='expand-icon']")
      .first()
      .click();

    cy.schemaEditorEditType(2, "Order");

    cy.getBySel("save-api-button").click();
    cy.openAPIDialog("EDIT");

    cy.getBySel("response-schema-editor")
      .find("[data-cy='expand-icon']")
      .first()
      .click();

    cy.schemaEditorVerifyType(2, "Order");
  });

  it.only("adds TS type to nested array", () => {
    cy.schemaEditorAddProperty();
    cy.schemaEditorEditType(1, "array");

    cy.getBySel("response-schema-editor")
      .find("[data-cy='expand-icon']")
      .first()
      .click();

    cy.schemaEditorEditType(2, "Order");

    cy.getBySel("save-api-button").click();
    cy.openAPIDialog("EDIT");

    cy.getBySel("response-schema-editor")
      .find("[data-cy='expand-icon']")
      .first()
      .click();

    cy.schemaEditorVerifyType(2, "Order");
  });
});
