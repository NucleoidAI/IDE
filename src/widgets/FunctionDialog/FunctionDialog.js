import AccountCircle from "@mui/icons-material/AccountCircle";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";


import { Box, DialogTitle, TextField } from "@mui/material";
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
        <Box sx={{ display: "flex", alignItems: "flex-end" }}>
          <AccountCircle sx={{ color: "action.active", mr: 1, my: 0.5 }} />
          <TextField id="input-with-sx" label="With sx" variant="standard" />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}
