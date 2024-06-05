/* eslint-disable */
import { mount } from "cypress/react18";

Cypress.Commands.add("mount", (component, options) => {
  return mount(component, options);
});

Cypress.Commands.add("setup", (container, fixtureType, type) => {
  cy.clearLocalStorage();
  cy.storageSet(`debug`, true);
  cy.storageSet(`ide.landing`, { level: Number.MAX_SAFE_INTEGER });
  cy.storageSet("oauth.token", { accesToken: "test", refreshToken: "test" });

  if (container === "IDE") {
    cy.fixture("/PROJECTS/projects.json").then((projects) => {
      cy.intercept("GET", "/projects", {
        statusCode: 200,
        body: fixtureType === "BLANK" ? {} : projects,
      }).as("getProjects");
    });

    cy.fixture("config.json")
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

      cy.fixture("/PROJECTS/projects.json")
        .then((projects) => {
          const cloudProject = projects.find((p) => p.id === cloudProjectId);
          cy.intercept("GET", `/projects/${cloudProjectId}`, {
            statusCode: 200,
            body: fixtureType === "BLANK" ? {} : cloudProject,
          });
        })
        .as("project");

      cy.fixture("/SERVICE/single-project-service.json")
        .then((service) => {
          cy.intercept("GET", `/projects/${cloudProjectId}/services`, {
            statusCode: 200,
            body: fixtureType === "BLANK" ? {} : service,
          });
          serviceId = service[0].id;
        })
        .as("services");

      cy.fixture("/SPECIFICATION/specification.json")
        .then((context) => {
          cy.intercept("GET", `/services/${serviceId}/specification`, {
            statusCode: 200,
            body: fixtureType === "BLANK" ? {} : context,
          });
        })
        .as("context");
    } else if (type === "LOCAL") {
      if (fixtureType === "SEED" || "") {
        cy.fixture("PROJECTS/LOCAL/project").then((context) => {
          const { project, types, functions, logic, api, declarations } =
            context;
          cy.storageSet(`ide.context.3450f289-0fc5-45e9-9a4a-606c0a63cdfe`, {
            project: project,
            specification: {
              api,
              logic,
              functions,
              types,
              declarations,
            },
          });
        });
      }
    }
  } else if (container === "CHAT") {
    if (fixtureType === "SEED" || "") {
      cy.fixture("CHAT/chat-data.json").then((data) => {
        cy.storageSet(`ide.chat.sessions.${data.id}`, data);
        cy.visit(`/chat/${data.id}`);
      });
    } else if (fixtureType === "BLANK") {
      cy.fixture("CHAT/empty-chat-data.json").then((data) => {
        cy.storageSet(`ide.chat.sessions.${data.id}`, data);
        cy.visit(`/chat/${data.id}`);
      });
    }
  }
});

Cypress.Commands.add("typeEditor", (changedEditorValue) => {
  cy.get("section").should("be.visible");
  cy.get(".monaco-editor").should("be.visible");

  cy.get('textarea[role="textbox"]').focus().clear({ force: true });

  cy.get('textarea[role="textbox"]').type(changedEditorValue, {
    force: true,
    parseSpecialCharSequences: false,
  });

  cy.wait(1000);
});

Cypress.Commands.add("sendMessage", (message, fixture) => {
  cy.intercept("POST", "/chat/sessions/*", (req) => {
    if (req.body.content === message) {
      req.reply({
        statusCode: 200,
        fixture: fixture,
      });
    }
  }).as("postMessage");

  cy.getBySel("message-input").type(message);
  cy.getBySel("send-button").click();

  cy.wait("@postMessage");
});

Cypress.Commands.add(
  "checkMessageResponse",
  (role, content, length, codeContent, messageIndex) => {
    cy.getBySel("message-box")
      .should("have.length.at.least", length)
      .as("messageBoxes");

    if (messageIndex === "last") {
      cy.get("@messageBoxes").then(($boxes) => {
        cy.wrap($boxes.last()).as("messageBox");
      });
    } else if (typeof messageIndex === "number") {
      cy.get("@messageBoxes").then(($boxes) => {
        cy.wrap($boxes.eq(messageIndex)).as("messageBox");
      });
    }

    cy.get("@messageBox").within(() => {
      cy.getBySel("message-role").should("have.text", role);
      cy.getBySel("message-content").should("have.text", content);
      if (codeContent) {
        cy.getBySel("code-block").should("contain.text", codeContent);
      }
    });
  }
);

Cypress.Commands.add("saveContextIntercept", (serviceId) => {
  cy.fixture("/SPECIFICATION/changed-specification.json")
    .then((specification) => {
      cy.intercept("PUT", `services/${serviceId}/specification`, {
        statusCode: 200,
        body: specification,
      });
    })
    .as("contextPut");

  cy.fixture("/SPECIFICATION/changed-specification.json")
    .then((specification) => {
      cy.intercept("GET", `/services/${serviceId}/specification`, {
        statusCode: 200,
        body: specification,
      });
    })
    .as("contextGet");
});

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

Cypress.Commands.add("normalizeString", (str) => str.replace(/\s/g, ""));

Cypress.Commands.add("openAPIDialog", (mode) => {
  if (mode === "edit") {
    cy.getBySel("edit-api-button").click();
  } else if (mode === "method") {
    cy.getBySel("resource-menu").click();
    cy.getBySel("add-method").click();
  } else if (mode === "resource") {
    cy.getBySel("resource-menu").click();
    cy.getBySel("add-resource").click();
  }
});

Cypress.Commands.add("apitreeSelectMethod", (methodName) => {
  cy.get(`[data-cy^="method-${methodName}"]`).click();
});

Cypress.Commands.add(
  "apitreeClickOtherMethodAndReturn",
  (originalMethod, otherMethod) => {
    cy.get(`[data-cy^="method-${otherMethod}"]`).click();
    cy.get(`[data-cy^="method-${originalMethod}"]`).click();
  }
);

Cypress.Commands.add("schemaEditorEditType", (propertyIndex, newType) => {
  cy.getBySel("response-schema-editor")
    .find(`[data-cy^='property-type-select-']`)
    .eq(propertyIndex)
    .click();
  cy.getBySel(`property-type-option-${newType}`).click();
});

Cypress.Commands.add(
  "schemaEditorVerifyType",
  (propertyIndex, expectedType) => {
    cy.getBySel("response-schema-editor")
      .find(`[data-cy^='property-type-select-']`)
      .eq(propertyIndex)
      .should("contain", expectedType);
  }
);

Cypress.Commands.add("schemaEditorAddProperty", (parentIndex = 0) => {
  cy.getBySel("response-schema-editor")
    .find(`[data-cy^='add-property-button-']`)
    .eq(parentIndex)
    .click();
});

Cypress.Commands.add("addParam", (name, description, required) => {
  cy.getBySel("api-params")
    .find("[data-cy^='param-name-field-'] input")
    .then(($params) => {
      const initialParamCount = $params.length;

      cy.getBySel("add-param-button").click();

      cy.getBySel("api-params")
        .find("[data-cy^='param-name-field-'] input")
        .should("have.length", initialParamCount + 1);

      cy.getBySel("api-params")
        .find("[data-cy^='param-name-field-'] input")
        .eq(initialParamCount)
        .clear()
        .type(name);

      cy.getBySel("api-params")
        .find("[data-cy^='param-description-field-'] input")
        .eq(initialParamCount)
        .clear()
        .type(description);

      if (!required) {
        cy.getBySel("api-params")
          .find("[data-cy^='param-required-checkbox-'] input")
          .eq(initialParamCount)
          .click();
      }

      cy.getBySel("save-api-button").click();
      cy.openAPIDialog("EDIT").click();

      cy.getBySel("params-toggle").click();
    });
});

Cypress.Commands.add(
  "updateParam",
  (index, newName, newDescription, required) => {
    cy.getBySel("api-params")
      .find(`[data-cy^='param-name-field-'] input`)
      .eq(index)
      .clear()
      .type(newName);

    cy.getBySel("api-params")
      .find(`[data-cy^='param-description-field-'] input`)
      .eq(index)
      .clear()
      .type(newDescription);

    if (!required) {
      cy.getBySel("api-params")
        .find(`[data-cy^='param-required-checkbox-'] input`)
        .eq(index)
        .check();
    } else {
      cy.getBySel("api-params")
        .find(`[data-cy^='param-required-checkbox-'] input`)
        .eq(index)
        .uncheck();
    }
  }
);

Cypress.Commands.add(
  "verifyParam",
  (index, expectedName, expectedDescription, isChecked) => {
    cy.getBySel("api-params")
      .find(`[data-cy^='param-name-field-'] input`)
      .eq(index)
      .should("have.value", expectedName);

    cy.getBySel("api-params")
      .find(`[data-cy^='param-description-field-'] input`)
      .eq(index)
      .should("have.value", expectedDescription);

    cy.getBySel("api-params")
      .find(`[data-cy^='param-required-checkbox-'] input`)
      .eq(index)
      .should(isChecked ? "be.checked" : "not.be.checked");
  }
);

/* eslint-enable */
