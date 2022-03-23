//import { useContext } from "../context";
import { v4 as uuid } from "uuid";
import { Divider, MenuItem, Select } from "@mui/material";
import { forwardRef, useState } from "react";
const TypeMenu = forwardRef(({ id, type, types, map, edit, noNested }, ref) => {
  const [selectedType, setSelectedType] = useState(type);

  function updateType(id, value) {
    //TODO two cases, if array selected delete all keys and add items, object selected add properties
    if (ref) {
      ref[id].type = value;
    } else {
      map.type = value;
    }
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
          {types.map((item) => (
            <MenuItem value={item[Object.keys(item)].name}>
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
