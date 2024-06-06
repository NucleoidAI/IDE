describe("APITree", () => {
  beforeEach(() => {
    cy.setup("IDE", "SEED", "LOCAL");
    cy.fixture("PROJECTS/LOCAL/project.json").as("project");
    cy.wrap("3450f289-0fc5-45e9-9a4a-606c0a63cdfe").as("projectId");

    cy.get("@projectId").then((projectId) => {
      cy.visit(`/${projectId}/api?mode=local`);
    });
    cy.waitEvent("CONTAINER_LOADED");
  });

  it("displays multiple nested resources", () => {
    cy.get('[data-cy^="path-"]').each(($path) => {
      cy.wrap($path).should("exist");
    });
  });

  it("displays GET, PUT, POST, DEL and PATCH methods", () => {
    cy.get('[data-cy^="path-"]')
      .first()
      .then(() => {
        const methods = ["PUT", "POST", "DEL", "PATCH"];
        methods.forEach((method) => {
          cy.getBySel("resource-menu").click();
          cy.getBySel("add-method").click();
          cy.getBySel("save-api-button").click();
        });

        cy.get(`[data-cy^="method-"]`).then(($methods) => {
          const methodNames = $methods
            .map(
              (index, method) => method.getAttribute("data-cy").split("-")[1]
            )
            .get();
          expect(methodNames).to.include.members([
            "/GET",
            "/PUT",
            "/POST",
            "/DEL",
            "/PATCH",
          ]);
        });
      });
  });
});
