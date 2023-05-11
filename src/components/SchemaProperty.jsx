import StyledTreeItem from "./StyledTreeItem";
import TextField from "@mui/material/TextField";
import TypeMenu from "./TypeMenu";
import React, { useRef, useState } from "react";

function SchemaProperty({
  id,
  name,
  map,
  type,
  types,
  edit,
  setKey,
  ...other
}) {
  const [value, setValue] = useState(name);
  const textField = useRef();

  React.useEffect(() => {
    map.name = name || "";
  }, [map, name]);

  const readOnly = !edit
    ? {
        hovercolor: "white",
        selectedcolor: "white",
        nocursor: "true",
      }
    : {};

  return (
    <StyledTreeItem
      {...readOnly}
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
          {!edit && <>&quot;{name}&quot;</>}
          :&nbsp;
          <TypeMenu
            primitive
            objAndArr
            globalTypes
            id={id}
            type={type}
            types={types}
            map={map}
            edit={edit}
            setKey={setKey}
          />
        </>
      }
      {...other}
    />
  );
}

export default SchemaProperty;
