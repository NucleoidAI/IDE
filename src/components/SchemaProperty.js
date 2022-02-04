import TextField from "@mui/material/TextField";
import TreeItem from "@mui/lab/TreeItem";
import TypeMenu from "./TypeMenu";
import React, { useRef, useState } from "react";

function SchemaProperty({ id, name, map, type, edit, ...other }) {
  const [value, setValue] = useState(name);
  const textField = useRef();

  return (
    <TreeItem
      label={
        <>
          {edit && (
            <TextField
              size={"small"}
              sx={{ width: (theme) => theme.custom.schema.width }}
              value={value || ""}
              onChange={(event) => setValue((map.name = event.target.value))}
              inputRef={textField}
              onClick={() => setTimeout(() => textField.current.focus(), 0)}
            />
          )}
          {!edit && <>"{name}"</>}
          :&nbsp;
          <TypeMenu id={id} type={type} map={map} edit={edit} />
        </>
      }
      {...other}
    />
  );
}

export default SchemaProperty;
