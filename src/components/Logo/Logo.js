import React from "react";
import Settings from "settings";
import styles from "./styles";
import { Box, Typography } from "@mui/material";


function Logo(props) {
  const { title } = props;

  return (
    <Box sx={styles.root}>
      <Box>
        <Typography display={"inline"} fontSize={"22px"} color={"#209958"}>
          Nucleoid
        </Typography>
        &nbsp;
        <Typography display={"inline"} fontSize={"18px"} color={"#dfdfdf"}>
          {title}
        </Typography>
        &nbsp;
        <Typography className={"neon"}>
          <sub>{Settings.plugin() || "Beta"}</sub>
        </Typography>
      </Box>
    </Box>
  );
}

export default Logo;
