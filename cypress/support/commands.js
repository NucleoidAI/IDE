/* eslint-disable */
import { mount } from "cypress/react18";
import { subscribe } from "@nucleoidai/react-event";

Cypress.Commands.add("mount", (component, options) => {
  return mount(component, options);
});

Cypress.Commands.add("getBySel", (selector, ...args) => {
  return cy.get(`[data-cy=${selector}]`, ...args);
});

Cypress.Commands.add("storageSet", (key, value) => {
  cy.window().then((win) => {
    win.localStorage.setItem(key, JSON.stringify(value));
  });
});

Cypress.Commands.add("storageGet", (key) => {
  cy.window().then((win) => {
    return JSON.parse(win.localStorage.getItem(key));
  });
});

Cypress.Commands.add("setup", (container, type, fixtureType) => {
  cy.clearLocalStorage();
  cy.storageSet(`debug`, true);
  cy.storageSet(`ide.landing`, { level: Number.MAX_SAFE_INTEGER });

  if (container === "IDE") {
    cy.fixture("/GET/projects.json").then((projects) => {
      cy.intercept("GET", "https://nuc.land/ide/api/projects", {
        statusCode: 200,
        body: fixtureType === "BLANK" ? {} : projects,
      }).as("getProjects");
    });

    cy.fixture("/GET/config.json")
      .then((config) => {
        cy.intercept("GET", "https://nucleoid.com/config", {
          statusCode: 200,
          body: config,
        });
      })
      .as("getConfig");

    if (type === "CLOUD") {
      let serviceId;
      const cloudProjectId = "a166cc16-5c76-4aac-819e-118207a5dfa9";

      cy.fixture("/GET/projects.json")
        .then((projects) => {
          const cloudProject = projects.find((p) => p.id === cloudProjectId);
          cy.intercept(
            "GET",
            `https://nuc.land/ide/api/projects/${cloudProjectId}`,
            {
              statusCode: 200,
              body: fixtureType === "BLANK" ? {} : cloudProject,
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
              body: fixtureType === "BLANK" ? {} : service,
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
              body: fixtureType === "BLANK" ? {} : context,
            }
          );
        })
        .as("context");
    } else if (type === "LOCAL") {
      if (fixtureType === "SEED" || "") {
        cy.fixture("/LOCAL/project").then((project) => {
          cy.storageSet(
            `ide.projects.3450f289-0fc5-45e9-9a4a-606c0a63cdfe`,
            project
          );
        });
      }
    }
  } else if (container === "Chat") {
    let seedData;
    let messages;

    cy.fixture("seedData").then((data) => {
      seedData = data;
    });
    cy.fixture("messages").then((data) => {
      messages = data;
    });

    cy.storageSet(
      `ide.chat.sessions.${seedData.chatData.id}`,
      seedData.chatData
    );
    cy.visit(`/ide/chat/${seedData.chatData.id}`);
  }
});

Cypress.Commands.add("typeEditor", (changedEditorValue) => {
  cy.get("section").should("be.visible");
  cy.get(".monaco-editor").should("be.visible");

  cy.get('textarea[role="textbox"]').click();
  cy.get('textarea[role="textbox"]').clear();
  cy.get('textarea[role="textbox"]').type(changedEditorValue, {
    parseSpecialCharSequences: false,
  });

  cy.wait(1000);
});

Cypress.Commands.add("saveContextIntercept", (serviceId) => {
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
});

// fullcheck
Cypress.Commands.add("checkEditorValue", (expectedValue) => {
  cy.get("section").should("be.visible");
  cy.get(".monaco-editor")
    .should("be.visible")
    .then(() => {
      cy.get('textarea[role="textbox"]')
        .invoke("val")
        .then((val) => {
          let expected = expectedValue;
          console.log(val, "val");
          expect(val.trim()).to.contain(expected.trim());
        });
    });
});

Cypress.Commands.add("waitEvent", (eventName) => {
  return cy.wrap(
    new Promise((resolve) => {
      cy.window().then(({ nucleoid: { Event } }) => {
        const registry = Event.subscribe(eventName, () => {
          registry.unsubscribe();

          resolve();
        });
      });
    }),
    { timeout: 10000 }
  );
});

/* eslint-enable */
