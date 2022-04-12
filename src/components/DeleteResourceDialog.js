import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Typography } from "@mui/material";
import { forwardRef } from "react";

const DeleteResourceDialog = forwardRef(({ setOpen, deleteResource }, ref) => {
  const resource = ref.current;

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    deleteResource();
  };

  return (
    <Dialog
      open={true}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">Delete resource</DialogTitle>
      <DialogContent>
        The selected resource and all methods and resources under it will be
        deleted. Resources to be deleted :<br />
        <br />
        {resource.deleteList.map((item, index) => {
          return <Typography key={index}>{item}</Typography>;
        })}
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose}>
          Cancel
        </Button>
        <Button onClick={handleDelete} autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default DeleteResourceDialog;
