describe("APIParams", () => {
  beforeEach(() => {
    cy.setup("IDE", "SEED", "LOCAL");
    cy.fixture("PROJECTS/LOCAL/project.json").as("project");
    cy.wrap("3450f289-0fc5-45e9-9a4a-606c0a63cdfe").as("projectId");
  });

  it("adds new parameter with required check", () => {});

  it("adds new parameter without required check", () => {});

  it("updates parameters", () => {});
});
