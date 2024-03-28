import Logo from "../../../components/Logo";

import { Box, Typography } from "@mui/material";

const WelcomeMessage = () => {
  return (
    <Box
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
        <Logo beta={false} />
      </Box>
      <Typography variant="h4" gutterBottom sx={{ marginBottom: "4px" }}>
        Welcome to the NucChat!
      </Typography>
      <Typography variant="subtitle1">This is subtitle</Typography>
    </Box>
  );
};

export default WelcomeMessage;
