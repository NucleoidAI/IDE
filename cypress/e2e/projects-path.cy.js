describe("Projects Path", () => {
  describe("Cloud Project", () => {
    beforeEach(() => {
      cy.setup("IDE", "SEED", "CLOUD");
    });

    it("navigates new project page if recent project not found ", () => {
      cy.visit("/");

      cy.url().should("include", "/new/api?mode=local");
    });

    it("opens project", () => {
      const cloudProjectId = "a166cc16-5c76-4aac-819e-118207a5dfa9";

      cy.visit(`/${cloudProjectId}`);

      cy.waitEvent("CONTAINER_LOADED");

      cy.storageGet("ide.selected.context").then((project) => {
        expect(project).to.exist;
        expect(project).to.have.property("id", cloudProjectId);
        expect(project).to.have.property("type", "CLOUD");
      });
    });

    it("redirects to error path if project id is invalid", () => {
      const invalidProjectId = "1111111111";

      cy.intercept(`/projects/${invalidProjectId}`);
      cy.intercept(`/projects/${invalidProjectId}/services`);

      cy.visit(`/${invalidProjectId}`);

      cy.url().should("contain", "/error");
    });
  });

  describe("Local Project", () => {
    beforeEach(() => {
      cy.setup("IDE", "SEED", "LOCAL");
      cy.fixture("/PROJECTS/LOCAL/project.json").as("project");
    });
    it("navigates recent project if there is recent project", () => {
      const localProjectId = "3450f289-0fc5-45e9-9a4a-606c0a63cdfe";
      const selectedProject = { id: localProjectId, type: "LOCAL" };

      cy.storageSet("ide.selected.context", selectedProject);

      cy.visit("/");

      cy.url().should("include", `/${localProjectId}/api?mode=local`);
    });
    it("creates sample project", () => {
      cy.visit("/sample");

      cy.url().should("contain", "/api");

      cy.waitEvent("CONTAINER_LOADED");

      cy.location("pathname").then((pathname) => {
        const pathParts = pathname.split("/");
        const projectId = pathParts[pathParts.length - 2];

        cy.storageGet(`ide.context.${projectId}`).as("project");

        cy.get("@project").should("exist");

        cy.storageGet(`ide.selected.context`).as("selectedProject");

        cy.get("@selectedProject")
          .should((selectedProject) => {
            expect(selectedProject).to.not.be.null;
          })
          .then((selectedProject) => {
            cy.log(selectedProject);
            expect(selectedProject.id).to.equal(projectId);
            expect(selectedProject.type).to.equal("LOCAL");
          });
      });
    });

    it("opens project", () => {
      const localProjectId = "3450f289-0fc5-45e9-9a4a-606c0a63cdfe";

      cy.visit(`/${localProjectId}?mode=local`);

      cy.url().should("contain", `/${localProjectId}/api?mode=local`);

      cy.location("pathname").then((pathname) => {
        const pathParts = pathname.split("/");
        const projectId = pathParts[pathParts.length - 2];

        cy.storageGet(`ide.selected.context`).then((selectedProject) => {
          expect(selectedProject.id).to.equal(projectId);
          expect(selectedProject.type).to.equal("LOCAL");
        });
      });
    });

    it("redirects to error path if project id is invalid", () => {
      const invalidProjectId = "1111111111";

      cy.visit(`/${invalidProjectId}?mode=local`);

      cy.url().should("contain", "/error");
    });
  });
});
