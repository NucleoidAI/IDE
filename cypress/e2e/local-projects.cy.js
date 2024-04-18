describe("local project spec", () => {
  beforeEach(() => {
    cy.setup("IDE", "LOCAL", "SEED");
    cy.fixture("PROJECTS/LOCAL/project.json").as("project");
    cy.wrap("3450f289-0fc5-45e9-9a4a-606c0a63cdfe").as("projectId");
  });

  it("should save api editor changes in storage", () => {
    cy.get("@projectId").then((projectId) => {
      cy.visit(`/ide/${projectId}/api?mode=local`);
    });

    cy.waitEvent("CONTAINER_LOADED");

    const changedEditorValue = `function action(req: { params: { item: string } }): any {\n  const newItem = req.params.item;\n  return Item[newItem];`;

    cy.typeEditor(changedEditorValue);
    //fullCheckEditorValue("newItem");
    cy.get("@projectId").then((projectId) => {
      cy.storageGet(`ide.projects.${projectId}`).then((project) => {
        expect(project.api[3]["x-nuc-action"]).to.include("newItem");
      });
    });
  });

  it("should save functions editor changes", () => {
    cy.get("@projectId").then((projectId) => {
      cy.visit(`/ide/${projectId}/functions?mode=local`);
    });

    cy.waitEvent("CONTAINER_LOADED");

    const changedEditorValue = `class NewOrder {\n      name: string;\n      barcode: string;\n      constructor(name: string, barcode: string) {\n  this.name = name;\nthis.barcode = barcode;\n`;

    cy.typeEditor(changedEditorValue);

    cy.get("@projectId").then((projectId) => {
      cy.storageGet(`ide.projects.${projectId}`).then((project) => {
        expect(project.functions[0].definition).to.include("NewOrder");
      });
    });
  });

  it("should save logic editor changes", () => {
    cy.get("@projectId").then((projectId) => {
      cy.visit(`/ide/${projectId}/logic?mode=local`);
    });

    cy.waitEvent("CONTAINER_LOADED");

    const changedEditorValue = `$Human.mortal = true;\nplaton = new Human('Platon');\nplaton.mortal === true;`;

    cy.typeEditor(changedEditorValue);

    cy.get("@projectId").then((projectId) => {
      cy.storageGet(`ide.projects.${projectId}`).then((project) => {
        expect(project.declarations[0].definition).to.include("plato");
      });
    });
  });
});
