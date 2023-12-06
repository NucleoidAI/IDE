/* eslint-disable */
import APITypes from "../../src/components/APITypes";
import React from "react";

describe("APITypes Component", () => {
  const apiData = [
    {
      name: "Item",
      type: "OPENAPI",
      schema: {
        name: "Item",
        type: "object",
        properties: [
          {
            type: "string",
            name: "id",
          },
          {
            type: "string",
            name: "name",
          },
          {
            type: "string",
            name: "barcode",
          },
        ],
      },
    },
    {
      name: "Order",
      type: "OPENAPI",
      schema: {
        type: "object",
        name: "Order",
        properties: [
          {
            name: "id",
            type: "string",
          },
          {
            name: "qty",
            type: "number",
          },
          {
            name: "item",
            type: "ref",
            ref: "Item",
          },
        ],
      },
    },
    {
      name: "Adresses",
      type: "OPENAPI",
      schema: {
        name: "Adresses",
        type: "array",
        properties: [
          {
            name: "Adress",
            type: "object",
            properties: [
              {
                name: "title",
                type: "string",
              },
              {
                name: "code",
                type: "number",
              },
              {
                name: "adress",
                type: "string",
              },
              {
                name: "UserList",
                type: "array",
                properties: [
                  {
                    name: "User",
                    type: "object",
                    properties: [
                      {
                        name: "name",
                        type: "string",
                      },
                      {
                        name: "age",
                        type: "number",
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    },
    {
      name: "User",
      type: "OPENAPI",
      schema: {
        name: "User",
        type: "object",
        properties: [
          {
            name: "name",
            type: "string",
          },
          {
            name: "age",
            type: "number",
          },
        ],
      },
    },
    {
      name: "Users",
      type: "OPENAPI",
      schema: {
        name: "Users",
        type: "array",
        properties: [
          {
            name: "user",
            type: "ref",
            ref: "User",
          },
        ],
      },
    },
    {
      name: "Order1",
      type: "TS",
      schema: {
        name: "Order1",
        type: "object",
        properties: [
          {
            name: "item",
            type: "ref",
            ref: "Item1",
          },
          {
            name: "qty",
            type: "number",
          },
          {
            name: "date",
            type: "number",
          },
          {
            name: "backReference",
            type: "ref",
            ref: "Order1",
          },
        ],
      },
    },
    {
      name: "Item1",
      type: "TS",
      schema: {
        name: "Item1",
        type: "object",
        properties: [
          {
            name: "name",
            type: "string",
          },
          {
            name: "barcode",
            type: "string",
          },
          {
            name: "adress",
            type: "ref",
            ref: "Adress1",
          },
          {
            name: "relatedOrder",
            type: "ref",
            ref: "Order1",
          },
        ],
      },
    },
    {
      name: "Adress1",
      type: "TS",
      schema: {
        name: "Adress1",
        type: "object",
        properties: [
          {
            name: "name",
            type: "string",
          },
        ],
      },
    },
  ];
  beforeEach(() => {
    cy.mount(<APITypes apiData={apiData} />);
  });

  it("mounts successfully", () => {
    cy.get('[aria-label="api data tree"]').should("be.visible");
    cy.contains(apiData[0].name).should("be.visible");
  });

  it("changes the tree on the right when you click the menu on the left", () => {
    cy.get("nav").contains("Order").click();

    cy.get('[aria-label="api data tree"]').should("contain", "Order (object)");

    apiData
      .find((item) => item.name === "Order")
      .schema.properties.forEach((property) => {
        let expectedLabel = `${property.name} (${property.type})`;
        if (property.type === "ref") {
          expectedLabel = `${property.ref} (ref)`;
        }
        cy.get('[aria-label="api data tree"]').should("contain", expectedLabel);
      });
  });

  it("displays schema with nested types", () => {
    const nestedSchema = apiData.find((item) => item.name === "Order");

    cy.get("nav").contains("Order").click();

    nestedSchema.schema.properties.forEach((property) => {
      if (property.type === "object" || property.type === "array") {
        cy.get('[aria-label="api data tree"]').should(
          "contain",
          `${property.name} (${property.type})`
        );
        property.properties.forEach((nestedProp) => {
          cy.get('[aria-label="api data tree"]').should(
            "contain",
            `${nestedProp.name} (${nestedProp.type})`
          );
        });
      }
    });
  });

  it("displays schema with referenced nested types", () => {
    const refSchema = apiData.find((item) => item.name === "Order");

    cy.get("nav").contains("Order").click();

    refSchema.schema.properties.forEach((property) => {
      if (property.type === "ref") {
        cy.get('[aria-label="api data tree"]').should(
          "contain",
          `${property.ref} (ref)`
        );
      }
    });
  });

  it("displays schema with cross-referenced nested types", () => {
    cy.get("nav").contains("Order1").click();

    cy.get('[aria-label="api data tree"]').should("contain", "Item1 (ref)");

    cy.get("nav").contains("Item1").click();

    cy.get('[aria-label="api data tree"]').should("contain", "Order1 (ref)");
  });
});
