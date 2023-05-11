import NonExtandableTreeItem from "./NonExtandableTreeItem";
import React, { useRef, useState } from "react";
import { TextField, Typography } from "@mui/material";

function SchemaObject(props) {
  const { name, edit, map, children, ...other } = props;
  const [value, setValue] = useState(name);
  const textField = useRef();

  const readOnly = !edit
    ? {
        hovercolor: "white",
        selectedcolor: "white",
        nocursor: "true",
      }
    : {};

  return (
    <NonExtandableTreeItem
      {...readOnly}
      onClick={(event) => event.preventDefault()}
      label={
        <>
          {name !== undefined && (
            <>
              {edit && (
                <TextField
                  size={"small"}
                  sx={{ width: (theme) => theme.custom.schema.width }}
                  value={value || ""}
                  onChange={(event) =>
                    setValue((map.name = event.target.value))
                  }
                  inputRef={textField}
                  onClick={() => setTimeout(() => textField.current.focus(), 0)}
                />
              )}
              {!edit && <>&quot;{value}&quot;</>}
              <>:&nbsp;</>
            </>
          )}
          &#123;
        </>
      }
      {...other}
    >
      {children}
      <Typography sx={{ fontSize: "1rem" }}>&nbsp;&nbsp;&#125;</Typography>
    </NonExtandableTreeItem>
  );
}

export default SchemaObject;
