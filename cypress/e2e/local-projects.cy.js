describe("local project spec", () => {
  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.setItem("ide.landing", JSON.stringify({ level: 2 }));
    });
    cy.fixture("/GET/projects.json").then((projects) => {
      cy.intercept("GET", "https://nuc.land/ide/api/projects", {
        statusCode: 200,
        body: projects,
      });
    });

    cy.fixture("/GET/config.json").then((config) => {
      cy.intercept("GET", "https://nucleoid.com/config", {
        statusCode: 200,
        body: config,
      });
    });

    const localProjectId = "3450f289-0fc5-45e9-9a4a-606c0a63cdfe";

    cy.fixture("/LOCAL/project.json").then((project) => {
      cy.storageSet(["ide", "projects", localProjectId], project);
    });

    cy.visit(`/ide/${localProjectId}/?mode=local`);
  });

  it("should save api editor changes in storage", () => {
    const localProjectId = "3450f289-0fc5-45e9-9a4a-606c0a63cdfe";

    const changedEditorValue = `function action(req: { params: { item: string } }): any {\n  const newItem = req.params.item;\n  return Item[newItem];`;
    cy.url().should("include", `/${localProjectId}/api?mode=local`);

    cy.get('textarea[role="textbox"]').click();
    cy.get('textarea[role="textbox"]').clear();
    cy.get('textarea[role="textbox"]').type(changedEditorValue, {
      parseSpecialCharSequences: false,
    });

    cy.wait(1000);

    cy.window()
      .its("localStorage")
      .then((localStorage) => {
        const context = localStorage.getItem(
          "ide.projects.3450f289-0fc5-45e9-9a4a-606c0a63cdfe"
        );
        expect(JSON.parse(context).api[3]["x-nuc-action"]).to.include(
          "newItem"
        );
      });
  });

  it("should save functions editor changes", () => {
    const localProjectId = "3450f289-0fc5-45e9-9a4a-606c0a63cdfe";

    cy.url().should("include", `/${localProjectId}/api?mode=local`);

    cy.getBySel("menu-Functions").click();

    const changedEditorValue = `class NewOrder {\n      name: string;\n      barcode: string;\n      constructor(name: string, barcode: string) {\n  this.name = name;\nthis.barcode = barcode;\n`;

    cy.url().should("include", `/${localProjectId}/functions?mode=local`);

    cy.get("section").should("be.visible");
    cy.get(".monaco-editor").should("be.visible");

    cy.get('textarea[role="textbox"]').click();
    cy.get('textarea[role="textbox"]').clear();
    cy.get('textarea[role="textbox"]').type(changedEditorValue, {
      parseSpecialCharSequences: false,
    });

    cy.wait(1000);

    cy.window()
      .its("localStorage")
      .then((localStorage) => {
        const context = localStorage.getItem(
          "ide.projects.3450f289-0fc5-45e9-9a4a-606c0a63cdfe"
        );

        expect(JSON.parse(context).functions[0].definition).to.include(
          "NewOrder"
        );
      });
  });

  it("should save logic editor changes", () => {
    const localProjectId = "3450f289-0fc5-45e9-9a4a-606c0a63cdfe";

    cy.url().should("include", `/${localProjectId}/api?mode=local`);

    cy.getBySel("menu-Logic").click();

    const changedEditorValue = `$Human.mortal = true;\nplaton = new Human('Platon');\nplaton.mortal === true;`;

    cy.contains("All humans are mortal").click();

    cy.get('textarea[role="textbox"]').click();
    cy.get('textarea[role="textbox"]').clear();
    cy.get('textarea[role="textbox"]').type(changedEditorValue, {
      parseSpecialCharSequences: false,
    });

    cy.wait(1000);

    cy.window()
      .its("localStorage")
      .then((localStorage) => {
        const context = localStorage.getItem(
          "ide.projects.3450f289-0fc5-45e9-9a4a-606c0a63cdfe"
        );
        expect(JSON.parse(context).declarations[0].definition).to.include(
          "plato"
        );
      });
  });
});
