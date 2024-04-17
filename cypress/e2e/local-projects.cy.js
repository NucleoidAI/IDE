describe("local project spec", () => {
  beforeEach(() => {
    cy.IDEContainerIntercepts();
    cy.initLocalProject();

    cy.storageSet(`ide.landing`, { level: 2 });
    cy.fixture("/LOCAL/project.json").as("project");
    cy.wrap("3450f289-0fc5-45e9-9a4a-606c0a63cdfe").as("localProjectId");
  });

  it("should save api editor changes in storage", () => {
    cy.get("@localProjectId").then((localProjectId) => {
      cy.visit(`/ide/${localProjectId}/api?mode=local`);
    });

    const changedEditorValue = `function action(req: { params: { item: string } }): any {\n  const newItem = req.params.item;\n  return Item[newItem];`;

    cy.typeEditor(changedEditorValue);

    cy.get("@localProjectId").then((localProjectId) => {
      cy.storageGet(`ide.projects.${localProjectId}`).then((project) => {
        expect(project.api[3]["x-nuc-action"]).to.include("newItem");
      });
    });
  });

  it("should save functions editor changes", () => {
    cy.get("@localProjectId").then((localProjectId) => {
      cy.visit(`/ide/${localProjectId}/functions?mode=local`);
    });

    const changedEditorValue = `class NewOrder {\n      name: string;\n      barcode: string;\n      constructor(name: string, barcode: string) {\n  this.name = name;\nthis.barcode = barcode;\n`;

    cy.typeEditor(changedEditorValue);

    cy.get("@localProjectId").then((localProjectId) => {
      cy.storageGet(`ide.projects.${localProjectId}`).then((project) => {
        expect(project.functions[0].definition).to.include("NewOrder");
      });
    });
  });

  it("should save logic editor changes", () => {
    cy.get("@localProjectId").then((localProjectId) => {
      cy.visit(`/ide/${localProjectId}/logic?mode=local`);
    });

    cy.contains("All humans are mortal").click();

    const changedEditorValue = `$Human.mortal = true;\nplaton = new Human('Platon');\nplaton.mortal === true;`;

    cy.typeEditor(changedEditorValue);

    cy.get("@localProjectId").then((localProjectId) => {
      cy.storageGet(`ide.projects.${localProjectId}`).then((project) => {
        expect(project.declarations[0].definition).to.include("plato");
      });
    });
  });
});
