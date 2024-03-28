import EditIcon from "@mui/icons-material/Edit";
import ReadOnlyEditor from "../../../components/ReadOnlyEditor";

import { Box, Typography } from "@mui/material";

function MessageBox({
  message = { role: "USER", content: "Hello" },
  handleOpenDialog,
  onlyUser,
  currentMessage,
}) {
  if (onlyUser) {
    message.content = currentMessage;
  }

  return (
    <Box
      sx={{
        width: {
          xs: "100%",
          sm: "90%",
          md: "80%",
        },
        marginBottom: {
          xs: "12px",
          sm: "16px",
          md: "20px",
        },
        padding: "10px",
        borderRadius: "10px",
        textAlign: "left",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        userSelect: "text",
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{ fontWeight: "bold", marginBottom: "8px", userSelect: "text" }}
      >
        {message.role}
      </Typography>
      <Typography variant="body1" sx={{ userSelect: "text" }}>
        {message.content}
      </Typography>
      {message.code && (
        <Box
          component="pre"
          sx={{
            overflowX: "auto",
            justifyContent: "center",
            marginTop: "8px",
            backgroundColor: (theme) => theme.palette.grey[100],
            borderRadius: "5px",
            padding: "0",
            userSelect: "text",
            width: "100%",
          }}
        >
          <ReadOnlyEditor
            value={message.code}
            language="typescript"
            actionIcon={EditIcon}
            onActionClick={() => handleOpenDialog(message.code)}
          />
        </Box>
      )}
    </Box>
  );
}

export default MessageBox;
