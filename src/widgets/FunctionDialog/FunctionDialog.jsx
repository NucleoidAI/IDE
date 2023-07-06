import Button from "@mui/material/Button";
import ClosableDialogTitle from "../../components/ClosableDialogTitle/ClosableDialogTitle";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Path from "../../utils/Path";
import React from "react";
import actions from "../../actions";
import styles from "./styles";
// eslint-disable-next-line react-hooks/exhaustive-deps
import { useContext } from "../../context/context";
import { Grid, MenuItem, Select, TextField, Typography } from "@mui/material";

export default function FunctionDialog() {
  const [context, dispatch] = useContext();
  const { pages } = context;
  let type = context.pages.functions.dialog.type;
  let path;
  const selectedFunction = pages.functions.selected;
  const { prefix } = selectedFunction ? Path.split(selectedFunction) : {};
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    setError(false);
    //eslint-disable-next-line
  }, [Boolean(context.get("pages.functions.dialog.open"))]);

  const handleSaveFunction = () => {
    if (!path) {
      setError(true);
    } else {
      setError(false);
      dispatch({
        type: actions.saveFunctionDialog,
        payload: {
          path: "/" + path,
          type: type.toUpperCase(),
          definition: `${type.toLowerCase()} ${path}${
            type === "FUNCTION" ? "()" : ""
          } { }`,
          params: [],
          ext: "ts",
        },
      });
      handleClose();
    }
  };

  const handleClose = () => {
    dispatch({ type: actions.closeFunctionDialog });
  };

  return (
    <Dialog
      open={Boolean(context.get("pages.functions.dialog.open"))}
      fullWidth
      onClose={(event) => (event.key === "Escape" ? handleClose() : null)}
    >
      <ClosableDialogTitle label={"FUNCTIONS"} handleClose={handleClose} />
      <DialogContent>
        <Grid sx={styles.dialogContent}>
          <Select
            defaultValue={type}
            sx={styles.select}
            onChange={(e) => (type = e.target.value)}
          >
            <MenuItem value={"FUNCTION"}>
              <Grid sx={styles.optionContainer}>
                <Typography sx={styles.optionFunction}>fn</Typography>
                <Typography>Function</Typography>
              </Grid>
            </MenuItem>
            <MenuItem value={"CLASS"}>
              <Grid sx={styles.optionContainer}>
                <Typography sx={styles.optionFunction}>class</Typography>
                <Typography>Class</Typography>
              </Grid>
            </MenuItem>
          </Select>
          <Typography>
            {prefix}
            {Path.addSlashMark(prefix)}
          </Typography>
          <TextField
            error={error}
            defaultValue={""}
            sx={styles.suffixText}
            onChange={(e) => (path = e.target.value)}
          />
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSaveFunction}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
