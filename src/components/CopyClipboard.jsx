import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useState } from "react";
import { Box, Fab, Tooltip, Typography } from "@mui/material";

const CopyClipboard = () => {
  const [copied, setCopied] = useState(false);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <ArrowForwardIosIcon />
      <Typography fontFamily={"Trebuchet MS"} variant={"h6"}>
        npx nucleoidjs start
      </Typography>
      <Tooltip
        title={copied ? "Copied" : ""}
        leaveDelay={1000}
        onClose={() => setCopied(false)}
      >
        <Fab
          onClick={() => {
            navigator.clipboard.writeText("npx nucleoidjs start");
            setCopied(true);
          }}
          size="small"
        >
          <ContentCopyIcon />
        </Fab>
      </Tooltip>
    </Box>
  );
};

export default CopyClipboard;
