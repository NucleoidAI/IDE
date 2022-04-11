import TextField from "@mui/material/TextField";
import TreeItem from "@mui/lab/TreeItem";
import TypeMenu from "./TypeMenu";
import React, { useRef, useState } from "react";

function SchemaArray({
  id,
  name,
  children,
  edit,
  map,
  type,
  types,
  setKey,
  ...other
}) {
  const [value, setValue] = useState(name);
  const textField = useRef();
  // TODO  if in object show textfield and typemenu, if in array show only typemenu
  const item = map.items[Object.keys(map.items)[0]];

  return (
    <TreeItem
      onClick={(event) => event.preventDefault()}
      label={
        <>
          {name !== undefined && (
            <>
              {edit && (
                <>
                  <TextField
                    size={"small"}
                    sx={{ width: (theme) => theme.custom.schema.width }}
                    value={value || ""}
                    onChange={(event) =>
                      setValue((map.name = event.target.value))
                    }
                    inputRef={textField}
                    onClick={() =>
                      setTimeout(() => textField.current.focus(), 0)
                    }
                  />
                </>
              )}
              {!edit && <>"{name}"</>}
              <>:&nbsp;</>
            </>
          )}
          &#91;
        </>
      }
      {...other}
    >
      {edit && (
        <>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <TypeMenu
            id={id}
            type={item.type}
            types={types}
            map={item}
            edit={edit}
            setKey={setKey}
          />
          <br />
        </>
      )}
      {!edit && (
        <>
          &nbsp;&nbsp;&nbsp;&nbsp;
          {type}
        </>
      )}
      &nbsp;&nbsp;&nbsp;&nbsp;
      {children}
      <br />
      &nbsp;&nbsp;&#93;
    </TreeItem>
  );
}

export default SchemaArray;
