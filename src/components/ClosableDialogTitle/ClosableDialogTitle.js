import CloseIcon from "@mui/icons-material/Close";
import styles from "./styles";
import { DialogTitle, Grid, IconButton, Typography } from "@mui/material";

function ClosableDialogTitle({ handleClose, label }) {
  return (
    <DialogTitle sx={styles.dialogTitle}>
      <Grid container sx={styles.content}>
        <Typography variant="h6">{label}</Typography>
        <IconButton onClick={handleClose} sx={styles.iconButton} size="large">
          <CloseIcon />
        </IconButton>
      </Grid>
    </DialogTitle>
  );
}

export default ClosableDialogTitle;
