import "@testing-library/jest-dom";

import React from "react";
import Schema from "./Schema";
import { act } from "react-dom/test-utils";

import { fireEvent, render, screen } from "@testing-library/react";

describe("Schema Component Tests", () => {
  const initialSchema = {
    type: "object",
    properties: [
      { type: "string", name: "initial" },
      { type: "integer", name: "schema" },
      {
        type: "object",
        name: "object",
        properties: [{ type: "integer", name: "nested" }],
      },
    ],
  };

  test("Should render with initial schema", () => {
    render(<Schema initialData={initialSchema} />);

    expect(screen.getByText(/initial/)).toBeInTheDocument();
    expect(screen.getByText(/schema/)).toBeInTheDocument();

    // expect(screen.getByText(/nested/)).toBeInTheDocument();
  });

  test("Should initialize without initial data", () => {
    render(<Schema />);

    const expectedSchema = {
      type: "object",
      properties: [],
    };

    const outputSchema = Schema.schemaOutput();
    expect(outputSchema).toEqual(expectedSchema);
  });

  test("Should provide output correctly with initial data", () => {
    render(<Schema initialData={initialSchema} />);

    const outputSchema = Schema.schemaOutput();
    expect(outputSchema).toEqual(initialSchema);
  });

  test("Should add a new property", () => {
    const { container } = render(<Schema initialData={initialSchema} />);
    act(() => {
      Schema.addProperty({ type: "string", name: "additional" });
    });
    const currentSchema = Schema.schemaOutput();
    expect(currentSchema).toEqual({
      ...initialSchema,
      properties: [
        ...initialSchema.properties,
        { type: "string", name: "additional" },
      ],
    });
  });

  test("Should remove a property by ID", () => {
    const { container } = render(<Schema initialData={initialSchema} />);

    const currentSchemaWithIDs = Schema.schemaOutputWithIDs();

    const propertyToRemove = currentSchemaWithIDs.properties.find(
      (prop) => prop.name === "initial"
    );
    if (!propertyToRemove) {
      throw new Error("Property to remove not found");
    }
    act(() => {
      Schema.removeProperty(propertyToRemove.id);
    });

    const newCurrentSchema = Schema.schemaOutput();
    const isPropertyRemoved = newCurrentSchema.properties.every(
      (prop) => prop.name !== "initial"
    );
    expect(isPropertyRemoved).toBeTruthy();
  });

  test("Should change a property type and name", () => {
    const { container } = render(<Schema initialData={initialSchema} />);

    const currentSchemaWithIDs = Schema.schemaOutputWithIDs();

    const propertyToChange = currentSchemaWithIDs.properties.find(
      (prop) => prop.name === "initial"
    );
    if (!propertyToChange) {
      throw new Error("Property to change not found");
    }

    const change = {
      name: "initial2",
      type: "integer",
    };
    act(() => {
      Schema.changeProperty(propertyToChange.id, change);
    });
    const updatedSchemaWithIDs = Schema.schemaOutputWithIDs();

    const changedProperty = updatedSchemaWithIDs.properties.find(
      (prop) => prop.id === propertyToChange.id
    );
    expect(changedProperty).toBeDefined();
    expect(changedProperty.name).toBe(change.name);
    expect(changedProperty.type).toBe(change.type);
  });

  test("Should add a nested object and a property to it", () => {
    const { container } = render(<Schema initialData={initialSchema} />);

    const newNestedObject = { type: "object", name: "newNestedObject" };
    act(() => {
      Schema.addProperty(newNestedObject);
    });

    const currentSchemaWithIDs = Schema.schemaOutputWithIDs();
    console.log("currentSchemaWithIDs", currentSchemaWithIDs);

    const nestedObjectId = currentSchemaWithIDs.properties.find(
      (prop) => prop.name === "newNestedObject"
    ).id;
    if (!nestedObjectId) {
      throw new Error("Nested object not found");
    }

    const newPropertyForNestedObject = {
      type: "string",
      name: "nestedProperty",
    };
    act(() => {
      Schema.addProperty(newPropertyForNestedObject, nestedObjectId);
    });

    const updatedSchemaWithIDs = Schema.schemaOutputWithIDs();

    const updatedNestedObject = updatedSchemaWithIDs.properties.find(
      (prop) => prop.id === nestedObjectId
    );
    expect(updatedNestedObject).toBeDefined();
    const hasNestedProperty = updatedNestedObject.properties.some(
      (prop) =>
        prop.name === newPropertyForNestedObject.name &&
        prop.type === newPropertyForNestedObject.type
    );
    expect(hasNestedProperty).toBe(true);
  });

  test("Should add a property with a custom type", () => {
    const customTypes = [
      {
        name: "Item",
        type: "OPENAPI",
        schema: {
          name: "Item",
          type: "object",
          properties: [
            { type: "string", name: "id" },
            { type: "string", name: "name" },
            { type: "string", name: "barcode" },
          ],
        },
      },
    ];

    const { container } = render(
      <Schema initialData={initialSchema} customTypes={customTypes} />
    );

    const newPropertyWithCustomType = { type: "Item", name: "newItem" };
    act(() => {
      Schema.addProperty(newPropertyWithCustomType);
    });

    const updatedSchema = Schema.schemaOutput();
    const addedProperty = updatedSchema.properties.find(
      (prop) => prop.name === "newItem"
    );
    expect(addedProperty).toBeDefined();
    expect(addedProperty.type).toBe("Item");
  });
});
