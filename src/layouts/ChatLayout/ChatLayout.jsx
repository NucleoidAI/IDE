import React, { useState } from "react";
import { Grid, Paper, IconButton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

function ChatLayout({ chatContent, sidebarContent }) {
  const [isSidebarVisible, setSidebarVisible] = useState(true);

  return (
    <Grid container sx={{ height: "100vh", overflow: "hidden" }}>
      <Grid
        item
        xs={2}
        sx={{
          display: isSidebarVisible ? "block" : "none",
        }}
      >
        {sidebarContent}
      </Grid>

      <Grid
        item
        xs={isSidebarVisible ? 10 : 12}
        sx={{ position: "relative", bgcolor: "white" }}
      >
        <IconButton
          onClick={() => setSidebarVisible(!isSidebarVisible)}
          sx={{
            color: "white",
            position: "absolute",
            top: "50%",
            left: "1rem",
            transform: "translateY(-50%)",
            zIndex: 1200,
          }}
        >
          {isSidebarVisible ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>

        {chatContent}
      </Grid>
    </Grid>
  );
}

export default ChatLayout;
