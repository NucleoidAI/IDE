describe("Local Mode", () => {
  beforeEach(() => {
    cy.setup("IDE", "SEED", "LOCAL");
    cy.fixture("PROJECTS/LOCAL/project.json").as("project");
    cy.wrap("3450f289-0fc5-45e9-9a4a-606c0a63cdfe").as("projectId");
  });

  it("saves changes in functions editor", () => {
    cy.get("@projectId").then((projectId) => {
      cy.visit(`/${projectId}/functions?mode=local`);
    });

    cy.waitEvent("CONTAINER_LOADED");

    const changedEditorValue = `class NewOrder {\n      name: string;\n      barcode: string;\n      constructor(name: string, barcode: string) {\n  this.name = name;\nthis.barcode = barcode;\n`;

    cy.typeEditor(changedEditorValue);

    cy.get("@projectId").then((projectId) => {
      cy.storageGet(`ide.context.${projectId}`).then((project) => {
        cy.normalizeString(project.specification.functions[0].definition).then(
          (normalizedDefinition) => {
            cy.normalizeString(changedEditorValue).then(
              (normalizedNewOrder) => {
                expect(normalizedDefinition).to.include(normalizedNewOrder);
              }
            );
          }
        );
      });
    });
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

  it("saves changes in functions editor", () => {
    cy.get("@projectId").then((projectId) => {
      cy.visit(`/${projectId}/functions`);
    });

    cy.waitEvent("CONTAINER_LOADED");

    const changedEditorValue = `class NewOrder {\n      name: string;\n      barcode: string;\n      constructor(name: string, barcode: string) {\n  this.name = name;\nthis.barcode = barcode;\n`;

    cy.typeEditor(changedEditorValue);

    cy.reload().then(() => {
      cy.waitEvent("CONTAINER_LOADED");

      cy.checkEditorValue(changedEditorValue);
    });
  });
});
