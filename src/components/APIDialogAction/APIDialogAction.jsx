import DeleteIcon from "@mui/icons-material/Delete";
import DialogTooltip from "../DialogTootip/DialogTooltip";
import SaveIcon from "@mui/icons-material/Save";

import { Box, Button, ToggleButton, ToggleButtonGroup } from "@mui/material";
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
  const [openToolTip, setOpenToolTip] = useState(false);

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
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <Box>
        <ToggleButtonGroup
          value={alignment}
          exclusive
          size={"small"}
          onChange={(event, newAlignment) => {
            if (!newAlignment) return;
            setAlignment(newAlignment);
            setApiDialogView(newAlignment);
          }}
          sx={{
            "& .MuiToggleButton-root": {
              borderRadius: 1,
              textTransform: "none",
              fontWeight: "normal",
            },
          }}
        >
          <ToggleButton value={"PARAMS"}>PARAMS</ToggleButton>
          <ToggleButton value={"BODY"}>BODY</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Box sx={{ display: "flex", gap: 1 }}>
        <DialogTooltip
          placement="top"
          open={openToolTip}
          title={<b>Delete method</b>}
          message={
            <>
              This method will be <b>deleted.</b>
              <br /> Do you want to continue?
            </>
          }
          footer={
            <Button
              variant="contained"
              color="error"
              onClick={deleteMethod}
              startIcon={<DeleteIcon />}
            >
              Delete
            </Button>
          }
          handleTooltipClose={handleTooltipClose}
        >
          <Button
            variant="outlined"
            color="error"
            onClick={handleTooltipOpen}
            disabled={deleteDisable}
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
        </DialogTooltip>
        <Button
          variant="contained"
          color="primary"
          onClick={saveApiDialog}
          disabled={saveDisable}
          startIcon={<SaveIcon />}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
}

export default APIDialogAction;
