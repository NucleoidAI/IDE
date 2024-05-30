describe("API Page", () => {
  beforeEach(() => {
    cy.setup("IDE", "SEED", "LOCAL");
    cy.fixture("PROJECTS/LOCAL/project.json").as("project");
    cy.wrap("3450f289-0fc5-45e9-9a4a-606c0a63cdfe").as("projectId");
  });

  it("opens APIDialog for given method and resource with right click", () => {});

  it("deletes method and resources with right click", () => {});

  it("displays schema view of request and response in APISetting", () => {});

  it("updates summary and description", () => {});

  it("prevents deleting root resource", () => {});
});
