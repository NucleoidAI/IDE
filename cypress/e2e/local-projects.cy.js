describe("Local Project", () => {
  beforeEach(() => {
    cy.setup("IDE", "SEED", "LOCAL");
    cy.fixture("PROJECTS/LOCAL/project.json").as("project");
    cy.wrap("3450f289-0fc5-45e9-9a4a-606c0a63cdfe").as("projectId");
  });

  it("saves changes in API editor", () => {
    cy.get("@projectId").then((projectId) => {
      cy.visit(`/${projectId}/api?mode=local`);
    });

    cy.waitEvent("CONTAINER_LOADED");

    const changedEditorValue = `function action(req: { params: { item: string } }): any {\n  const newItem = req.params.item;\n  return Item[newItem];\n}`;

    cy.typeEditor(changedEditorValue);

    cy.get("@projectId").then((projectId) => {
      cy.storageGet(`ide.context.${projectId}`).then((context) => {
        cy.normalizeString(changedEditorValue).then(
          (normalizedChangedEditorValue) => {
            cy.normalizeString(context.specification.api[3]["action"]).then(
              (normalizedContextValue) => {
                expect(normalizedContextValue).to.contain(
                  normalizedChangedEditorValue
                );
              }
            );
          }
        );
      });
    });
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

  it("saves changes in logic editor", () => {
    cy.get("@projectId").then((projectId) => {
      cy.visit(`/${projectId}/logic?mode=local`);
    });

    cy.waitEvent("CONTAINER_LOADED").then(() => {
      const changedEditorValue = `$Human.mortal = true;\nplaton = new Human('Platon');\nplaton.mortal === true;`;

      cy.typeEditor(changedEditorValue);

      cy.get("@projectId").then((projectId) => {
        cy.storageGet(`ide.context.${projectId}`).then((project) => {
          cy.normalizeString(
            project.specification.declarations[0].definition
          ).then((normalizedDefinition) => {
            cy.normalizeString(changedEditorValue).then(
              (normalizedChangedEditorValue) => {
                expect(normalizedDefinition).to.include(
                  normalizedChangedEditorValue
                );
              }
            );
          });
        });
      });
    });
  });
});
