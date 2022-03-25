//import { useStore } from "../store";
import { v4 as uuid } from "uuid";
import { Divider, MenuItem, Select } from "@mui/material";

import { forwardRef, useState } from "react";

const newArray = (objID, objPropID) => {
  return {
    [objID]: {
      type: "object",
      id: objID,
      properties: newObject(objPropID),
    },
  };
};

const newObject = (id) => {
  return {
    [id]: {
      id: id,
      name: "id",
      type: "integer",
    },
  };
};

const TypeMenu = forwardRef(({ id, type, types, map, edit, noNested }, ref) => {
  //const [, dispatch] = useStore();
  const [selectedType, setSelectedType] = useState(type);

  function updateType(id, value) {
    //TODO adapt to params, ref for this feature

    switch (value) {
      case "array":
        if (map.type === "object") delete map["properties"];
        map.type = "array";
        map["items"] = newArray(uuid(), uuid());

        break;
      case "object":
        if (map.type === "array") delete map["items"];
        map.type = "object";
        map["properties"] = newObject(uuid());

        break;
      default:
        if (ref) {
          ref[id].type = value;
        } else {
          if (map["properties"]) delete map["properties"];
          if (map["items"]) delete map["items"];
          map.type = value;
        }

        break;
    }
    //TODO decide how to render, context doesnt work, if trigger context, apidialog rerender and run compile methods again.
    // dispatch({ type: "" });
    setSelectedType(value);
  }

  //TODO refactor for global types
  return (
    <>
      {edit && (
        <Select
          value={selectedType}
          onChange={(event) => {
            updateType(id, event.target.value);
          }}
        >
          <MenuItem value={"integer"}>integer</MenuItem>
          <MenuItem value={"string"}>string</MenuItem>
          <MenuItem value={"boolean"}>boolean</MenuItem>
          {!noNested && [
            <Divider key={uuid()} id={uuid()} />,
            <MenuItem key={uuid()} id={uuid()} value={"object"}>
              object
            </MenuItem>,
            <MenuItem key={uuid()} id={uuid()} value={"array"}>
              array
            </MenuItem>,
          ]}
          <Divider />
          {types.map((item, id) => (
            <MenuItem
              key={uuid()}
              id={uuid()}
              value={item[Object.keys(item)].name}
            >
              {item[Object.keys(item)].name}
            </MenuItem>
          ))}
        </Select>
      )}
      {!edit && <>{type}</>}
    </>
  );
});

export default TypeMenu;
