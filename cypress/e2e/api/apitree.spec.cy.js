describe("APITree", () => {
  beforeEach(() => {
    cy.setup("IDE", "SEED", "LOCAL");
    cy.fixture("PROJECTS/LOCAL/project.json").as("project");
    cy.wrap("3450f289-0fc5-45e9-9a4a-606c0a63cdfe").as("projectId");

    cy.get("@projectId").then((projectId) => {
      cy.visit(`/${projectId}/api?mode=local`);
    });
  });

  it("displays multiple nested resources", () => {
    cy.waitEvent("CONTAINER_LOADED").then(() => {
      cy.get('[data-cy^="path-"]').then(($paths) => {
        $paths.each((index, path) => {
          const currentPath = path.getAttribute("data-cy");
          cy.get(`[data-cy="${currentPath}"]`).should("exist");
        });
      });
    });
  });

  it("displays GET, PUT, POST, DEL and PATCH methods", () => {
    cy.waitEvent("CONTAINER_LOADED").then(() => {
      cy.get('[data-cy^="path-"]')
        .first()
        .then(($path) => {
          const pathName = $path.attr("data-cy");

          const methods = ["PUT", "POST", "DEL", "PATCH"];
          methods.forEach(() => {
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
});
