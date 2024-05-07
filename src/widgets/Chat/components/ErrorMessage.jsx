import RefreshIcon from "@mui/icons-material/Refresh";
import { publish } from "@nucleoidai/react-event";

import { Box, Stack, Typography, alpha } from "@mui/material";

const ErrorMessage = ({ show, content, type, refreshChat }) => {
  const handleChatRefresh = () => {
    publish("EXPERT_ERROR_OCCURRED", {
      chatId: "",
      type: "",
      content: "",
    });
    refreshChat();
  };

  return (
    show && (
      <Box
        data-cy="error-message"
        sx={{
          backgroundColor: alpha("#f44336", 0.1),
          border: "1px solid #f44336",
          width: { xs: "100%", sm: "90%", md: "80%", lg: "70%" },
          marginBottom: { xs: "12px", sm: "16px", md: "20px" },
          padding: "10px",
          borderRadius: "10px",
          textAlign: "left",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          userSelect: "text",
        }}
      >
        <Stack
          direction={"row"}
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "space-between",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: "bold", userSelect: "text" }}
            data-cy="error-title"
          >
            EXPERT ERROR
          </Typography>
          <Box
            component={RefreshIcon}
            onClick={handleChatRefresh}
            sx={{
              "&:hover": {
                color: "gray",
                cursor: "pointer",
              },
            }}
            data-cy="refresh-icon"
          />
        </Stack>
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: "bold", my: "8px", userSelect: "text" }}
          data-cy="error-type"
        >
          {type}
        </Typography>
        <Typography
          variant="body1"
          sx={{ userSelect: "text" }}
          data-cy="error-content"
        >
          {content}
        </Typography>
      </Box>
    )
  );
};

export default ErrorMessage;
