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
    console.log("rendering ");
    render(<SchemaEditor initialData={initialSchema} />);

    expect(screen.getByDisplayValue(/initial/)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/schema/)).toBeInTheDocument();

    // expect(screen.getByText(/nested/)).toBeInTheDocument();
  });

  test("initializes without initial data", () => {
    console.log("initializing without initial data");
    render(<SchemaEditor />);

    const expectedSchema = {
      type: "object",
      properties: [],
    };

    const outputSchema = SchemaEditor.schemaOutput();
    expect(outputSchema).toEqual(expectedSchema);
  });

  test("provides output correctly with initial data", () => {
    console.log("provides output correctly with initial data");
    render(<SchemaEditor initialData={initialSchema} />);

    const outputSchema = SchemaEditor.schemaOutput();
    expect(outputSchema).toEqual(initialSchema);
  });

  test("adds a new property", () => {
    console.log("adds a new property");
    const emptySchema = { type: "object", properties: [] };
    render(<SchemaEditor initialData={emptySchema} />);

    act(() => {
      SchemaEditor.addProperty(null);
    });

    let updatedSchema = SchemaEditor.schemaOutput();
    expect(updatedSchema.properties).toHaveLength(1);
    expect(updatedSchema.properties[0].name).toBe("id");

    act(() => {
      SchemaEditor.addProperty(null);
    });

    updatedSchema = SchemaEditor.schemaOutput();
    expect(updatedSchema.properties).toHaveLength(2);
    expect(updatedSchema.properties[1].name).toBe("prop2");
  });

  test("removes a property by ID", () => {
    console.log("removes a property by ID");
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
    console.log("changes a property type and name");
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
    console.log("adds a nested object and a property to it");
    render(<SchemaEditor initialData={initialSchema} />);

    act(() => {
      SchemaEditor.addProperty(null);
    });

    let updatedSchemaWithIDs = SchemaEditor.schemaOutputWithIDs();
    const newNestedObjectId = updatedSchemaWithIDs.properties.find(
      (prop) => prop.name === "prop4"
    ).id;

    act(() => {
      SchemaEditor.addProperty(newNestedObjectId);
    });

    updatedSchemaWithIDs = SchemaEditor.schemaOutputWithIDs();
    const updatedNestedObject = updatedSchemaWithIDs.properties.find(
      (prop) => prop.id === newNestedObjectId
    );
    console.log("updatedNestedObject: ", updatedNestedObject);
    expect(updatedNestedObject).toBeDefined();
    expect(updatedNestedObject.name).toBe("prop4");
  });

  test("changes a property to custom type", () => {
    console.log("changes a property to custom type");
    const customTypes = [
      {
        name: "Item",
        schema: {
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

    const currentSchemaWithIDs = SchemaEditor.schemaOutputWithIDs();
    const propertyToChange = currentSchemaWithIDs.properties[0];

    const change = {
      type: "Item",
    };

    act(() => {
      SchemaEditor.changeProperty(propertyToChange.id, change);
    });

    const updatedSchemaWithIDs = SchemaEditor.schemaOutputWithIDs();
    const updatedProperty = updatedSchemaWithIDs.properties.find(
      (prop) => prop.id === propertyToChange.id
    );
    expect(updatedProperty).toBeDefined();
    expect(updatedProperty.type).toBe("Item");
  });
});
