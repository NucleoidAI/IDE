import CloseIcon from "@mui/icons-material/Close";
import { DialogTitle, Grid, IconButton, Typography } from "@mui/material";

function ClosableDialogTitle({ handleClose, label }) {
  return (
    <DialogTitle
      sx={{
        margin: 0,
        marginRight: 1,
        padding: 3,
        paddingBottom: 1,
      }}
    >
      <Grid container justifyContent={"space-between"}>
        <Typography variant="h6">{label}</Typography>
        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 1,
            top: 1,
            margin: 1,
          }}
          size="large"
        >
          <CloseIcon />
        </IconButton>
      </Grid>
    </DialogTitle>
  );
}

export default ClosableDialogTitle;
