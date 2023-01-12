import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import CloseIcon from "@mui/icons-material/Close";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Draggable from "react-draggable";
import Editor from "@monaco-editor/react";
import IconButton from "@mui/material/IconButton";
import OpenAIButton from "../../components/OpenAIButton";
import OpenAIIcon from "../../icons/OpenAI";
import Paper from "@mui/material/Paper";
import React from "react";
import SendIcon from "@mui/icons-material/Send";
import service from "../../service";
import { Button, DialogTitle, TextField } from "@mui/material";
import { deepCopy } from "../../utils/DeepCopy"; //eslint-disable-line

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

export default function OpenAI({ functions, code, editor }) {
  const nucFunctions = deepCopy(functions);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [response, setResponse] = React.useState();
  const data = React.useRef({
    request: "",
  });

  const generateContent = ({ functions, request, code }) => {
    const mEditor = editor.current.editor;
    const functs = functions.map((item) => item.definition + "\n").join("");
    const selected = mEditor.getModel().getValueInRange(mEditor.getSelection());

    return functs + selected + "\n\n//" + request;
  };

  const handleSend = async () => {
    if (data.current.request) {
      setLoading(true);
      const content = generateContent({
        functions: nucFunctions,
        request: data.current.request,
        code: code,
      });

      console.log(content);

      const res = await service.openai(content);
      //console.log(content);

      setResponse(res);
      setLoading(false);
    } else {
      alert("need text");
    }
  };

  const handleClickOpen = () => {
    setResponse("");
    data.current.request = "";
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleGenerate = () => {
    /* const mEditor = editor.current.editor;
    const lineNumber = mEditor.getSelection().endLineNumber;
    console.log(mEditor.getModel().getValue());
    mEditor.getModel().setValue("hello");

    console.log(response.data.text);
    */
  };

  return (
    <div>
      <OpenAIButton clickEvent={handleClickOpen} />
      <Dialog
        open={open}
        //onClose={handleClose}
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
              <Button size="small" onClick={handleGenerate}>
                GENERATE
              </Button>
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
            value={response?.data?.text}
            options={{
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
          <TextField
            sx={{ width: "100%", ml: 2 }}
            inputProps={{ style: { fontFamily: "monospace" } }}
            //placeholder={"input some text"}
            onKeyPress={(e) => {
              if (e.ctrlKey && e.key === "\n") {
                handleSend();
              }
            }}
            autoFocus
            onChange={(e) => (data.current.request = e.target.value)}
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
