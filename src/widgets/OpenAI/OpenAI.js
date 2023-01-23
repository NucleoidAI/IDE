import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import CloseIcon from "@mui/icons-material/Close";
import { DescriptionPopover } from "../../components/DescriptionPopover/DescriptionPopover";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Draggable from "react-draggable";
import Editor from "@monaco-editor/react";
import MarkQuestionIcon from "@mui/icons-material/Help";
import OpenAIButton from "../../components/OpenAIButton";
import OpenAICodeExplainButton from "../../components/OpenAICodeExplainButton";
import OpenAIIcon from "../../icons/OpenAI";
import Paper from "@mui/material/Paper";
import React from "react";
import SendIcon from "@mui/icons-material/Send";
import Settings from "../../settings";
import service from "../../service";
import { Button, DialogTitle, IconButton, TextField } from "@mui/material";
import { deepCopy } from "../../utils/DeepCopy"; //eslint-disable-line
import prettier from "../../prettier";
import prettierPlugins from "../../prettierPlugins";

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

  const data = React.useRef({
    request: "",
    content: "",
  });

  const generateContent = React.useCallback(
    ({ functions }) => {
      const mEditor = editor.current.editor;

      const selected = mEditor
        .getModel()
        .getValueInRange(mEditor.getSelection());

      return functions.map((item) => item.definition).join("\n") + selected;
    },
    [editor]
  );

  React.useEffect(() => {
    if (editor.current) {
      const nucFunctions = deepCopy(functions);
      data.content = generateContent({
        functions: nucFunctions,
      });
    }
  }, [open, functions, editor, generateContent]);

  const handleSend = async () => {
    if (data.current.request) {
      setLoading(true);
      service
        .openai(data.content + data.current.request)
        .then((res) => {
          setResponse(res);
        })
        .finally(() => setLoading(false));

      const res = await service.openai(
        data.content?.trim(),
        data.current.request?.trim()
      );

      setResponse(res.data.text?.trim());
      setLoading(false);
    } else {
      alert("need text");
    }
  };

  const handleClickOpen = () => {
    if (Settings.token()) {
      setResponse("");
      data.current.request = "";
      data.current.content = "";
      setOpen(true);
    } else {
      setLogin(true);
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("accessToken");

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

    if (lineNumber > 1) {
      const withLine = mEditor.getModel().getValue().split("\n");

      withLine.splice(lineNumber, 0, response);
      const res = withLine.join("\n");
      const prettyText = prettier.format(res, {
        parser: "babel",
        plugins: prettierPlugins,
      });

      mEditor.getModel().setValue(prettyText);
    } else {
      const action = prettier.format(
        `
      function action(req) {
        ${response}
      }
      `,
        {
          parser: "babel",
          plugins: prettierPlugins,
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
      .openai(value + "\nexplain this code")
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
            bottom: 40,
            left: 10,
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
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <TextField
                  inputProps={{
                    style: { fontFamily: "monospace", fontSize: 14 },
                  }}
                  sx={{ p: 1, width: 450 }}
                  multiline
                  rows={15}
                  variant={"outlined"}
                  value={data.content}
                />

                <IconButton onClick={handleClose} size="small">
                  <CloseIcon />
                </IconButton>
              </DescriptionPopover>
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
