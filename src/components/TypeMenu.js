//import { useContext } from "../context";
import { v4 as uuid } from "uuid";
import { Divider, MenuItem, Select } from "@material-ui/core";
import { forwardRef, useState } from "react";
const TypeMenu = forwardRef(({ id, type, map, edit, noNested }, ref) => {
  const [selectedType, setSelectedType] = useState(type);

  function updateType(id, value) {
    if (ref) {
      ref[id].type = value;
    } else {
      map.type = value;
    }
    setSelectedType(value);
  }

  return (
    <>
      {edit && (
        <Select
          value={selectedType}
          onChange={(event) => updateType(id, event.target.value)}
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
          <MenuItem value={"Order"}>Order</MenuItem>
          <MenuItem value={"Item"}>Item</MenuItem>
        </Select>
      )}
      {!edit && <>{type}</>}
    </>
  );
});

export default TypeMenu;
