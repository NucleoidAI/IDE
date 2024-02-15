import CodeEditor from "./CodeEditor";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import HubIcon from "@mui/icons-material/Hub";
import PromptArea from "./PromptArea";
import Slide from "@mui/material/Slide";
import actions from "../../actions";
import { useContext } from "../../context/context";

import { Card, CardContent, CardHeader, Divider, Stack } from "@mui/material";
import { useEffect, useState } from "react";

function CodeDialog({
  handleSendAIClick,
  handleSaveAIResponse,
  saveChangedCode,
  handlePromptChange,
  onCodeEditorChange,
  handleEditorChange,
  setPromptValue,
  promptValue,
  generatedCode,
  loading,
  isCodeChanged,
}) {
  const [context, dispatch] = useContext();
  const [isCodeGenerated, setIsCodeGenerated] = useState(false);

  useEffect(() => {
    if (generatedCode === "") {
      setIsCodeGenerated(false);
    } else {
      setIsCodeGenerated(true);
    }
  }, [generatedCode]);

  const handleClose = () => {
    dispatch({ type: actions.closeLogicDialog });
    setIsCodeGenerated(false);
  };

  return (
    <Dialog
      open={Boolean(context.get("pages.logic.dialog.open"))}
      fullWidth={true}
      onClose={handleClose}
      sx={{
        borderRadius: 4,
        "& .MuiDialog-paper": { borderRadius: 3 },
      }}
    >
      <DialogContent
        fullWidth={true}
        sx={{
          display: "flex",
          alignItems: "center",
          padding: 2,
          borderRadius: 3,
          width: "100%",
        }}
      >
        <Stack sx={{ width: 1 }} direction={"column"}>
          <Card sx={{ width: 1 }}>
            <CardHeader
              avatar={<HubIcon />}
              title="Logic"
              titleTypographyProps={{ variant: "h5" }}
            />

            <Slide direction="up" in={isCodeGenerated}>
              <div>
                <Divider color="gray" />
                <CardContent sx={{ height: isCodeGenerated ? "17rem" : 1 }}>
                  <CodeEditor
                    generatedCode={generatedCode}
                    onCodeEditorChange={onCodeEditorChange}
                  />
                </CardContent>
              </div>
            </Slide>
          </Card>
          <PromptArea
            handleSendAIClick={handleSendAIClick}
            handleSaveAIResponse={handleSaveAIResponse}
            handlePromptChange={handlePromptChange}
            handleEditorChange={handleEditorChange}
            saveChangedCode={saveChangedCode}
            setPromptValue={setPromptValue}
            promptValue={promptValue}
            isCodeGenerated={isCodeGenerated}
            isCodeChanged={isCodeChanged}
            loading={loading}
          />
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

export default CodeDialog;
