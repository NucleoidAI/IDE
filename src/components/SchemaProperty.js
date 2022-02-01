import { TreeItem } from "@material-ui/lab";
import TypeMenu from "./TypeMenu";
import React, { useRef, useState } from "react";
import { TextField, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  textField: {
    width: theme.custom.schema.width,
  },
}));

function SchemaProperty({ id, name, map, type, edit, ...other }) {
  const classes = useStyles();

  const [value, setValue] = useState(name);
  const textField = useRef();

  return (
    <TreeItem
      label={
        <>
          {edit && (
            <TextField
              size={"small"}
              className={classes.textField}
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
