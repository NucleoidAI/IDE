describe("API Page", () => {
  beforeEach(() => {
    cy.setup("IDE", "SEED", "LOCAL");
    cy.fixture("PROJECTS/LOCAL/project.json").as("project");
    cy.wrap("3450f289-0fc5-45e9-9a4a-606c0a63cdfe").as("projectId");

    cy.get("@projectId").then((projectId) => {
      cy.visit(`/${projectId}/api?mode=local`);
    });

    cy.waitEvent("CONTAINER_LOADED");
  });

  it("opens APIDialog for given method and resource with right click", () => {
    cy.openAPIDialog("EDIT");

    cy.getBySel("method-text").should("have.text", "GET");
    cy.getBySel("path-text").should("have.text", "/ ");
  });

  it("deletes methods with right click", () => {
    cy.get('[data-cy^="method-"]').then(($methods) => {
      const methodCount = $methods.length;
      if (methodCount >= 2) {
        cy.get('[data-cy^="method-"]')
          .eq(1)
          .then(($method) => {
            const methodName = $method.attr("data-cy");
            cy.wrap($method).rightclick();
            cy.getBySel("delete-method-button").click();
            cy.getBySel("delete-method-confirm-button").click();
            cy.get('[data-cy^="method-"]').should(
              "have.length",
              methodCount - 1
            );
            cy.get(`[data-cy="${methodName}"]`).should("not.exist");
          });
      }
    });
  });

  it("deletes resources with right click", () => {
    cy.get('[data-cy^="path-"]').then(($paths) => {
      const pathCount = $paths.length;
      if (pathCount >= 2) {
        cy.get('[data-cy^="path-"]')
          .eq(1)
          .then(($path) => {
            const pathName = $path.attr("data-cy");
            cy.wrap($path).rightclick();
            cy.getBySel("delete-resource").click();
            cy.getBySel("delete-resource-confirm-button").click();
            cy.get('[data-cy^="path-"]').should(($updatedPaths) => {
              expect($updatedPaths.length).to.be.lessThan(pathCount);
            });
            cy.get(`[data-cy="${pathName}"]`).should("not.exist");
          });
      }
    });
  });

  it("displays schema view of request and response in APISetting", () => {
    cy.getBySel("request-schema").should("exist");
    cy.getBySel("response-schema").should("exist");
  });

  it("updates summary and description", () => {
    cy.get('[data-cy^="method-"]').first().click();

    const newSummary = "New Summary";
    const newDescription = "New Description";

    cy.getBySel("summary-textfield").clear();
    cy.getBySel("summary-textfield").type(newSummary);

    cy.getBySel("description-textfield").clear();
    cy.getBySel("description-textfield").type(newDescription);

    cy.get('[data-cy^="method-"]').eq(1).click();
    cy.get('[data-cy^="method-"]').first().click();

    cy.getBySel("summary-textfield")
      .find("input")
      .should("have.value", newSummary);
    cy.getBySel("description-textfield")
      .find("textarea")
      .should("have.value", newDescription);
  });

  it("prevents deleting root resource", () => {
    cy.get('[data-cy^="path-"]').then(($paths) => {
      const pathCount = $paths.length;
      if (pathCount >= 2) {
        cy.get('[data-cy^="path-"]')
          .first()
          .then(($path) => {
            cy.wrap($path).rightclick();
            cy.getBySel("delete-resource").should(
              "have.attr",
              "aria-disabled",
              "true"
            );
          });
      }
    });
  });

  describe("Local Mode", () => {
    beforeEach(() => {
      cy.setup("IDE", "SEED", "LOCAL");
      cy.fixture("PROJECTS/LOCAL/project.json").as("project");
      cy.wrap("3450f289-0fc5-45e9-9a4a-606c0a63cdfe").as("projectId");
    });

    it("saves changes in API editor", function () {
      cy.visit(`/${this.projectId}/api?mode=local`);

      cy.waitEvent("CONTAINER_LOADED");

      const changedEditorValue = `function action(req: { params: { item: string } }): any {\n  const newItem = req.params.item;\n  return Item[newItem];\n}`;

      cy.typeEditor(changedEditorValue);

      cy.checkLocalContext(this.projectId, "api", changedEditorValue);
    });
  });

  describe("Cloud Mode", () => {
    beforeEach(() => {
      cy.setup("IDE", "SEED", "CLOUD");

      cy.wrap("a166cc16-5c76-4aac-819e-118207a5dfa9").as("projectId");
      cy.wrap("06843e12-bc10-4648-99dc-85ad4be1cd09").as("serviceId");

      cy.get("@serviceId").then((serviceId) => {
        cy.saveContextIntercept(serviceId).as("saveContext");
      });
    });

    it("saves changes in API editor", () => {
      cy.get("@projectId").then((projectId) => {
        cy.visit(`/${projectId}/api`);
      });

      cy.waitEvent("CONTAINER_LOADED");

      const changedEditorValue = `function action(req: { params: { item: string } }): any {\n  const newItem = req.params.item;\n  return Item[newItem];\n`;

      cy.typeEditor(changedEditorValue);

      cy.reload().then(() => {
        cy.waitEvent("CONTAINER_LOADED");

        cy.checkEditorValue(changedEditorValue);
      });
    });
  });
});
