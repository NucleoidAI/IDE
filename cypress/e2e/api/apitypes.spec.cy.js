describe("APITypes", () => {
  beforeEach(() => {
    cy.setup("IDE", "SEED", "LOCAL");
    cy.fixture("PROJECTS/LOCAL/project.json").as("project");
    cy.wrap("3450f289-0fc5-45e9-9a4a-606c0a63cdfe").as("projectId");
  });

  it("displays TS class", () => {});

  it("adds type", () => {});

  it("updates type", () => {});

  it("deletes type", () => {});
});
