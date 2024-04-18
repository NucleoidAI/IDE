describe("cloud project spec", () => {
  beforeEach(() => {
    cy.setup("IDE", "SEED", "CLOUD");

    cy.wrap("a166cc16-5c76-4aac-819e-118207a5dfa9").as("projectId");
    cy.wrap("06843e12-bc10-4648-99dc-85ad4be1cd09").as("serviceId");

    cy.get("@serviceId").then((serviceId) => {
      cy.saveContextIntercept(serviceId).as("saveContext");
    });
  });

  it("should save api editor changes", () => {
    cy.get("@projectId").then((projectId) => {
      cy.visit(`/ide/${projectId}/api`);
    });

    cy.waitEvent("CONTAINER_LOADED");

    const changedEditorValue = `function action(req: { params: { item: string } }): any {\n  const newItem = req.params.item;\n  return Item[newItem];\n`;

    cy.typeEditor(changedEditorValue);

    cy.reload().then(() => {
      cy.waitEvent("CONTAINER_LOADED");

      cy.checkEditorValue(changedEditorValue);
    });
  });

  it("should save functions editor changes", () => {
    cy.get("@projectId").then((projectId) => {
      cy.visit(`/ide/${projectId}/functions`);
    });

    cy.waitEvent("CONTAINER_LOADED");

    const changedEditorValue = `class NewOrder {\n      name: string;\n      barcode: string;\n      constructor(name: string, barcode: string) {\n  this.name = name;\nthis.barcode = barcode;\n`;

    cy.typeEditor(changedEditorValue);

    cy.reload().then(() => {
      cy.waitEvent("CONTAINER_LOADED");

      cy.checkEditorValue(changedEditorValue);
    });
  });

  it("should save logic editor changes", () => {
    cy.get("@projectId").then((projectId) => {
      cy.visit(`/ide/${projectId}/logic`);
    });

    cy.waitEvent("CONTAINER_LOADED");

    const changedEditorValue = `$Human.mortal = true;\nplaton = new Human('Platon');\nplaton.mortal === true;`;

    cy.typeEditor(changedEditorValue);

    cy.reload().then(() => {
      cy.waitEvent("CONTAINER_LOADED");

      cy.checkEditorValue("platon");
    });
  });
});
