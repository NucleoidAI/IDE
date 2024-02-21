import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import IconButton from "@mui/material/IconButton";
import NucEditor from "../../components/NucEditor/NucEditor";
import PromptInput from "../PromptInput/PromptInput";
import Slide from "@mui/material/Slide";
import { alpha } from "@mui/material/styles";
import { useContext } from "../../context/context";

import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Stack,
} from "@mui/material";

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
  return (
    <Dialog
      open={Boolean(context.get(`pages.${page}.AIDialog.open`))}
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
              avatar={<Box component={logo} />}
              title={page.toUpperCase()}
              titleTypographyProps={{ variant: "h5" }}
            />

            <Slide direction="up" in={isCodeGenerated}>
              <div>
                <Divider color="gray" />
                <CardContent
                  sx={{
                    height: isCodeGenerated ? "17rem" : 2,
                    width: 1,
                    m: 1,
                  }}
                >
                  <Stack
                    direction={"column"}
                    sx={{
                      width: 1,
                      height: 1,
                      display: "flex",
                      alignItems: "flex-end",
                    }}
                  >
                    <NucEditor onMount={onMount} />

                    <IconButton
                      data-cy="promptCodeDialog-saveAIResponse-button"
                      onClick={handleSaveAIResponse}
                      sx={{
                        width: 32,
                        height: 32,
                        mt: 2,
                        mr: 3,
                        display: "flex",
                        alignContent: "start",
                        justifyItems: "start",
                        border: `1px solid ${alpha("#209958", 0.7)}`,
                        backgroundColor:
                          promptValue !== "" ? alpha("#209958", 0.7) : "",
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
                  </Stack>
                </CardContent>
              </div>
            </Slide>
          </Card>
          <PromptInput
            handleSendAIClick={handleSendAIClick}
            handlePromptChange={handlePromptChange}
            setPromptValue={setPromptValue}
            promptValue={promptValue}
            isCodeGenerated={isCodeGenerated}
            loading={loading}
            inputPlaceHolder={inputPlaceHolder}
          />
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

export default PromptCodeDialog;
