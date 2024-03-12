import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import NucEditor from "../../components/NucEditor/NucEditor";
import PromptInput from "../PromptInput/PromptInput";
import Slide from "@mui/material/Slide";
import { useContext } from "../../context/context";

import { Box, Card, CardContent, CardHeader, Fab, Stack } from "@mui/material";
import React, { useRef } from "react";

function PromptCodeDialog({
  handleSendAIClick,
  handleSaveAIResponse,
  handlePromptChange,
  setPromptValue,
  promptValue,
  loading,
  page,
  logo,
  onMount,
  inputPlaceHolder,
  isCodeGenerated,
  handleClose,
}) {
  const [context] = useContext();
  const editorRef = useRef(null);
  return (
    <Dialog
      open={Boolean(context.get(`pages.${page}.AIDialog.open`))}
      fullWidth={true}
      onClose={handleClose}
      sx={{
        "& .MuiDialog-paper": { borderRadius: 3 },
      }}
    >
      <DialogContent
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Stack sx={{ width: 1 }} direction={"column"}>
          <Card sx={{ width: 1, boxShadow: "none" }}>
            <CardHeader
              avatar={<Box component={logo} />}
              title={page.toUpperCase()}
              titleTypographyProps={{ variant: "h5" }}
            />
            <CardContent
              sx={{
                width: 1,
              }}
            >
              <Slide
                direction="up"
                in={isCodeGenerated}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div>
                  <Stack
                    direction={"column"}
                    sx={{
                      height: isCodeGenerated ? "17rem" : 2,
                      width: 1,
                    }}
                  >
                    <NucEditor onMount={onMount} ref={editorRef} />
                  </Stack>
                  <Fab
                    variant="button"
                    size="medium"
                    onClick={handleSaveAIResponse}
                    data-cy="promptCodeDialog-saveAIResponse-button"
                  >
                    <AutoFixHighIcon />
                  </Fab>
                </div>
              </Slide>
            </CardContent>
            <PromptInput
              handleSendAIClick={handleSendAIClick}
              handlePromptChange={handlePromptChange}
              setPromptValue={setPromptValue}
              promptValue={promptValue}
              isCodeGenerated={isCodeGenerated}
              loading={loading}
              inputPlaceHolder={inputPlaceHolder}
            />
          </Card>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

export default PromptCodeDialog;
