describe("APITypes", () => {
  beforeEach(() => {
    cy.setup("IDE", "SEED", "LOCAL");
    cy.fixture("PROJECTS/LOCAL/project.json").as("project");
    cy.wrap("3450f289-0fc5-45e9-9a4a-606c0a63cdfe").as("projectId");
    cy.get("@projectId").then((projectId) => {
      cy.visit(`/${projectId}/api?mode=local`);
    });
  });

  it("displays TS class", () => {
    cy.waitEvent("CONTAINER_LOADED").then(() => {
      cy.getBySel("edit-api-button").click();
      cy.getBySel("types-button").click();
      cy.getBySel("api-types").should("be.visible");
      cy.getBySel("type-schema-editor").should("be.visible");

      cy.get('[data-cy^="typescript-item-"]').should("exist");
    });
  });

  it("adds type", () => {
    cy.waitEvent("CONTAINER_LOADED").then(() => {
      cy.getBySel("edit-api-button").click();
      cy.getBySel("types-button").click();
      cy.getBySel("api-types").should("be.visible");

      cy.getBySel("add-type-button").click();

      cy.getBySel("type-name-input").should("be.visible");
      const newTypeName = "NewType";
      cy.getBySel("type-name-input").type(newTypeName);
      cy.getBySel("confirm-type-button").click();

      cy.getBySel("type-list").should("contain", newTypeName);
    });
  });

  it("updates type", () => {
    cy.waitEvent("CONTAINER_LOADED").then(() => {
      cy.getBySel("edit-api-button").click();
      cy.getBySel("types-button").click();
      cy.getBySel("api-types").should("be.visible");

      cy.getBySel("add-type-button").click();

      cy.getBySel("type-name-input").should("be.visible");
      const newTypeName = "NewType";
      cy.getBySel("type-name-input").type(newTypeName);
      cy.getBySel("confirm-type-button").click();

      cy.getBySel(`type-list-item-${newTypeName}`).click();

      // Click on the edit button for the selected type
      cy.getBySel(`type-item-actions-${newTypeName}`).click();
      cy.getBySel(`edit-type-button-${newTypeName}`).click();

      // Wait for the type editor to be visible
      cy.getBySel("type-name-input").should("be.visible");

      // Enter the updated type name
      const updatedTypeName = "UpdatedType";
      cy.getBySel("type-name-input").clear().type(updatedTypeName);
      cy.getBySel("confirm-type-button").click();

      // Assert that the type name is updated in the type list
      cy.getBySel("type-list").should("not.contain", newTypeName);
      cy.getBySel("type-list").should("contain", updatedTypeName);
    });
  });

  it("deletes type", () => {
    cy.waitEvent("CONTAINER_LOADED").then(() => {
      cy.getBySel("edit-api-button").click();
      cy.getBySel("types-button").click();
      cy.getBySel("api-types").should("be.visible");

      // Add a new type to delete
      cy.getBySel("add-type-button").click();
      cy.getBySel("type-name-input").should("be.visible");
      const typeToDelete = "TypeToDelete";
      cy.getBySel("type-name-input").type(typeToDelete);
      cy.getBySel("confirm-type-button").click();

      // Select the type to delete
      cy.getBySel(`type-list-item-${typeToDelete}`).click();

      // Click on the delete button for the selected type
      cy.getBySel(`type-item-actions-${typeToDelete}`).click();
      cy.getBySel(`delete-type-button-${typeToDelete}`).click();
      // Assert that the type is deleted from the type list
      cy.getBySel("type-list").should("not.contain", typeToDelete);

      // Assert that the type is not selected anymore
      cy.getBySel(`type-list-item-${typeToDelete}`).should("not.exist");
    });
  });
});
