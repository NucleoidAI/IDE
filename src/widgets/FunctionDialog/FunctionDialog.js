import Button from "@mui/material/Button";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { useContext } from "../../context";
//import { useContext } from "react";

export default function FunctionDialog() {
  const [context, dispatch] = useContext();
  const { pages } = context;

  console.log(pages.functions.selected);

  //const handleClickOpen = () => {};

  const handleClose = () => {
    dispatch({ type: "CLOSE_FUNCTION_DIALOG" });
  };

  return (
    <Dialog
      open={Boolean(context.get("pages.functions.dialog.open"))}
      onClose={handleClose}
    >
      <DialogTitle>path</DialogTitle>
      <DialogContent>
        <DialogContentText></DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          fullWidth
          variant="standard"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}
