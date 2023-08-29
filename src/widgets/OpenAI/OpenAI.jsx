import "regenerator-runtime";

import CircularProgress from "@mui/material/CircularProgress";
import CloseIcon from "@mui/icons-material/Close";
import { DescriptionPopover } from "../../components/DescriptionPopover/DescriptionPopover";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Draggable from "react-draggable";
import Editor from "@monaco-editor/react";
import MarkQuestionIcon from "@mui/icons-material/Help";
import MicIcon from "@mui/icons-material/Mic";
import MicNoneIcon from "@mui/icons-material/MicNone";
import OpenAIButton from "../../components/OpenAIButton";
import OpenAICodeExplainButton from "../../components/OpenAICodeExplainButton";
import OpenAIIcon from "../../icons/OpenAI";
import Paper from "@mui/material/Paper";
import React from "react";
import SendIcon from "@mui/icons-material/Send";
import Settings from "../../settings";
import { deepCopy } from "../../utils/DeepCopy";
import service from "../../service";

import { Box, Button, DialogTitle, IconButton, TextField } from "@mui/material";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

import * as angularPlugin from "prettier/parser-angular";
import * as babelPlugin from "prettier/parser-babel";
import * as glimmerPlugin from "prettier/parser-glimmer";
import * as graphqlPlugin from "prettier/parser-graphql";
import * as htmlPlugin from "prettier/parser-html";
import * as markdownPlugin from "prettier/parser-markdown";
import * as meriyahPlugin from "prettier/parser-meriyah";
import * as prettierStandalone from "prettier/standalone";
import * as typescriptPlugin from "prettier/parser-typescript";
import * as yamlPlugin from "prettier/parser-yaml";

function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

export default function OpenAI({ functions, editor }) {
  const [loading, setLoading] = React.useState(false);
  const [login, setLogin] = React.useState(false);
  const [progress, setProgress] = React.useState(false);
  const [response, setResponse] = React.useState();
  const [explainResponse, setExplainResponse] = React.useState();

  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorEl2, setAnchorEl2] = React.useState(null);
  const [listen, setListen] = React.useState(false);
  const [input, setInput] = React.useState(null);

  const { transcript, browserSupportsSpeechRecognition, resetTranscript } =
    useSpeechRecognition();

  const plugins = [
    angularPlugin,
    babelPlugin,
    glimmerPlugin,
    graphqlPlugin,
    htmlPlugin,
    markdownPlugin,
    meriyahPlugin,
    typescriptPlugin,
    yamlPlugin,
  ];

  const data = React.useRef({
    request: "",
  });

  React.useEffect(() => {
    listen
      ? SpeechRecognition.startListening({
          continuous: true,
          language: "en-US",
        })
      : SpeechRecognition.stopListening();
  }, [listen]);

  const listenUser = () => {
    setListen(!listen);
  };

  const generateContent = () => {
    if (editor.current) {
      const mEditor = editor.current.editor;

      const nucFunctions = deepCopy(functions);
      const selected = mEditor
        .getModel()
        .getValueInRange(mEditor.getSelection());

      return nucFunctions.map((item) => item.definition).join("\n") + selected;
    }
  };

  const handleSend = async () => {
    if (data.current.request || transcript) {
      setLoading(true);
      service
        .openai(
          generateContent().trim(),
          data.current.request?.trim() || transcript
        )
        .then((res) => {
          setResponse(res.data.text?.trim());
        })
        .finally(() => setLoading(false));
    }
  };

  const handleClickOpen = () => {
    resetTranscript();
    if (Settings.token()) {
      setResponse("");
      data.current.request = "";
      data.current.content = "";
      setOpen(true);
    } else {
      setLogin(true);
      // TODO : replace refreshToken and accessToken with storage

      service
        .getProjects()
        .then(() => {
          setResponse("");
          data.current.request = "";
          data.current.content = "";
          setOpen(true);
        })
        .finally(() => setLogin(false));
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleGenerate = () => {
    const mEditor = editor.current.editor;
    const lineNumber = mEditor.getSelection().endLineNumber;

    const selected = mEditor.getModel().getValueInRange(mEditor.getSelection());

    if (selected) {
      const withLine = mEditor.getModel().getValue().split("\n");

      withLine.splice(lineNumber, 0, response);
      const res = withLine.join("\n");
      const prettyText = prettierStandalone.format(res, {
        plugins,
      });

      mEditor.getModel().setValue(prettyText);
    } else {
      const action = prettierStandalone.format(
        `
      function action(req) {
        ${response}
      }
      `,
        {
          plugins,
        }
      );
      mEditor.getModel().setValue(action);
    }

    handleClose();
  };

  const handleSendCodeExplain = (e) => {
    const mEditor = editor.current.editor;
    const value = mEditor.getModel().getValue();
    setProgress(true);
    service
      .openai(value, "Explain this code")
      .then((res) => {
        setExplainResponse(res?.data?.text);
        setAnchorEl2(e);
      })
      .finally(() => setProgress(false));
  };

  return (
    <div>
      {!login ? (
        <>
          <OpenAICodeExplainButton
            clickEvent={(event) => {
              handleSendCodeExplain(event.currentTarget);
            }}
            progress={progress}
          />
          <OpenAIButton clickEvent={handleClickOpen} />
          <DescriptionPopover
            anchorEl={anchorEl2}
            open={Boolean(anchorEl2)}
            setAnchorEl={setAnchorEl2}
            onClose={() => setAnchorEl2(null)}
            anchorPos={{
              vertical: "bottom",
              horizontal: "left",
            }}
            value={explainResponse}
          />
        </>
      ) : (
        <CircularProgress
          size={25}
          sx={{
            position: "relative",
            textTransform: "none",
            bottom: 20,
            left: 50,
          }}
        />
      )}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth={"lg"}
        disableEnforceFocus
        hideBackdrop={true}
        style={{ pointerEvents: "none" }}
        PaperProps={{ style: { pointerEvents: "auto" } }}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "center",
                alignItems: "center",
                gap: 1,
              }}
            >
              <OpenAIIcon width={20} height={20} />
              <span style={{ fontSize: 18 }}>OpenAI</span>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Button
                disabled={!response ? true : false}
                size="small"
                onClick={handleGenerate}
              >
                GENERATE
              </Button>
              <IconButton
                size="small"
                onClick={(event) => setAnchorEl(event.currentTarget)}
              >
                <MarkQuestionIcon />
              </IconButton>
              <DescriptionPopover
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                setAnchorEl={setAnchorEl}
                anchorPos={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                value={generateContent() + data.current.request}
              />
              <IconButton onClick={handleClose} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ width: 800 }}>
          <Editor
            id={"openai"}
            height="350px"
            defaultLanguage="javascript"
            value={response}
            options={{
              readOnly: "true",
              minimap: {
                enabled: false,
              },
              scrollbar: {
                vertical: "hidden",
                horizontal: "hidden",
              },
              renderLineHighlightOnlyWhenFocus: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          {browserSupportsSpeechRecognition && (
            <IconButton onClick={listenUser}>
              {listen ? (
                <MicIcon sx={{ color: "primary" }} />
              ) : (
                <MicNoneIcon sx={{ color: "primary" }} />
              )}
            </IconButton>
          )}
          <TextField
            autoComplete="off"
            sx={{ width: "100%", ml: 2 }}
            inputProps={{ style: { fontFamily: "monospace" } }}
            placeholder={'Create item with name "item-1"...'}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                handleSend();
              }
            }}
            onChange={(e) => {
              if (e.target.value === "") {
                resetTranscript();
              }
              data.current.request = e.currentTarget.value;
              setInput(data.current.request);
            }}
            value={input || transcript}
          />
          <IconButton
            disabled={loading}
            color="primary"
            component="label"
            onClick={handleSend}
          >
            {loading ? <CircularProgress size={25} /> : <SendIcon />}
          </IconButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}
