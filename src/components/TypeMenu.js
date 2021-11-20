import React from "react";
import { useContext } from "../context";
import { v4 as uuid } from "uuid";
import { Divider, MenuItem, Select } from "@material-ui/core";

function TypeMenu({ id, type, edit, noNested }) {
  const dispatch = useContext()[1];

  return (
    <>
      {edit && (
        <Select
          value={type}
          onChange={(event) =>
            dispatch({
              type: "UPDATE_TYPE",
              payload: { id, type: event.target.value },
            })
          }
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
}

export default TypeMenu;
