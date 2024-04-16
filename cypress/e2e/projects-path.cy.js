describe("project path spec", () => {
  before(() => {
    cy.fixture("/GET/config.json").as("config");
    cy.fixture("/GET/projects.json").as("projects");
    cy.fixture("/LOCAL/project.json").as("localProject");
  });

  beforeEach(() => {
    cy.storageSet(`ide.landing`, { level: 2 });

    cy.intercept("GET", "https://nuc.land/ide/api/projects", {
      statusCode: 200,
      body: "@projects",
    });

    cy.intercept("GET", "https://nucleoid.com/config", {
      statusCode: 200,
      body: "@config",
    });
  });

  it("visit '/ide' with recent project and open recent project", () => {
    const localProjectId = "3450f289-0fc5-45e9-9a4a-606c0a63cdfe";
    const selectedProject = { id: localProjectId, type: "LOCAL" };

    cy.get("@localProject").then((localProject) => {
      cy.storageSet(`ide.projects.${localProjectId}`, localProject);
    });

    cy.storageSet("ide.selected.project", selectedProject);

    cy.visit("/ide");

    cy.url().should("include", `/${localProjectId}/api?mode=local`);
  });

  it("visit '/ide' without recent project and navigate new project page", () => {
    cy.visit("/ide");

    cy.url().should("include", "/new/api?mode=local");
  });

  it("visit '/ide/sample' and create sample project", () => {
    cy.visit("/ide/sample");

    cy.url().should("contain", "/api");

    cy.location("pathname").then((pathname) => {
      const pathParts = pathname.split("/");
      const projectId = pathParts[pathParts.length - 2];

      cy.storageGet(`ide.projects.${projectId}`).as("project");

      cy.get("@project").should("exist");

      cy.storageGet(`ide.selected.project`).as("selectedProject");

      cy.get("@selectedProject").should((selectedProject) => {
        expect(selectedProject.id).to.equal(projectId);
        expect(selectedProject.type).to.equal("LOCAL");
      });
    });
  });

  it("visit '/ide/projectId and open cloud project'", () => {
    const cloudProjectId = "a166cc16-5c76-4aac-819e-118207a5dfa9";

    cy.visit(`/ide/${cloudProjectId}`);

    cy.cloudProjectIntercept(cloudProjectId).as("cloudProject");

    cy.wait("@cloudProject");

    cy.window().then((win) => {
      const recentProject = win.localStorage.getItem(`ide.selected.project`);

      expect(JSON.parse(recentProject).id).to.equal(cloudProjectId);
      expect(JSON.parse(recentProject).type).to.equal("CLOUD");
    });
  });

  it("visit '/ide/projectId?mode=local' and open local project", () => {
    const localProjectId = "3450f289-0fc5-45e9-9a4a-606c0a63cdfe";

    cy.fixture("/LOCAL/project.json").then((localProject) => {
      cy.storageSet(`ide.projects.${localProjectId}`, localProject);
    });

    cy.visit(`/ide/${localProjectId}?mode=local`);

    cy.url().should("contain", `ide/${localProjectId}/api?mode=local`);

    cy.location("pathname").then((pathname) => {
      const pathParts = pathname.split("/");
      const projectId = pathParts[pathParts.length - 2];

      cy.storageGet(`ide.selected.project`).then((selectedProject) => {
        expect(selectedProject.id).to.equal(projectId);
        expect(selectedProject.type).to.equal("LOCAL");
      });
    });
  });

  it("invalid projectId for cloud mode", () => {
    const invalidProjectId = "1111111111";

    cy.intercept(`https://nuc.land/ide/api/projects/${invalidProjectId}`);

    cy.intercept(
      `https://nuc.land/ide/api/projects/${invalidProjectId}/services`
    );

    cy.visit(`/ide/${invalidProjectId}`);

    cy.url().should("contain", "/error");
  });

  it("invalid projectId for local mode", () => {
    const invalidProjectId = "1111111111";

    cy.visit(`/ide/${invalidProjectId}?mode=local`);

    cy.url().should("contain", "/error");
  });
});
