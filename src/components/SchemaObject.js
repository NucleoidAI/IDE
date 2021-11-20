import { TreeItem } from "@material-ui/lab";
import React, { useRef, useState } from "react";
import { TextField, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  textField: {
    width: theme.custom.schema.width,
  },
}));

function SchemaObject({ name, edit, children, ...other }) {
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
                  onChange={(event) => setValue(event.target.value)}
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
