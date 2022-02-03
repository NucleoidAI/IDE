import TextField from "@mui/material/TextField";
import TreeItem from "@mui/lab/TreeItem";
import TypeMenu from "./TypeMenu";
import makeStyles from "@mui/styles/makeStyles";
import React, { useRef, useState } from "react";

const useStyles = makeStyles((theme) => ({
  textField: {
    width: theme.custom.schema.width,
  },
}));

function SchemaArray({ id, name, edit, map, type, ...other }) {
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
          <TypeMenu id={id} type={type} map={map} edit={edit} noNested />
          <br />
        </>
      )}
      {!edit && (
        <>
          &nbsp;&nbsp;&nbsp;&nbsp;
          {type}
          <br />
        </>
      )}
      &nbsp;&nbsp;&#93;
    </TreeItem>
  );
}

export default SchemaArray;
