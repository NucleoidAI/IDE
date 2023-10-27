import Defaults from "../defaults";
import { v4 as uuid } from "uuid";

import { Divider, MenuItem, Select } from "@mui/material";
import { forwardRef, useState } from "react";

const TypeMenu = forwardRef(
  (
    {
      id,
      type,
      types,
      map,
      edit,
      setKey,
      primitive,
      objAndArr,
      globalTypes,
      disabled,
    },
    ref
  ) => {
    const [selectedType, setSelectedType] = useState(type);

    function updateType(id, value) {
      if (ref) {
        ref[id].type = value;
      } else {
        switch (value) {
          case "array":
            if (map.type === "object") delete map["properties"];
            map.type = "array";
            map["items"] = Defaults.compiledObject(uuid(), uuid());

            break;
          case "object":
            if (map.type === "array") delete map["items"];
            map.type = "object";
            map["properties"] = Defaults.compiledProperty(uuid());

            break;
          default:
            if (map["properties"]) delete map["properties"];
            if (map["items"]) delete map["items"];
            map.type = value;

            break;
        }
      }
      setKey && setKey(uuid());
      setSelectedType(value);
    }

    return (
      <>
        {edit && (
          <Select
            disabled={disabled}
            value={selectedType}
            onChange={(event) => {
              updateType(id, event.target.value);
            }}
          >
            {primitive && [
              <MenuItem key={uuid()} value={"integer"}>
                integer
              </MenuItem>,
              <MenuItem key={uuid()} value={"string"}>
                string
              </MenuItem>,
              <MenuItem key={uuid()} value={"boolean"}>
                boolean
              </MenuItem>,
              <Divider key={uuid()} id={uuid()} />,
            ]}

            {objAndArr && [
              <MenuItem key={uuid()} id={uuid()} value={"object"}>
                object
              </MenuItem>,
              <MenuItem key={uuid()} id={uuid()} value={"array"}>
                array
              </MenuItem>,
            ]}
            {globalTypes && <Divider />}
            {globalTypes &&
              types.map((item) => {
                return (
                  <MenuItem key={uuid()} id={uuid()} value={item.name}>
                    {item.name}
                  </MenuItem>
                );
              })}
          </Select>
        )}
        {!edit && <>{type}</>}
      </>
    );
  }
);

export default TypeMenu;
