import LanguageIcon from "@mui/icons-material/Language";
import React from "react";
import {
  Box,
  Button,
  FormControl,
  Grid,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

function APIPath({ setApiDialogView, view }) {
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
        variant={view === "TYPES" ? "contained" : "outlined"}
        onClick={() => setApiDialogView("TYPES")}
      >
        <LanguageIcon style={{ fill: "#5d5d5d" }} />
        &nbsp;Types
      </Button>
    </Grid>
  );
}

export default APIPath;
