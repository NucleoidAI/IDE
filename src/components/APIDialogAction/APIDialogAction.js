import Button from "@mui/material/Button";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import DeleteIcon from "@mui/icons-material/Delete";
import Grid from "@mui/material/Grid";
import SaveIcon from "@mui/icons-material/Save";
import { styled } from "@mui/material/styles";
import styles from "./styles";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { useEffect, useState } from "react";

function APIDialogAction({
  view,
  setApiDialogView,
  saveApiDialog,
  saveDisable,
  deleteDisable,
  deleteMethod,
}) {
  const [alignment, setAlignment] = useState();
  const [openToolTip, setOpenToolTip] = useState();

  const DeleteTooltip = styled(({ className, ...props }) => (
    <Tooltip
      open={openToolTip}
      PopperProps={{
        disablePortal: true,
      }}
      onClose={handleTooltipClose}
      disableFocusListener
      disableHoverListener
      disableTouchListener
      {...props}
      classes={{ popper: className }}
    />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: "#f5f5f9",
      color: "rgba(0, 0, 0, 0.87)",
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      border: "1px solid #dadde9",
    },
  }));

  const handleTooltipClose = () => {
    setOpenToolTip(false);
  };

  const handleTooltipOpen = () => {
    setOpenToolTip(true);
  };

  useEffect(() => {
    setAlignment(view);
  }, [view]);

  return (
    <Grid container sx={styles.root}>
      <Grid sx={styles.firstElement} />
      <Grid item>
        <ToggleButtonGroup
          value={alignment}
          exclusive
          size={"small"}
          onChange={(event, newAlignment) => {
            if (!newAlignment) return;
            setAlignment(newAlignment);
            setApiDialogView(newAlignment);
          }}
        >
          <ToggleButton
            color={"primary"}
            variant={"contained"}
            value={"PARAMS"}
          >
            Params
          </ToggleButton>
          <ToggleButton color={"primary"} variant={"contained"} value={"BODY"}>
            &nbsp;Body&nbsp;
          </ToggleButton>
        </ToggleButtonGroup>
      </Grid>
      <ClickAwayListener onClickAway={handleTooltipClose}>
        <Grid>
          <DeleteTooltip
            title={
              <>
                This method will be <b>deleted.</b>
                <br /> Do you want to continue ?
                <Button color={"warning"} onClick={deleteMethod}>
                  Delete
                </Button>
              </>
            }
          >
            <Button
              variant={"outlined"}
              color={"warning"}
              onClick={handleTooltipOpen}
              disabled={deleteDisable}
              startIcon={<DeleteIcon />}
            >
              Delete
            </Button>
          </DeleteTooltip>
          &nbsp;
          <Button
            variant={"outlined"}
            onClick={saveApiDialog}
            disabled={saveDisable}
            startIcon={<SaveIcon />}
          >
            Save
          </Button>
        </Grid>
      </ClickAwayListener>
    </Grid>
  );
}

export default APIDialogAction;
