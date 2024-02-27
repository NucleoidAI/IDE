import "regenerator-runtime";

import BoltIcon from "@mui/icons-material/Bolt";
import Fab from "@mui/material/Fab";
import InputBase from "@mui/material/InputBase";
import MicIcon from "@mui/icons-material/Mic";
import { alpha } from "@mui/material/styles";

import { CircularProgress, Stack } from "@mui/material";
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
  const { transcript, resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    resetTranscript();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        border: (theme) => `1px solid ${alpha(theme.palette.grey[400], 0.5)}`,
        borderRadius: (theme) => theme.custom.chat.inputBorderRadius,
        padding: 1,
      }}
    >
      <InputBase
        variant="chat"
        data-cy="propmtInput-input"
        onChange={(e) => {
          if (e.target.value === "") {
            setKeyDown(false);
          }
          handlePromptChange(e);
        }}
        onKeyPress={() => {
          setKeyDown(true);
        }}
        disabled={isCodeGenerated}
        value={mic ? transcript : promptValue}
        fullWidth={true}
        placeholder={inputPlaceHolder}
        multiline
        minRows={2}
        size="medium"
      />
      <Stack
        direction="row-reverse"
        sx={{
          display: "flex",
          justifyItems: "end",
        }}
      >
        <Fab
          variant="button"
          size="medium"
          loading={loading}
          hide={isCodeGenerated}
          onClick={handleSendAIClick}
          disabled={mic || promptValue === ""}
          data-cy="propmtInput-sendAI-button"
        >
          <BoltIcon />
        </Fab>
        <CircularProgress show={loading} />
        <Fab
          variant="button"
          type="mic"
          size="medium"
          hide={keyDown}
          onClick={handleMicClick}
        >
          <MicIcon />
        </Fab>
      </Stack>
    </Stack>
  );
}

export default PromptInput;
