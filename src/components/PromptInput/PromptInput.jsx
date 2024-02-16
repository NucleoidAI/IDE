import "./style.css";
import "regenerator-runtime";

import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import MicIcon from "@mui/icons-material/Mic";
import { Stack } from "@mui/material";
import { alpha } from "@mui/material/styles";

import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useEffect, useState } from "react";

function PromptInput({
  handlePromptChange,
  promptValue,
  isCodeGenerated,
  loading,
  handleSendAIClick,
  inputPlaceHolder,
  setPromptValue,
}) {
  const [mic, setMic] = useState(false);
  const [keyDown, setKeyDown] = useState(false);
  const { transcript, browserSupportsSpeechRecognition, resetTranscript } =
    useSpeechRecognition();

  useEffect(() => {
    resetTranscript();
  }, []);

  useEffect(() => {
    mic
      ? SpeechRecognition.startListening({
          continuous: true,
          language: "en-US",
        })
      : SpeechRecognition.stopListening();
  }, [mic]);

  const handleMicClick = () => {
    if (mic) {
      console.log(transcript);
      setPromptValue(transcript);
    }
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
        onChange={(e) => {
          if (e.target.value === "") {
            setKeyDown(false);
          }
          handlePromptChange(e);
        }}
        onKeyPress={(e) => {
          setKeyDown(true);
        }}
        disabled={isCodeGenerated}
        value={mic ? transcript : promptValue}
        fullWidth={true}
        sx={{ ml: 1, mt: 1 }}
        placeholder={inputPlaceHolder}
        multiline
        minRows={2}
        size="medium"
      />
      <Stack
        direction="row-reverse"
        sx={{ display: "flex", justifyItems: "end" }}
      >
        {!isCodeGenerated && (
          <IconButton
            width="32px"
            height="32px"
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
        )}

        {!loading && !isCodeGenerated && !keyDown && (
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

export default PromptInput;
