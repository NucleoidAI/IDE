import React from "react";
import { Box, Typography } from "@mui/material";

function Logo(props) {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "flex-start",
      }}
    >
      <Box>
        <Typography display={"inline"} fontSize={"22px"} color={"#28a745"}>
          Nucleoid
        </Typography>
        &nbsp;
        <Typography display={"inline"} fontSize={"18px"} color={"#dfdfdf"}>
          {props.title}
        </Typography>
        &nbsp;
        <Typography
          display={"inline"}
          fontSize={"15px"}
          color={"#dfdfdf"}
          fontWeight={"lighter"}
        >
          <sub>Beta</sub>
        </Typography>
      </Box>
    </Box>
  );
}

export default Logo;
