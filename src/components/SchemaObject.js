import NonExtandableTreeItem from "../components/NonExtandableTreeItem";
import TextField from "@mui/material/TextField";
import React, { useRef, useState } from "react";

function SchemaObject(props) {
  const { name, edit, map, children, ...other } = props;
  const [value, setValue] = useState(name);
  const textField = useRef();

  const readOnly = !edit
    ? {
        hovercolor: "white",
        selectedcolor: "white",
        nocursor: true,
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
                  onClick={() => setImmediate(() => textField.current.focus())}
                />
              )}
              {!edit && <>"{value}"</>}
              <>:&nbsp;</>
            </>
          )}
          &#123;
        </>
      }
      {...other}
    >
      {children}
      &nbsp;&nbsp;&#125;
    </NonExtandableTreeItem>
  );
}

export default SchemaObject;
