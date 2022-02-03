import TextField from "@mui/material/TextField";
import TreeItem from "@mui/lab/TreeItem";
import makeStyles from "@mui/styles/makeStyles";
import React, { useRef, useState } from "react";

const useStyles = makeStyles((theme) => ({
  textField: {
    width: theme.custom.schema.width,
  },
}));

function SchemaObject({ name, edit, map, children, ...other }) {
  const classes = useStyles();
  const [value, setValue] = useState(name);
  const textField = useRef();

  return (
    <TreeItem
      onLabelClick={(event) => event.preventDefault()}
      label={
        <>
          {name !== undefined && (
            <>
              {edit && (
                <TextField
                  size={"small"}
                  className={classes.textField}
                  value={value || ""}
                  onChange={(event) =>
                    setValue((map.name = event.target.value))
                  }
                  inputRef={textField}
                  onClick={() => setTimeout(() => textField.current.focus(), 0)}
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
    </TreeItem>
  );
}

export default SchemaObject;
