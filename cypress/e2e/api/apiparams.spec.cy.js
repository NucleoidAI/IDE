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
    const newParamName = "newParam";
    const newParamDescription = "NewDescription";

    cy.getBySel("api-params")
      .find("[data-cy^='param-name-field-'] input")
      .then(($params) => {
        const initialParamCount = $params.length;

        cy.addParam(newParamName, newParamDescription, true);

        cy.getBySel("api-params")
          .find("[data-cy^='param-name-field-'] input")
          .should("have.length", initialParamCount + 1);

        cy.verifyParam(
          initialParamCount,
          newParamName,
          newParamDescription,
          true
        );
      });
  });

  it("adds new parameter without required check", () => {
    const newParamName = "newParam";
    const newParamDescription = "NewDescription";

    cy.getBySel("api-params")
      .find("[data-cy^='param-name-field-'] input")
      .then(($params) => {
        const initialParamCount = $params.length;

        cy.addParam(newParamName, newParamDescription, false);

        cy.getBySel("api-params")
          .find("[data-cy^='param-name-field-'] input")
          .should("have.length", initialParamCount + 1);

        cy.verifyParam(
          initialParamCount,
          newParamName,
          newParamDescription,
          false
        );
      });
  });

  it("updates parameters", () => {
    cy.getBySel("api-params")
      .find("[data-cy^='param-name-field-'] input")
      .then(($params) => {
        const initialParamCount = $params.length;

        const updatedParamName = "updatedParam";
        const updatedParamDescription = "UpdatedDescription";

        cy.updateParam(0, updatedParamName, updatedParamDescription, false);

        cy.getBySel("save-api-button").click();
        cy.openAPIDialog("EDIT").click();

        cy.getBySel("params-toggle").click();

        cy.getBySel("api-params")
          .find("[data-cy^='param-name-field-'] input")
          .should("have.length", initialParamCount);

        cy.verifyParam(0, updatedParamName, updatedParamDescription, true);
      });
  });
});
