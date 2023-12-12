import "@testing-library/jest-dom";

import React from "react";
import SchemaEditor from "./SchemaEditor";
import { act } from "react-dom/test-utils";

import { render, screen } from "@testing-library/react";

describe("SchemaEditor Component", () => {
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

  test("renders with initial schema", () => {
    render(<SchemaEditor initialData={initialSchema} />);

    expect(screen.getByText(/initial/)).toBeInTheDocument();
    expect(screen.getByText(/schema/)).toBeInTheDocument();

    // expect(screen.getByText(/nested/)).toBeInTheDocument();
  });

  test("initializes without initial data", () => {
    render(<SchemaEditor />);

    const expectedSchema = {
      type: "object",
      properties: [],
    };

    const outputSchema = SchemaEditor.schemaOutput();
    expect(outputSchema).toEqual(expectedSchema);
  });

  test("provides output correctly with initial data", () => {
    render(<SchemaEditor initialData={initialSchema} />);

    const outputSchema = SchemaEditor.schemaOutput();
    expect(outputSchema).toEqual(initialSchema);
  });

  test("adds a new property", () => {
    render(<SchemaEditor initialData={initialSchema} />);
    act(() => {
      SchemaEditor.addProperty({ type: "string", name: "additional" });
    });
    const currentSchema = SchemaEditor.schemaOutput();
    expect(currentSchema).toEqual({
      ...initialSchema,
      properties: [
        ...initialSchema.properties,
        { type: "string", name: "additional" },
      ],
    });
  });

  test("removes a property by ID", () => {
    render(<SchemaEditor initialData={initialSchema} />);

    const currentSchemaWithIDs = SchemaEditor.schemaOutputWithIDs();

    const propertyToRemove = currentSchemaWithIDs.properties.find(
      (prop) => prop.name === "initial"
    );
    if (!propertyToRemove) {
      throw new Error("Property to remove not found");
    }
    act(() => {
      SchemaEditor.removeProperty(propertyToRemove.id);
    });

    const newCurrentSchema = SchemaEditor.schemaOutput();
    const isPropertyRemoved = newCurrentSchema.properties.every(
      (prop) => prop.name !== "initial"
    );
    expect(isPropertyRemoved).toBeTruthy();
  });

  test("changes a property type and name", () => {
    render(<SchemaEditor initialData={initialSchema} />);

    const currentSchemaWithIDs = SchemaEditor.schemaOutputWithIDs();

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
      SchemaEditor.changeProperty(propertyToChange.id, change);
    });
    const updatedSchemaWithIDs = SchemaEditor.schemaOutputWithIDs();

    const changedProperty = updatedSchemaWithIDs.properties.find(
      (prop) => prop.id === propertyToChange.id
    );
    expect(changedProperty).toBeDefined();
    expect(changedProperty.name).toBe(change.name);
    expect(changedProperty.type).toBe(change.type);
  });

  test("adds a nested object and a property to it", () => {
    render(<SchemaEditor initialData={initialSchema} />);

    const newNestedObject = { type: "object", name: "newNestedObject" };
    act(() => {
      SchemaEditor.addProperty(newNestedObject);
    });

    const currentSchemaWithIDs = SchemaEditor.schemaOutputWithIDs();

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
      SchemaEditor.addProperty(newPropertyForNestedObject, nestedObjectId);
    });

    const updatedSchemaWithIDs = SchemaEditor.schemaOutputWithIDs();

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

  test("adds a property with a custom type", () => {
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

    render(
      <SchemaEditor initialData={initialSchema} customTypes={customTypes} />
    );

    const newPropertyWithCustomType = { type: "Item", name: "newItem" };
    act(() => {
      SchemaEditor.addProperty(newPropertyWithCustomType);
    });

    const updatedSchema = SchemaEditor.schemaOutput();
    const addedProperty = updatedSchema.properties.find(
      (prop) => prop.name === "newItem"
    );
    expect(addedProperty).toBeDefined();
    expect(addedProperty.type).toBe("Item");
  });
});
