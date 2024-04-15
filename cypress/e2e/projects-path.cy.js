describe("project path spec", () => {
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
  });

  it("visit '/ide' with recent project and open recent project", () => {
    const localProjectId = "3450f289-0fc5-45e9-9a4a-606c0a63cdfe";
    const selectedProject = { id: localProjectId, type: "LOCAL" };
    cy.fixture("/LOCAL/project.json").then((project) => {
      cy.storageSet(["ide", "projects", localProjectId], project);
      cy.storageSet(["ide", "selected", "project"], selectedProject);
    });

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

      cy.window().then((win) => {
        const project = win.localStorage.getItem(`ide.projects.${projectId}`);

        expect(project).to.exist;

        const recentProject = win.localStorage.getItem(`ide.selected.project`);

        expect(JSON.parse(recentProject).id).to.equal(projectId);
        expect(JSON.parse(recentProject).type).to.equal("LOCAL");
      });
    });
  });

  it("visit '/ide/projectId and open cloud project'", () => {
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

    cy.window().then((win) => {
      const recentProject = win.localStorage.getItem(`ide.selected.project`);

      expect(JSON.parse(recentProject).id).to.equal(cloudProjectId);
      expect(JSON.parse(recentProject).type).to.equal("CLOUD");
    });
  });

  it("visit '/ide/projectId?mode=local' and open local project", () => {
    const localProjectId = "3450f289-0fc5-45e9-9a4a-606c0a63cdfe";

    cy.fixture("/LOCAL/project.json").then((project) => {
      cy.storageSet(["ide", "projects", localProjectId], project);
    });

    cy.visit(`/ide/${localProjectId}?mode=local`);

    cy.url().should("contain", `ide/${localProjectId}/api?mode=local`);

    cy.location("pathname").then((pathname) => {
      const pathParts = pathname.split("/");
      const projectId = pathParts[pathParts.length - 2];

      const recentProject = localStorage.getItem(`ide.selected.project`);

      expect(JSON.parse(recentProject).id).to.equal(projectId);
      expect(JSON.parse(recentProject).type).to.equal("LOCAL");
    });
  });

  it("invalid projectId for cloud mode", () => {
    const invalidProjectId = "1111111111";

    cy.intercept(
      "GET",
      `https://nuc.land/ide/api/projects/${invalidProjectId}`,
      {
        statusCode: 404,
        body: "",
      }
    ).as("project");

    cy.intercept(
      "GET",
      `https://nuc.land/ide/api/projects/${invalidProjectId}/services`,
      {
        statusCode: 404,
        body: "",
      }
    ).as("services");

    cy.visit(`/ide/${invalidProjectId}`);

    cy.url().should("contain", "/error");

    cy.getBySel("global-snack-message").should("be.visible");

    cy.getBySel("global-snack-message").contains("Project not found");
    cy.get("#nuc-progress-indicator")
      .should("not.be.visible")
      .debug()
      .then(() => {
        cy.get("body").click(0, 0);
      });
  });

  it("invalid projectId for local mode", () => {
    const invalidProjectId = "1111111111";

    cy.intercept(
      "GET",
      `https://nuc.land/ide/api/projects/${invalidProjectId}`,
      {
        statusCode: 404,
        body: "",
      }
    ).as("project");

    cy.intercept(
      "GET",
      `https://nuc.land/ide/api/projects/${invalidProjectId}/services`,
      {
        statusCode: 404,
        body: "",
      }
    ).as("services");

    cy.visit(`/ide/${invalidProjectId}/?mode=local`);

    cy.url().should("contain", "/error");
  });
});
