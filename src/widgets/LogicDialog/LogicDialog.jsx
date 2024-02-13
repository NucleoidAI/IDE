import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { Box } from "@mui/system";
import Button from "@mui/material/Button";
import ClosableDialogTitle from "../../components/ClosableDialogTitle/ClosableDialogTitle";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DirectionsIcon from "@mui/icons-material/Directions";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import MenuIcon from "@mui/icons-material/Menu";
import OutlinedInput from "@mui/material/OutlinedInput";
import SearchIcon from "@mui/icons-material/Search";
import actions from "../../actions";
import { useContext } from "../../context/context";

import { Stack, TextField, Typography } from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import { useEffect, useState } from "react";

function LogicDialog() {
  const [context, dispatch] = useContext();
  const [loading, setLoading] = useState(false);

  const [inputValue, setInputValue] = useState("");

  const handleClose = () => {
    dispatch({ type: actions.closeLogicDialog });
  };

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleClick = () => {
    setLoading(true);
    //TODO connect service
    dispatch({
      type: "SAVE_LOGIC_DIALOG",
      payload: {
        description: inputValue,
        summary: "If the order is fruit, the order is seeded",
        definition: `{
        if( $Order.type === "fruit" )
        {
          order.seed === true ? console.log("work") : null;
        }
      }`,
      },
    });
  };

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setLoading(false);
        handleClose();
        setInputValue("");
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [loading]);

  return (
    <Dialog
      open={Boolean(context.get("pages.logic.dialog.open"))}
      fullWidth
      onClose={(event) => (event.key === "Escape" ? handleClose() : null)}
    >
      <ClosableDialogTitle label={"Logic"} handleClose={handleClose} />
      <DialogContent
        fullWidth
        sx={{
          display: "flex",
          alignItems: "center",
          padding: 2,
          borderRadius: 3,
        }}
      >
        <Stack
          sx={{
            border: "1px solid #c3c5c8",
            borderRadius: 3,
            width: "100%",
            padding: 1,
          }}
        >
          <InputBase
            onChange={(e) => handleChange(e)}
            value={inputValue}
            fullWidth
            sx={{ ml: 1, mt: 1 }}
            placeholder="Explain Logic"
            multiline
            minRows={4}
            size="medium"
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Stack sx={{ width: 1, alignItems: "center", height: 1 }}>
          <Button
            disabled={inputValue === ""}
            onClick={handleClick}
            sx={{
              width: "97%",
              mx: 1,
              mb: 1.9,
              height: "40%",
              alignContent: "center",
              justifyItems: "center",
              border: !loading ? "1px solid #c3c5c8" : "",
              borderRadius: 1,
              backgroundColor: inputValue !== "" ? alpha("#209958", 0.7) : "",
            }}
          >
            <IconButton className={loading && "loader-2"}>
              <AutoAwesomeIcon
                component={loading && "span"}
                fontSize="15px"
                sx={{
                  color: !loading ? "#c3c5c8" : alpha("#209958", 1),
                }}
              />
            </IconButton>
            {!loading && (
              <Typography
                fontSize={15}
                sx={{
                  color: !loading ? "#c3c5c8" : alpha("#209958", 1),
                  mx: 1,
                }}
                variant="button"
              >
                Generate
              </Typography>
            )}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}

export default LogicDialog;
