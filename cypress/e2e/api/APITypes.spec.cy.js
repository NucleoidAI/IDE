describe("APITypes", () => {
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

  it("displays TS class", () => {
    cy.getBySel("types-button").click();
    cy.getBySel("api-types").should("be.visible");
    cy.getBySel("type-schema-editor").should("be.visible");

    cy.get('[data-cy^="typescript-item-"]').should("exist");
  });

  it("adds type", () => {
    cy.getBySel("types-button").click();
    cy.getBySel("api-types").should("be.visible");

    cy.getBySel("add-type-button").click();
    cy.getBySel("type-name-input").should("be.visible");

    const newTypeName = "NewType";
    cy.getBySel("type-name-input").type(newTypeName);
    cy.getBySel("confirm-type-button").click();

    cy.getBySel("type-list").should("contain", newTypeName);
  });

  it("updates type", () => {
    const newTypeName = "NewType";
    const updatedTypeName = "UpdatedType";

    cy.getBySel("types-button").click();
    cy.getBySel("api-types").should("be.visible");

    cy.getBySel("add-type-button").click();
    cy.getBySel("type-name-input").should("be.visible").type(newTypeName);
    cy.getBySel("confirm-type-button").click();

    cy.getBySel(`type-list-item-${newTypeName}`).click();
    cy.getBySel(`type-item-actions-${newTypeName}`).click();
    cy.getBySel(`edit-type-button-${newTypeName}`).click();

    cy.getBySel("type-name-input").clear();
    cy.getBySel("type-name-input").type(updatedTypeName);

    cy.getBySel("confirm-type-button").click();

    cy.getBySel("type-list").should("not.contain", newTypeName);
    cy.getBySel("type-list").should("contain", updatedTypeName);
  });

  it("deletes type", () => {
    const typeToDelete = "TypeToDelete";

    cy.getBySel("types-button").click();
    cy.getBySel("api-types").should("be.visible");

    cy.getBySel("add-type-button").click();
    cy.getBySel("type-name-input").should("be.visible").type(typeToDelete);
    cy.getBySel("confirm-type-button").click();

    cy.getBySel(`type-list-item-${typeToDelete}`).click();
    cy.getBySel(`type-item-actions-${typeToDelete}`).click();
    cy.getBySel(`delete-type-button-${typeToDelete}`).click();

    cy.getBySel("type-list").should("not.contain", typeToDelete);
    cy.getBySel(`type-list-item-${typeToDelete}`).should("not.exist");
  });
});
