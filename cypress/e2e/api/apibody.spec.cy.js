describe("APIDialog", () => {
  beforeEach(() => {
    cy.setup("IDE", "SEED", "LOCAL");
    cy.fixture("PROJECTS/LOCAL/project.json").as("project");
    cy.wrap("3450f289-0fc5-45e9-9a4a-606c0a63cdfe").as("projectId");
  });

  describe("in edit Mode", () => {
    beforeEach(() => {
      cy.get("@projectId").then((projectId) => {
        cy.visit(`/${projectId}/api?mode=local`);
      });
      cy.waitEvent("CONTAINER_LOADED").then(() => {
        cy.getBySel("edit-api-button").click();
      });
    });

    it("should navigate between params, body, and types", () => {
      cy.getBySel("api-body").should("be.visible");
      cy.getBySel("params-toggle").click();
      cy.getBySel("api-params").should("be.visible");
      cy.getBySel("types-button").click();
      cy.getBySel("api-types").should("be.visible");
    });

    it("should edit schema of response and save it", () => {
      cy.getBySel("response-schema-editor")
        .find("[data-cy^='property-type-select-']")
        .then(($properties) => {
          const initialPropertyCount = $properties.length;

          cy.getBySel("response-schema-editor")
            .find("[data-cy^='add-property-button-']")
            .first()
            .click();

          cy.getBySel("response-schema-editor")
            .find("[data-cy^='property-type-select-']")
            .should("have.length", initialPropertyCount + 1);

          cy.getBySel("response-schema-editor")
            .find("[data-cy^='property-name-field-']")
            .eq(1)
            .clear()
            .type("test");

          cy.getBySel("response-schema-editor")
            .find("[data-cy^='property-type-select-']")
            .eq(1)
            .click();

          cy.getBySel("property-type-option-number").click();

          cy.getBySel("save-api-button").click();
          cy.getBySel("edit-api-button").click();

          cy.getBySel("response-schema-editor")
            .find("[data-cy^='property-type-select-']")
            .should("have.length", initialPropertyCount + 1);

          cy.getBySel("response-schema-editor")
            .find("[data-cy^='property-name-field-']")
            .eq(1)
            .find("input")
            .should("have.value", "test");

          cy.getBySel("response-schema-editor")
            .find("[data-cy^='property-type-select-']")
            .eq(1)
            .should("contain", "number");
        });
    });

    it("should change property of a schema to array and not allow more than one property inside", () => {
      cy.getBySel("response-schema-editor")
        .find("[data-cy^='property-type-select-']")
        .first()
        .click();

      cy.getBySel("property-type-option-array").click();

      cy.getBySel("response-schema-editor")
        .find("[data-cy^='add-property-button-']")
        .first()
        .should("be.disabled");

      cy.getBySel("save-api-button").click();
      cy.getBySel("edit-api-button").click();

      cy.getBySel("response-schema-editor")
        .find("[data-cy^='property-type-select-']")
        .first()
        .should("contain", "array");

      cy.getBySel("response-schema-editor")
        .find("[data-cy^='add-property-button-']")
        .first()
        .should("be.disabled");
    });

    it("should add a new type, edit it using SchemaEditor, and save it", () => {
      cy.getBySel("types-button").click();
      cy.getBySel("api-types").should("be.visible");

      cy.getBySel("add-type-button").click();

      const newTypeName = "TestType";
      cy.getBySel("type-name-input").type(newTypeName);

      cy.getBySel("confirm-type-button").click();

      cy.getBySel(`type-list-item-${newTypeName}`).should("be.visible");

      cy.getBySel("type-schema-editor")
        .find("[data-cy^='add-property-button-']")
        .first()
        .click();

      cy.getBySel("type-schema-editor")
        .find("[data-cy^='property-name-field-']")
        .eq(1)
        .clear()
        .type("testField");

      cy.getBySel("type-schema-editor")
        .find("[data-cy^='property-type-select-']")
        .eq(1)
        .click();

      cy.getBySel("property-type-option-string").click();

      cy.getBySel("save-api-button").click();

      cy.getBySel("edit-api-button").click();

      cy.getBySel("types-button").click();

      cy.getBySel(`type-list-item-${newTypeName}`).should("be.visible");

      cy.getBySel(`type-list-item-${newTypeName}`).click();

      cy.getBySel("type-schema-editor")
        .find("[data-cy^='property-name-field-']")
        .eq(1)
        .find("input")
        .should("have.value", "testField");

      cy.getBySel("type-schema-editor")
        .find("[data-cy^='property-type-select-']")
        .eq(1)
        .should("contain", "string");
    });

    it("should add a new parameter with name and description and save it", () => {
      cy.getBySel("params-toggle").click();
      cy.getBySel("api-params").should("be.visible");

      cy.getBySel("api-params")
        .find("[data-cy^='param-name-field-'] input")
        .then(($params) => {
          const initialParamCount = $params.length;

          cy.getBySel("add-param-button").click();

          cy.getBySel("api-params")
            .find("[data-cy^='param-name-field-'] input")
            .should("have.length", initialParamCount + 1);

          const newParamName = "newParam";
          const newParamDescription = "Newparameterdescription";
          cy.getBySel("api-params")
            .find("[data-cy^='param-name-field-'] input")
            .eq(initialParamCount)
            .clear()
            .type(newParamName);

          cy.getBySel("api-params")
            .find("[data-cy^='param-description-field-'] input")
            .eq(initialParamCount)
            .clear()
            .type(newParamDescription);

          cy.getBySel("save-api-button").click();

          cy.getBySel("edit-api-button").click();

          cy.getBySel("params-toggle").click();

          cy.getBySel("api-params")
            .find("[data-cy^='param-name-field-'] input")
            .should("have.length", initialParamCount + 1);

          cy.getBySel("api-params")
            .find("[data-cy^='param-name-field-'] input")
            .eq(initialParamCount)
            .should("have.value", newParamName);

          cy.getBySel("api-params")
            .find("[data-cy^='param-description-field-'] input")
            .eq(initialParamCount)
            .should("have.value", newParamDescription);
        });
    });

    it("should delete the selected method", () => {
      cy.getBySel("close-dialog-button").click();

      cy.get('[data-cy^="method-"]').then(($methods) => {
        const methodCount = $methods.length;

        if (methodCount >= 2) {
          cy.get('[data-cy^="method-"]')
            .eq(1)
            .then(($method) => {
              const methodName = $method.attr("data-cy");
              cy.wrap($method).click();

              cy.getBySel("edit-api-button").click();

              cy.getBySel("delete-api-button").click();

              cy.getBySel("delete-api-button-yes").click();

              cy.get('[data-cy^="method-"]').should(
                "have.length",
                methodCount - 1
              );
              cy.get(`[data-cy="${methodName}"]`).should("not.exist");
            });
        }
      });
    });

    it("should not allow deleting the root path", () => {
      expect(true).to.be.false;
    });
  });

  describe("in method adding mode", () => {
    beforeEach(() => {
      cy.get("@projectId").then((projectId) => {
        cy.visit(`/${projectId}/api?mode=local`);
      });
      cy.waitEvent("CONTAINER_LOADED").then(() => {
        cy.getBySel("resource-menu").click();
        cy.getBySel("add-method").click();
      });
    });

    it("should open dialog in add method mode", () => {
      cy.getBySel("method-select").should("be.visible");
    });

    it("should not allow duplicate methods", () => {
      expect(true).to.be.false;
    });

    it("should allow addition of new method and save it to correct path", () => {
      expect(true).to.be.false;
    });
  });

  describe("in resource adding mode", () => {
    beforeEach(() => {
      cy.get("@projectId").then((projectId) => {
        cy.visit(`/${projectId}/api?mode=local`);
      });
      cy.waitEvent("CONTAINER_LOADED").then(() => {
        cy.getBySel("resource-menu").click();
        cy.getBySel("add-resource").click();
      });
    });

    it("should open dialog in add resource mode", () => {
      cy.getBySel("path-input").should("be.visible");
    });

    it("should add a new resource and save it correctly", () => {
      expect(true).to.be.false;
    });

    it("should not allow duplicate paths and disable the save button", () => {
      expect(true).to.be.false;
    });
  });
});
