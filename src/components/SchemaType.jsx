/* eslint-disable */
import Schema from "./Schema";
import TextField from "@mui/material/TextField";
import TreeItem from "@mui/lab/TreeItem";
import TypeMenu from "./TypeMenu";

import React, { useRef, useState } from "react";

function SchemaType({ id, name, map, type, types, edit, ...other }) {
  const [value, setValue] = useState(name);
  const textField = useRef();

  const typeSchema =
    types[types.findIndex((item) => item[Object.keys(item)[0]].name === type)];

  return (
    <TreeItem
      label={
        <>
          {edit && (
            <>
              <TextField
                size={"small"}
                sx={{ width: (theme) => theme.custom.schema.width }}
                value={value || ""}
                onChange={(event) => setValue((map.name = event.target.value))}
                inputRef={textField}
                onClick={() => setTimeout(() => textField.current.focus(), 0)}
              />
              :&nbsp;
              <TypeMenu
                primitive
                objAndArr
                globalTypes
                id={id}
                type={type}
                types={types}
                map={map}
                edit
              />
              {/*<Schema ref={typeSchema} types={types} /> */}
            </>
          )}
          {!edit && (
            <>{/*{type} <Schema ref={typeSchema} types={types} /> */}</>
          )}
        </>
      }
      {...other}
    />
  );
}

export default SchemaType;
/* eslint-disable */
