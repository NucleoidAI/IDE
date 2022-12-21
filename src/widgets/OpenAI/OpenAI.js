import ClosableDialogTitle from "../../components/ClosableDialogTitle";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Draggable from "react-draggable";
import Editor from "@monaco-editor/react";
import IconButton from "@mui/material/IconButton";
import OpenAIButton from "../../components/OpenAIButton";
import Paper from "@mui/material/Paper";
import React from "react";
import SendIcon from "@mui/icons-material/Send";
import { TextField } from "@mui/material";
import service from "../../service";

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

export default function OpenAI({ functions, code }) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [response, setResponse] = React.useState();
  const data = React.useRef({
    request: "",
  });

  const generateContent = ({ functions, request, code }) => {
    const functs = functions.map((item) => item.definition + "\n").join("");
    console.log(code);

    return functs + "//" + request;
  };

  const handleSend = async () => {
    if (data.current.request) {
      setLoading(true);
      const content = generateContent({
        functions: functions,
        request: data.current.request,
        code: code,
      });
      setResponse(await service.openai(content));
      setLoading(false);
    } else {
      alert("need text");
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <OpenAIButton clickEvent={handleClickOpen} />
      <Dialog
        open={open}
        //onClose={handleClose}
        disableEnforceFocus
        hideBackdrop={true}
        style={{ pointerEvents: "none" }}
        PaperProps={{ style: { pointerEvents: "auto" } }}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <ClosableDialogTitle
          handleClose={handleClose}
          label={"nucleoid openai"}
        />
        <DialogContent sx={{ width: 600 }}>
          <Editor
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
            autoFocus
            onChange={(e) => (data.current.request = e.target.value)}
          />
          <IconButton
            disabled={loading}
            color="primary"
            component="label"
            onClick={handleSend}
          >
            <SendIcon />
          </IconButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}
