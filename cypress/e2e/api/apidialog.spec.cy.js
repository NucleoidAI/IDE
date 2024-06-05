/* eslint-disable */
describe("APIDialog", () => {
  beforeEach(() => {
    cy.setup("IDE", "SEED", "LOCAL");
    cy.fixture("PROJECTS/LOCAL/project.json").as("project");
    cy.wrap("3450f289-0fc5-45e9-9a4a-606c0a63cdfe").as("projectId");

    cy.get("@projectId").then((projectId) => {
      cy.visit(`/${projectId}/api?mode=local`);
    });

    cy.waitEvent("CONTAINER_LOADED");
  });

  it("navigates between params, body and types", () => {
    cy.openAPIDialog("EDIT");

    cy.getBySel("api-body").should("be.visible");
    cy.getBySel("params-toggle").click();
    cy.getBySel("api-params").should("be.visible");
    cy.getBySel("types-button").click();
    cy.getBySel("api-types").should("be.visible");
  });

  it("updates schema of request if method is not GET", () => {});

  it("updates schema of response", () => {
    cy.openAPIDialog("EDIT");

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
        cy.openAPIDialog("EDIT");

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

  it("displays params view in body if method is GET", () => {});

  it("adds resource", () => {
    cy.openAPIDialog("RESOURCE");

    cy.getBySel("path-input").type("newresource");
    cy.getBySel("save-api-button").click();
    cy.openAPIDialog("EDIT");
    cy.getBySel("path-text").should("contain.text", "/newresource");
  });

  it("adds method", () => {
    cy.openAPIDialog("METHOD");

    cy.getBySel("method-select").click();

    cy.get('[data-cy^="method-menuitem-"]')
      .first()
      .then(($menuItem) => {
        cy.wrap($menuItem)
          .invoke("text")
          .then((text) => {
            const firstMethod = text.trim();

            cy.get("body").click();

            cy.getBySel("save-api-button").click();
            cy.openAPIDialog("EDIT");

            cy.getBySel("method-text").should("contain.text", firstMethod);
          });
      });
  });

  it("deletes method and resource", () => {
    cy.get('[data-cy^="method-"]').then(($methods) => {
      const methodCount = $methods.length;

      if (methodCount >= 2) {
        cy.get('[data-cy^="method-"]')
          .eq(1)
          .then(($method) => {
            const methodName = $method.attr("data-cy");
            cy.wrap($method).click();

            cy.openAPIDialog("EDIT");

            cy.getBySel("delete-api-button").click();

            cy.getBySel("delete-api-button-yes").click();

            cy.get('[data-cy^="method-"]').should(
              "have.length",
              methodCount - 1
            );
            cy.get(`[data-cy="${methodName}"]`).should("not.exist");
          });
      }
    });
  });

  it("prevents deleting root resource", () => {});

  it("prevents dup method", () => {
    cy.openAPIDialog("METHOD");

    cy.getBySel("method-select").click();

    cy.get('[data-cy^="method-menuitem-"]').each(($menuItem) => {
      cy.wrap($menuItem)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).not.to.equal("GET");
        });
    });

    cy.get("body").click();
  });

  it("prevents dup resource", () => {
    cy.openAPIDialog("RESOURCE");

    cy.get('[data-cy^="path-"]')
      .eq(1)
      .invoke("text")
      .then((existingPath) => {
        cy.getBySel("path-input").clear().type(existingPath.replace(/\//g, ""));

        cy.getBySel("save-api-button").should("be.disabled");
      });
  });
});
