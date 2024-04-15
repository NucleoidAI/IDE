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

    const cloudProjectId = "a166cc16-5c76-4aac-819e-118207a5dfa9";
    let serviceId;

    cy.visit(`/ide/${cloudProjectId}`);

    cy.fixture("/GET/projects.json")
      .then((projects) => {
        const cloudProject = projects.find((p) => p.id === cloudProjectId);
        cy.intercept(
          "GET",
          `https://nuc.land/ide/api/projects/${cloudProjectId}`,
          {
            statusCode: 200,
            body: cloudProject,
          }
        );
      })
      .as("project");

    cy.fixture("/GET/single-project-service.json")
      .then((service) => {
        cy.intercept(
          "GET",
          `https://nuc.land/ide/api/projects/${cloudProjectId}/services`,
          {
            statusCode: 200,
            body: service,
          }
        );
        serviceId = service[0].id;
      })
      .as("services");

    cy.fixture("/GET/context.json")
      .then((context) => {
        cy.intercept(
          "GET",
          `https://nuc.land/ide/api/services/${serviceId}/context`,
          {
            statusCode: 200,
            body: context,
          }
        );
      })
      .as("context");

    cy.wait(["@project", "@services", "@context"]);
  });

  it("should save api editor changes", () => {
    const cloudProjectId = "a166cc16-5c76-4aac-819e-118207a5dfa9";
    const serviceId = "06843e12-bc10-4648-99dc-85ad4be1cd09";

    const changedEditorValue = `function action(req: { params: { item: string } }): any {\n  const newItem = req.params.item;\n  return Item[newItem];`;

    cy.url().should("include", `/${cloudProjectId}/api`);

    cy.get('textarea[role="textbox"]').click();
    cy.get('textarea[role="textbox"]').clear();
    cy.get('textarea[role="textbox"]').type(changedEditorValue, {
      parseSpecialCharSequences: false,
    });

    cy.fixture("/PUT/changed-context.json")
      .then((context) => {
        cy.intercept(
          "PUT",
          `https://nuc.land/ide/api/services/${serviceId}/context`,
          {
            statusCode: 200,
            body: context,
          }
        );
      })
      .as("contextPut");

    cy.fixture("/PUT/changed-context.json")
      .then((context) => {
        cy.intercept(
          "GET",
          `https://nuc.land/ide/api/services/${serviceId}/context`,
          {
            statusCode: 200,
            body: context,
          }
        );
      })
      .as("contextGet");

    cy.wait("@contextPut");

    cy.reload().then(() => {
      cy.wait("@contextGet");
      cy.get('textarea[role="textbox"]')
        .invoke("val")
        .then((val) => {
          expect(val).to.include("newItem");
        });
    });
  });

  it("should save functions editor changes", () => {
    const cloudProjectId = "a166cc16-5c76-4aac-819e-118207a5dfa9";
    const serviceId = "06843e12-bc10-4648-99dc-85ad4be1cd09";

    cy.url().should("include", `/${cloudProjectId}/api`);

    cy.getBySel("menu-Functions").click();

    const changedEditorValue = `class NewOrder {\n      name: string;\n      barcode: string;\n      constructor(name: string, barcode: string) {\n  this.name = name;\nthis.barcode = barcode;\n`;

    cy.url().should("include", `/${cloudProjectId}/functions`);

    cy.get('textarea[role="textbox"]').click();
    cy.get('textarea[role="textbox"]').clear();
    cy.get('textarea[role="textbox"]').type(changedEditorValue, {
      parseSpecialCharSequences: false,
    });

    cy.fixture("/PUT/changed-context.json")
      .then((context) => {
        cy.intercept(
          "PUT",
          `https://nuc.land/ide/api/services/${serviceId}/context`,
          {
            statusCode: 200,
            body: context,
          }
        );
      })
      .as("contextPut");

    cy.fixture("/PUT/changed-context.json")
      .then((context) => {
        cy.intercept(
          "GET",
          `https://nuc.land/ide/api/services/${serviceId}/context`,
          {
            statusCode: 200,
            body: context,
          }
        );
      })
      .as("contextGet");

    cy.wait("@contextPut");

    cy.reload().then(() => {
      cy.wait("@contextGet");
      cy.get('textarea[role="textbox"]')
        .invoke("val")
        .then((val) => {
          expect(val).to.include("NewOrder");
        });
    });
  });

  it("should save logic editor changes", () => {
    const cloudProjectId = "a166cc16-5c76-4aac-819e-118207a5dfa9";
    const serviceId = "06843e12-bc10-4648-99dc-85ad4be1cd09";

    cy.url().should("include", `/${cloudProjectId}/api`);

    cy.getBySel("menu-Logic").click();

    const changedEditorValue = `$Human.mortal = true;\nplaton = new Human('Platon');\nplaton.mortal === true;`;

    cy.url().should("include", `/${cloudProjectId}/logic`);

    cy.get('textarea[role="textbox"]').click();
    cy.get('textarea[role="textbox"]').clear();
    cy.get('textarea[role="textbox"]').type(changedEditorValue, {
      parseSpecialCharSequences: false,
    });

    cy.fixture("/PUT/changed-context.json")
      .then((context) => {
        cy.intercept(
          "PUT",
          `https://nuc.land/ide/api/services/${serviceId}/context`,
          {
            statusCode: 200,
            body: context,
          }
        );
      })
      .as("contextPut");

    cy.fixture("/PUT/changed-context.json")
      .then((context) => {
        cy.intercept(
          "GET",
          `https://nuc.land/ide/api/services/${serviceId}/context`,
          {
            statusCode: 200,
            body: context,
          }
        );
      })
      .as("contextGet");

    cy.wait("@contextPut");

    cy.reload().then(() => {
      cy.wait("@contextGet");
      cy.get('textarea[role="textbox"]')
        .invoke("val")
        .then((val) => {
          expect(val).to.include("platon");
        });
    });
  });
});
