Cypress.Commands.add("checkStorage", (key, expectedValue) => {
  cy.window().should((win) => {
    const actualValue = win.localStorage.getItem(key);
    expect(actualValue).to.eq(expectedValue);
  });
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

Cypress.Commands.add("getBySel", (selector, ...args) => {
  return cy.get(`[data-cy=${selector}]`, ...args);
});

Cypress.Commands.add("waitEvent", (eventName) => {
  cy.window().then((window) => {
    const { Event } = window["@nucleoidai"];

    return new Cypress.Promise((resolve) => {
      Event.subscribe(eventName, (payload) => {
        cy.log("react-event", eventName, payload);
        resolve();
      });
    });
  });
});

Cypress.Commands.add("checkRoute", (route) => {
  cy.url().should("include", route);
});
