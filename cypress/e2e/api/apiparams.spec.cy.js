describe("APIParams", () => {
  beforeEach(() => {
    cy.setup("IDE", "SEED", "LOCAL");
    cy.fixture("PROJECTS/LOCAL/project.json").as("project");
    cy.wrap("3450f289-0fc5-45e9-9a4a-606c0a63cdfe").as("projectId");

    cy.get("@projectId").then((projectId) => {
      cy.visit(`/${projectId}/api?mode=local`);
    });

    cy.waitEvent("CONTAINER_LOADED");
    cy.openAPIDialog("edit");
    cy.getBySel("params-toggle").click();
  });

  it("adds new parameter with required check", () => {
    cy.getBySel("api-params")
      .find("[data-cy^='param-name-field-'] input")
      .then(($params) => {
        const initialParamCount = $params.length;

        cy.getBySel("add-param-button").click();

        cy.getBySel("api-params")
          .find("[data-cy^='param-name-field-'] input")
          .should("have.length", initialParamCount + 1);

        const newParamName = "newParam";
        const newParamDescription = "NewDescription";
        cy.getBySel("api-params")
          .find("[data-cy^='param-name-field-'] input")
          .eq(initialParamCount)
          .clear()
          .type(newParamName);

        cy.getBySel("api-params")
          .find("[data-cy^='param-description-field-'] input")
          .eq(initialParamCount)
          .clear()
          .type(newParamDescription);

        cy.saveAndOpenAPIDialog();

        cy.getBySel("params-toggle").click();

        cy.getBySel("api-params")
          .find("[data-cy^='param-name-field-'] input")
          .should("have.length", initialParamCount + 1);

        cy.getBySel("api-params")
          .find("[data-cy^='param-name-field-'] input")
          .eq(initialParamCount)
          .should("have.value", newParamName);

        cy.getBySel("api-params")
          .find("[data-cy^='param-description-field-'] input")
          .eq(initialParamCount)
          .should("have.value", newParamDescription);

        cy.getBySel("api-params")
          .find("[data-cy^='param-required-checkbox-'] input")
          .eq(initialParamCount)
          .should("be.checked");
      });
  });

  it("adds new parameter without required check", () => {
    cy.getBySel("api-params")
      .find("[data-cy^='param-name-field-'] input")
      .then(($params) => {
        const initialParamCount = $params.length;

        cy.getBySel("add-param-button").click();

        cy.getBySel("api-params")
          .find("[data-cy^='param-name-field-'] input")
          .should("have.length", initialParamCount + 1);

        const newParamName = "newParam";
        const newParamDescription = "NewDescription";
        cy.getBySel("api-params")
          .find("[data-cy^='param-name-field-'] input")
          .eq(initialParamCount)
          .clear()
          .type(newParamName);

        cy.getBySel("api-params")
          .find("[data-cy^='param-description-field-'] input")
          .eq(initialParamCount)
          .clear()
          .type(newParamDescription);

        cy.getBySel("api-params")
          .find("[data-cy^='param-required-checkbox-'] input")
          .eq(initialParamCount)
          .click();

        cy.saveAndOpenAPIDialog();

        cy.getBySel("params-toggle").click();

        cy.getBySel("api-params")
          .find("[data-cy^='param-name-field-'] input")
          .should("have.length", initialParamCount + 1);

        cy.getBySel("api-params")
          .find("[data-cy^='param-name-field-'] input")
          .eq(initialParamCount)
          .should("have.value", newParamName);

        cy.getBySel("api-params")
          .find("[data-cy^='param-description-field-'] input")
          .eq(initialParamCount)
          .should("have.value", newParamDescription);

        cy.getBySel("api-params")
          .find("[data-cy^='param-required-checkbox-'] input")
          .eq(initialParamCount)
          .should("not.be.checked");
      });
  });

  it("updates parameters", () => {
    cy.getBySel("api-params")
      .find("[data-cy^='param-name-field-'] input")
      .then(($params) => {
        const initialParamCount = $params.length;

        const updatedParamName = "updatedParam";
        const updatedParamDescription = "UpdatedDescription";

        cy.getBySel("api-params")
          .find("[data-cy^='param-name-field-'] input")
          .eq(0)
          .clear()
          .type(updatedParamName);

        cy.getBySel("api-params")
          .find("[data-cy^='param-description-field-'] input")
          .eq(0)
          .clear()
          .type(updatedParamDescription);

        cy.getBySel("api-params")
          .find("[data-cy^='param-required-checkbox-'] input")
          .eq(0)
          .click();

        cy.saveAndOpenAPIDialog();

        cy.getBySel("params-toggle").click();

        cy.getBySel("api-params")
          .find("[data-cy^='param-name-field-'] input")
          .should("have.length", initialParamCount);

        cy.getBySel("api-params")
          .find("[data-cy^='param-name-field-'] input")
          .eq(0)
          .should("have.value", updatedParamName);

        cy.getBySel("api-params")
          .find("[data-cy^='param-description-field-'] input")
          .eq(0)
          .should("have.value", updatedParamDescription);

        cy.getBySel("api-params")
          .find("[data-cy^='param-required-checkbox-'] input")
          .eq(0)
          .should("be.checked");
      });
  });
});
