describe("cloud project spec", () => {
  beforeEach(() => {
    cy.IDEContainerIntercepts();

    cy.initCloudProject().as("initProject");

    cy.storageSet(`debug`, true);
    cy.storageSet(`ide.landing`, { level: Number.MAX_SAFE_INTEGER });

    cy.wrap("a166cc16-5c76-4aac-819e-118207a5dfa9").as("cloudProjectId");
    cy.wrap("06843e12-bc10-4648-99dc-85ad4be1cd09").as("serviceId");

    cy.get("@serviceId").then((serviceId) => {
      cy.saveContextIntercept(serviceId).as("saveContext");
    });
  });

  it("should save api editor changes", () => {
    cy.get("@serviceId").then((serviceId) => {
      cy.saveContextIntercept(serviceId).as("saveContext");
    });

    cy.get("@cloudProjectId").then((cloudProjectId) => {
      cy.visit(`/ide/${cloudProjectId}/api`);
    });

    cy.waitEvent("CONTAINER_LOADED");

    const changedEditorValue = `function action(req: { params: { item: string } }): any {\n  const newItem = req.params.item;\n  return Item[newItem];`;

    cy.typeEditor(changedEditorValue);

    cy.reload().then(() => {
      cy.waitLoading();
      cy.checkEditorValue("newItem");
    });
  });

  it("should save functions editor changes", () => {
    cy.get("@cloudProjectId").then((cloudProjectId) => {
      cy.visit(`/ide/${cloudProjectId}/functions`);
    });

    cy.waitLoading();

    const changedEditorValue = `class NewOrder {\n      name: string;\n      barcode: string;\n      constructor(name: string, barcode: string) {\n  this.name = name;\nthis.barcode = barcode;\n`;

    cy.typeEditor(changedEditorValue);

    cy.reload().then(() => {
      cy.waitLoading();
      cy.checkEditorValue("NewOrder");
    });
  });

  it("should save logic editor changes", () => {
    cy.get("@cloudProjectId").then((cloudProjectId) => {
      cy.visit(`/ide/${cloudProjectId}/logic`);
    });

    cy.waitLoading();

    const changedEditorValue = `$Human.mortal = true;\nplaton = new Human('Platon');\nplaton.mortal === true;`;

    cy.typeEditor(changedEditorValue);

    cy.reload().then(() => {
      cy.waitLoading();

      cy.checkEditorValue("platon");
    });
  });
});
