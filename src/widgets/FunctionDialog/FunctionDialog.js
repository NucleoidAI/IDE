import Button from "@mui/material/Button";
import ClosableDialogTitle from "../../components/ClosableDialogTitle/ClosableDialogTitle";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import FolderIcon from "@mui/icons-material/FolderRounded";
import Path from "../../utils/Path";
import styles from "./styles";
// eslint-disable-next-line react-hooks/exhaustive-deps
import { useContext } from "../../context";
import { Grid, MenuItem, Select, TextField, Typography } from "@mui/material";

//import { useContext } from "react";

export default function FunctionDialog() {
  const [context, dispatch] = useContext();
  const { pages } = context;
  let type = "FOLDER";
  let path;
  const selectedFunction = pages.functions.selected;
  const { prefix } = selectedFunction ? Path.split(selectedFunction) : {};

  const handleSaveFunction = () => {
    dispatch({
      type: "SAVE_FUNCTION_DIALOG",
      payload: {
        type: type === "FOLDER" ? "FUNCTION" : type,
        path:
          type === "FOLDER"
            ? prefix + Path.addSlashMark(prefix) + path + "/A"
            : prefix + Path.addSlashMark(prefix) + path,
        code: "",
        params: [],
      },
    });
  };

  const handleClose = () => {
    dispatch({ type: "CLOSE_FUNCTION_DIALOG" });
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
            defaultValue={"FOLDER"}
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
            <MenuItem value={"FOLDER"}>
              <Grid sx={styles.optionContainer}>
                <FolderIcon sx={styles.icon} />
                <Typography>Folder</Typography>
              </Grid>
            </MenuItem>
          </Select>
          <Typography>
            {prefix}
            {Path.addSlashMark(prefix)}
          </Typography>
          <TextField
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
