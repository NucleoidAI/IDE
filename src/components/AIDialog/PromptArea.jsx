import "./style.css";

import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import MicIcon from "@mui/icons-material/Mic";
import SaveIcon from "@mui/icons-material/Save";
import { Stack } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useState } from "react";

function PromptArea({
  handlePromptChange,
  handleSaveAIResponse,
  promptValue,
  isCodeGenerated,
  loading,
  handleSendAIClick,
  saveChangedCode,
  isCodeChanged,
}) {
  const [mic, setMic] = useState(false);
  const handleMicClick = () => {
    console.log("mic open");
    setMic(!mic);
  };
  return (
    <Stack
      sx={{
        border: "1px solid gray",
        borderRadius: "10px 10px 10px 10px",
        width: "100%",
        padding: 1,
      }}
    >
      <InputBase
        onChange={(e) => handlePromptChange(e)}
        value={promptValue}
        fullWidth
        sx={{ ml: 1, mt: 1 }}
        placeholder="Explain Logic"
        multiline
        minRows={2}
        size="medium"
      />
      <Stack
        direction="row-reverse"
        sx={{ display: "flex", justifyItems: "end" }}
      >
        {!isCodeGenerated ? (
          <IconButton
            width="32px"
            height="32px"
            disabled={promptValue === ""}
            className={loading && "loader-3"}
            size="medium"
            onClick={handleSendAIClick}
            sx={{
              m: 1,
              display: "flex",
              alignContent: "end",
              justifyItems: "end",
              border: !loading ? "1px solid #c3c5c8" : "",
              backgroundColor: promptValue !== "" ? alpha("#209958", 0.7) : "",
            }}
          >
            <AutoAwesomeIcon
              width="32px"
              height="32px"
              component={loading && "span"}
              sx={{
                color: !loading ? "#c3c5c8" : alpha("#209958", 1),
              }}
            />
          </IconButton>
        ) : (
          <IconButton
            width="32px"
            height="32px"
            size="medium"
            onClick={handleSaveAIResponse}
            sx={{
              m: 1,
              display: "flex",
              alignContent: "end",
              justifyItems: "end",
              border: `1px solid ${alpha("#209958", 0.7)}`,
              backgroundColor: promptValue !== "" ? alpha("#209958", 0.7) : "",
            }}
          >
            <DoneOutlineIcon
              width="32px"
              height="32px"
              component={loading && "span"}
              sx={{
                color: alpha("#209958", 1),
              }}
            />
          </IconButton>
        )}

        {isCodeChanged && (
          <IconButton
            width="32px"
            height="32px"
            size="medium"
            onClick={saveChangedCode}
            sx={{
              m: 1,
              display: "flex",
              alignContent: "end",
              justifyItems: "end",
              border: `1px solid ${alpha("#209958", 0.7)}`,
            }}
          >
            <SaveIcon
              width="32px"
              height="32px"
              sx={{
                color: alpha("#209958", 1),
              }}
            />
          </IconButton>
        )}
        {!loading && !isCodeGenerated && (
          <IconButton
            width="32px"
            height="32px"
            disabled={promptValue !== ""}
            className={mic && "loader-6"}
            size="medium"
            onClick={handleMicClick}
            sx={{
              m: 1,
              display: "flex",
              alignContent: "end",
              justifyItems: "end",
              border: "1px solid #c3c5c8",
            }}
          >
            <MicIcon
              width="32px"
              height="32px"
              sx={{
                color: !mic ? "#c3c5c8" : alpha("#209958", 1),
              }}
            />
          </IconButton>
        )}
      </Stack>
    </Stack>
  );
}

export default PromptArea;
