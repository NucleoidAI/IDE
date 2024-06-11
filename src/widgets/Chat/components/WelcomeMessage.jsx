import Logo from "../../../components/Logo";

import { Box, Typography } from "@mui/material";

const WelcomeMessage = () => {
  return (
    <Box
      data-cy="chat-welcome-message"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        textAlign: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "8px",
        }}
      >
        <Logo beta={false} title={"Chat"} />
      </Box>
      <Typography variant="h4" gutterBottom sx={{ marginBottom: "4px" }}>
        Neuro-Symbolic AI
      </Typography>
      <Typography sx={{ fontStyle: "italic" }}>
        Build your logical context
      </Typography>
    </Box>
  );
};

export default WelcomeMessage;
