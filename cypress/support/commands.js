// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

/* eslint-disable */
import { mount } from "cypress/react18";

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

Cypress.Commands.add("cloudProjectIntercept", (projectId) => {
  let serviceId;

  cy.fixture("/GET/projects.json").then((projects) => {
    const cloudProject = projects.find((p) => p.id === projectId);
    cy.intercept("GET", `https://nuc.land/ide/api/projects/${projectId}`, {
      statusCode: 200,
      body: cloudProject,
    });
  });

  cy.fixture("/GET/single-project-service.json").then((service) => {
    cy.intercept(
      "GET",
      `https://nuc.land/ide/api/projects/${projectId}/services`,
      {
        statusCode: 200,
        body: service,
      }
    );
    serviceId = service[0].id;
  });

  cy.fixture("/GET/context.json").then((context) => {
    cy.intercept(
      "GET",
      `https://nuc.land/ide/api/services/${serviceId}/context`,
      {
        statusCode: 200,
        body: context,
      }
    );
  });
});

/* eslint-enable */
