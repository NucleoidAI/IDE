describe("Query", () => {
  describe("Terminal Mode", () => {
    beforeEach(() => {
      cy.setup("IDE", "SEED", "LOCAL");
      cy.fixture("PROJECTS/LOCAL/project.json").as("project");
      cy.wrap("3450f289-0fc5-45e9-9a4a-606c0a63cdfe").as("projectId");

      cy.get("@projectId").then((projectId) => {
        cy.visit(`/${projectId}/api?mode=local`);
      });

      cy.waitEvent("CONTAINER_LOADED");
      cy.get("@projectId").then((projectId) => {
        cy.visit(`/${projectId}/query?mode=terminal`);
      });
    });

    it("displays object tree when result is an object", () => {
      cy.intercept("POST", "http://localhost:8448", {
        fixture: "Query/query.object.json",
      }).as("objectQuery");

      const value = "return { id: 1 }";
      cy.typeEditor(value);
      cy.getBySel("query-button").click();

      cy.wait("@objectQuery");

      cy.getBySel("query-result-widget").find("[data-cy=time]").should("exist");
      cy.getBySel("query-result-widget")
        .find("[data-cy=done-icon]")
        .should("exist");

      cy.getBySel("query-result-widget")
        .find('[data-cy="object"]')
        .should("have.text", "{id:1}");
    });
    it("display object with value when result is a value", () => {
      cy.intercept("POST", "http://localhost:8448", {
        fixture: "Query/query.json",
      }).as("valueQuery");

      cy.typeEditor("a = 1");
      cy.getBySel("query-button").click();

      cy.wait("@valueQuery");

      cy.getBySel("query-result-widget").find("[data-cy=time]").should("exist");
      cy.getBySel("query-result-widget")
        .find("[data-cy=done-icon]")
        .should("exist");
      cy.getBySel("query-result-widget")
        .find('[data-cy="value"]')
        .should("have.text", "{value:1}");
    });
    it("display success icon only when result is empty", function () {
      cy.intercept("POST", "http://localhost:8448", {
        fixture: "Query/query.empty.json",
      }).as("emptyQuery");

      const value = "class User {}";
      cy.typeEditor(value);
      cy.getBySel("query-button").click();

      cy.wait("@emptyQuery");

      cy.getBySel("query-result-widget").find("[data-cy=time]").should("exist");
      cy.getBySel("query-result-widget")
        .find("[data-cy=done-icon]")
        .should("exist");
    });
    it("display array tree and data grid when result is an array", () => {
      cy.intercept("POST", "http://localhost:8448", {
        fixture: "Query/query.array.json",
      }).as("arrayQuery");

      const value = "return [{id:'5f5b3b4b-1b3b-4b3b-8b3b-3b3b3b3b3b3b'}]";
      cy.typeEditor(value);
      cy.getBySel("query-button").click();

      cy.wait("@arrayQuery");

      cy.getBySel("query-result-widget")
        .find('[data-cy="array"]')
        .should("have.text", '[0:{id:"5f5b3b4b-1b3b-4b3b-8b3b-3b3b3b3b3b3b"}]');

      cy.getBySel("query-result-widget").find("[data-cy=time]").should("exist");
      cy.getBySel("query-result-widget")
        .find("[data-cy=done-icon]")
        .should("exist");

      cy.getBySel("json-switch").click();
    });
  });

  describe.skip("Local Mode", () => {
    beforeEach(() => {
      cy.setup("IDE", "SEED", "LOCAL");
      cy.fixture("PROJECTS/LOCAL/project.json").as("project");
      cy.wrap("3450f289-0fc5-45e9-9a4a-606c0a63cdfe").as("projectId");

      cy.get("@projectId").then((projectId) => {
        cy.visit(`/${projectId}/api?mode=local`);
      });

      cy.waitEvent("CONTAINER_LOADED");

      // TODO This does not pass GitHub security in headless chrome
      cy.runSandbox();

      cy.getBySel("menu-Query").click();
    });

    it("displays object tree when result is an object", () => {
      cy.intercept("POST", "http://localhost:3000", {
        fixture: "Query/query.object.json",
      }).as("objectQuery");

      const value = "return { id: 1 }";
      cy.typeEditor(value);
      cy.getBySel("query-button").click();

      cy.getBySel("query-result-widget").find("[data-cy=time]").should("exist");
      cy.getBySel("query-result-widget")
        .find("[data-cy=done-icon]")
        .should("exist");
      cy.getBySel("query-result-widget")
        .find('[data-cy="object"]')
        .should("have.text", "{id:1}");
    });
    it("displays object with value when result is a value", () => {
      cy.intercept("POST", "http://localhost:3000", {
        fixture: "Query/query.json",
      }).as("valueQuery");

      cy.typeEditor("a = 1");
      cy.getBySel("query-button").click();

      cy.getBySel("query-result-widget").find("[data-cy=time]").should("exist");
      cy.getBySel("query-result-widget")
        .find("[data-cy=done-icon]")
        .should("exist");
      cy.getBySel("query-result-widget")
        .find('[data-cy="value"]')
        .should("have.text", "{value:1}");
    });
    it("displays success icon only when result is empty", function () {
      cy.intercept("POST", "http://localhost:3000", {
        fixture: "Query/query.empty.json",
      }).as("emptyQuery");

      const value = "class User {}";
      cy.typeEditor(value);
      cy.getBySel("query-button").click();

      cy.waitEvent("SWAGGER_DIALOG");

      cy.getBySel("query-result-widget").find("[data-cy=time]").should("exist");
      cy.getBySel("query-result-widget")
        .find("[data-cy=done-icon]")
        .should("exist");
    });
    it("displays array tree and data grid when result is an array", () => {
      cy.intercept("POST", "http://localhost:3000", {
        fixture: "Query/query.array.json",
      }).as("arrayQuery");

      const value = "return [{id:'5f5b3b4b-1b3b-4b3b-8b3b-3b3b3b3b3b3b'}]";
      cy.typeEditor(value);
      cy.getBySel("query-button").click();

      cy.getBySel("query-result-widget")
        .find('[data-cy="array"]')
        .should("have.text", '[0:{id:"5f5b3b4b-1b3b-4b3b-8b3b-3b3b3b3b3b3b"}]');

      cy.getBySel("query-result-widget").find("[data-cy=time]").should("exist");
      cy.getBySel("query-result-widget")
        .find("[data-cy=done-icon]")
        .should("exist");

      cy.getBySel("json-switch").click();
    });
  });
});
