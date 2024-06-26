import React from "react";
import ReadOnlyEditor from "../../../components/ReadOnlyEditor";

import { Box, Typography } from "@mui/material";

function MessageBox({
  message = { role: "USER", content: "Hello" },
  handleOpenDialog,
  onlyUser,
  currentMessage,
  isCodeCollapsed = true,
}) {
  if (onlyUser) {
    message.content = currentMessage;
  }

  return (
    <Box
      data-cy="message-box"
      sx={{
        width: {
          xs: "100%",
          sm: "90%",
          md: "80%",
          lg: "70%",
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
        data-cy="message-role"
      >
        {message.role}
      </Typography>
      <Typography
        variant="body1"
        sx={{ userSelect: "text" }}
        data-cy="message-content"
      >
        {message.content}
      </Typography>
      {message.code && (
        <Box
          component="pre"
          sx={{
            overflowX: "auto",
            justifyContent: "center",
            marginTop: "8px",
            borderRadius: "5px",
            padding: "0",
            userSelect: "text",
            width: "100%",
          }}
        >
          <ReadOnlyEditor
            title={"Ubiquitous Code"}
            value={
              message.result
                ? `${message.code}\n\n// Result: ${JSON.stringify(
                    message.result
                  )}`
                : message.code
            }
            language="typescript"
            onActionClick={() => handleOpenDialog(message.code)}
            isCollapsed={isCodeCollapsed}
          />
        </Box>
      )}
    </Box>
  );
}

export default MessageBox;
