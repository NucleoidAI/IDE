import { TreeItem } from "@material-ui/lab";
import TypeMenu from "./TypeMenu";
import { useContext } from "../context";
import React, { useRef, useState } from "react";
import { TextField, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  textField: {
    width: theme.custom.schema.width,
  },
}));

function SchemaProperty({ id, name, type, edit, ...other }) {
  const classes = useStyles();
  const [state] = useContext();
  const [value, setValue] = useState(name);
  const textField = useRef();
  const map = state.get("pages.api.dialog.map");

  return (
    <TreeItem
      label={
        <>
          {edit && (
            <TextField
              size={"small"}
              className={classes.textField}
              value={value || ""}
              onChange={(event) =>
                setValue((map[id].name = event.target.value))
              }
              inputRef={textField}
              onClick={() => setTimeout(() => textField.current.focus(), 0)}
            />
          )}
          {!edit && <>"{name}"</>}
          :&nbsp;
          <TypeMenu id={id} type={type} edit={edit} />
        </>
      }
      {...other}
    />
  );
}

export default SchemaProperty;
