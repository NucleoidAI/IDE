import CloseIcon from "@mui/icons-material/Close";
import makeStyles from '@mui/styles/makeStyles';
import { DialogTitle, Grid, IconButton, Typography } from "@mui/material";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 0,
    marginLeft: theme.spacing(1),
    padding: theme.spacing(2),
    paddingBottom: theme.spacing(1),
  },
  button: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
  },
}));

function ClosableDialogTitle({ handleClose, label }) {
  const classes = useStyles();

  return (
    <DialogTitle className={classes.root}>
      <Grid container justifyContent={"space-between"}>
        <Typography variant="h6">{label}</Typography>
        <IconButton onClick={handleClose} className={classes.button} size="large">
          <CloseIcon />
        </IconButton>
      </Grid>
    </DialogTitle>
  );
}

export default ClosableDialogTitle;
