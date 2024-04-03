import { Stack, Typography } from "@mui/material";

function BlankTreeMessage({ item }) {
  return (
    <Stack sx={{ height: "100%", display: "flex", justifyContent: "center" }}>
      <Typography
        sx={{
          color: "text.secondary",
          textAlign: "center",
          textJustify: "center",
        }}
      >
        No {item} defined yet
      </Typography>
    </Stack>
  );
}

export default BlankTreeMessage;
