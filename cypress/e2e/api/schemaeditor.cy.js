describe("SchemaEditor", () => {
  beforeEach(() => {
    cy.setup("IDE", "SEED", "LOCAL");
    cy.fixture("PROJECTS/LOCAL/project.json").as("project");
    cy.wrap("3450f289-0fc5-45e9-9a4a-606c0a63cdfe").as("projectId");
  });

  it("adds string/number to root object", () => {});

  it("adds TS type to root object", () => {});

  it("adds TS type to root array", () => {});

  it("adds string/number to root array", () => {});

  it("prevents choosing string/number as root object", () => {});

  it("adds string/number to nested object", () => {});

  it("adds array to nested object", () => {});

  it("adds TS type to nested object", () => {});

  it("adds TS type to nested array", () => {});
});
