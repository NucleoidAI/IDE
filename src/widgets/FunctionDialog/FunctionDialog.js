import Button from "@mui/material/Button";
import ClosableDialogTitle from "../../components/ClosableDialogTitle/ClosableDialogTitle";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import FolderIcon from "@mui/icons-material/FolderRounded";
import Path from "../../utils/Path";
// eslint-disable-next-line react-hooks/exhaustive-deps
import { useContext } from "../../context";
import { Grid, MenuItem, Select, TextField, Typography } from "@mui/material";

//import { useContext } from "react";

export default function FunctionDialog() {
  const [context, dispatch] = useContext();
  const { pages } = context;

  const selectedFunction = pages.functions.selected;

  const { prefix, suffix } = selectedFunction
    ? Path.split(selectedFunction)
    : [];

  //const handleClickOpen = () => {};

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
        <Grid
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pt: "25px",
          }}
        >
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            // value={age}
            label="Age"
            // onChange={handleChange}
          >
            <MenuItem value={10}>
              <FolderIcon></FolderIcon>Ten
            </MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
          <Typography>
            {prefix}
            {Path.addSlashMark(prefix)}
          </Typography>
          <TextField defaultValue={suffix} sx={{ width: "30%", pl: "10px" }} />
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
