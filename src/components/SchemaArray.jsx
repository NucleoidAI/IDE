import NonExtandableTreeItem from "./NonExtandableTreeItem";
import TypeMenu from "./TypeMenu";
import { Box, TextField, Typography } from "@mui/material/";
import React, { useRef, useState } from "react";

function SchemaArray({
  id,
  name,
  children,
  edit,
  map,
  types,
  setKey,
  ...other
}) {
  const [value, setValue] = useState(name);
  const textField = useRef();
  // TODO  if in object show textfield and typemenu, if in array show only typemenu
  const item = map.items[Object.keys(map.items)[0]];

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
              {!edit && <>&quot;{name}&quot;</>}
              <>:&nbsp;</>
            </>
          )}
          &#91;
        </>
      }
      {...other}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "flex-start",
        }}
      >
        {edit && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            &nbsp;&nbsp;&nbsp;&nbsp;
            <TypeMenu
              objAndArr
              globalTypes
              id={id}
              type={item.type}
              types={types}
              map={item}
              edit={edit}
              setKey={setKey}
            />
            <Typography>:</Typography>
          </Box>
        )}
        {!edit && <>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</>}
        <Box sx={{ mt: 10 / 14 }}>{children}</Box>
      </Box>
      <Typography>&nbsp;&nbsp;&#93;</Typography>
    </NonExtandableTreeItem>
  );
}

export default SchemaArray;
