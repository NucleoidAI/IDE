import CloseIcon from "@mui/icons-material/Close";
import styles from "./styles";
import theme from "../../theme";
import { DialogTitle, Grid, IconButton, Typography } from "@mui/material";

function ClosableDialogTitle({ handleClose, label, content, grey }) {
  return (
    <DialogTitle sx={styles.dialogTitle}>
      <Grid container sx={styles.content}>
        {label ? <Typography variant="h6">{label}</Typography> : content}
        <IconButton onClick={handleClose} sx={styles.iconButton} size="large">
          <CloseIcon sx={{ color: grey && theme.palette.custom.grey }} />
        </IconButton>
      </Grid>
    </DialogTitle>
  );
}

export default ClosableDialogTitle;
