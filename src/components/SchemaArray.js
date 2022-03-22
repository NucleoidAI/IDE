//import TextField from "@mui/material/TextField";
import React from "react";
import TreeItem from "@mui/lab/TreeItem";
//import TypeMenu from "./TypeMenu"; { useRef, useState }


function SchemaArray({ id, name, children, edit, map, type, types, ...other }) {
  return (
    <TreeItem
      onClick={(event) => event.preventDefault()}
      label={<>&#91;</>}
      {...other}
    >
      <br />
      &nbsp;&nbsp;&nbsp;&nbsp;
      {children}
      <br />
      &nbsp;&nbsp;&#93;
    </TreeItem>
  );
}

export default SchemaArray;
