//import { useContext } from "../context";
import { v4 as uuid } from "uuid";
import { Divider, MenuItem, Select } from "@mui/material";
import { forwardRef, useState } from "react";
const TypeMenu = forwardRef(
  ({ id, type, types, map, edit, noNested, rf, setRf }, ref) => {
    const [selectedType, setSelectedType] = useState(type);

    function updateType(id, value) {
      //TODO two cases, if array selected delete all keys and add items, object selected add properties
      //TODO adapt to params, ref for this feature

      const newId = uuid();
      switch (value) {
        case "array":
          if (map.type === "object") delete map["properties"];
          map.type = "array";
          map["items"] = {
            [newId]: {
              id: newId,
              type: "integer",
              name: "id",
            },
          };

          break;
        case "object":
          if (map.type === "array") delete map["items"];
          map["properties"] = {};
          map.type = "object";

          break;
        default:
          if (ref) {
            ref[id].type = value;
          } else {
            map.type = value;
          }

          break;
      }
      if (setRf) setRf(!rf);
      setSelectedType(value);
    }

    //TODO refactor global types
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
  }
);

export default TypeMenu;
