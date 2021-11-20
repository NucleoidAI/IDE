import { Context } from "../context";
import LanguageIcon from "@material-ui/icons/Language";
import {
  Box,
  Button,
  FormControl,
  Grid,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";
import React, { useContext } from "react";

function APIPath() {
  const [state, dispatch] = useContext(Context);

  return (
    <Grid container justifyContent={"space-between"}>
      <Grid style={{ width: 50 }} />
      <Grid item>
        <Grid container item justifyContent={"center"} alignItems={"center"}>
          <FormControl variant={"outlined"} size={"small"}>
            <Select value={"get"}>
              <MenuItem value={"get"}>GET</MenuItem>
              <MenuItem value={"post"}>POST</MenuItem>
            </Select>
          </FormControl>
          <Box component={"span"} style={{ fontSize: 16 }}>
            &nbsp;&nbsp;&nbsp;/devices/devicesId/items/&nbsp;
          </Box>
          <TextField style={{ width: 75 }} defaultValue={"itemId"} />
        </Grid>
      </Grid>
      <Button
        variant={
          state.get("pages.api.dialog.view") === "TYPES"
            ? "contained"
            : "outlined"
        }
        onClick={() =>
          dispatch({ type: "SET_API_DIALOG_VIEW", payload: { view: "TYPES" } })
        }
      >
        <LanguageIcon style={{ fill: "#5d5d5d" }} />
        &nbsp;Types
      </Button>
    </Grid>
  );
}

export default APIPath;
