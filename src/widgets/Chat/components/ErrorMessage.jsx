import RefreshIcon from "@mui/icons-material/Refresh";

import { Box, Stack, Typography, alpha } from "@mui/material";

const ErrorMessage = ({ show, content, type, refreshChat }) => {
  return (
    show && (
      <Box
        sx={{
          backgroundColor: alpha("#f44336", 0.1),
          border: "1px solid #f44336",
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
          >
            EXPERT ERROR
          </Typography>
          <Box
            component={RefreshIcon}
            onClick={refreshChat}
            sx={{
              "&:hover": {
                color: "gray",
                cursor: "pointer",
              },
            }}
          />
        </Stack>
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: "bold", my: "8px", userSelect: "text" }}
        >
          {type}
        </Typography>
        <Typography variant="body1" sx={{ userSelect: "text" }}>
          {content}
        </Typography>
      </Box>
    )
  );
};

export default ErrorMessage;
