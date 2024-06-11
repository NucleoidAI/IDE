import { AutoAwesome } from "@mui/icons-material";
import { Box, CardActions, Fab, Typography } from "@mui/material";

function BlankTreeMessage({ item, openLogicDialog, functionsExist }) {
  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            color: "text.secondary",
            textAlign: "center",
          }}
        >
          No {item} defined yet
        </Typography>
      </Box>
      {functionsExist && (
        <Box
          sx={{ display: "flex", justifyContent: "center", marginBottom: 1 }}
        >
          <CardActions>
            <Fab size="medium" onClick={openLogicDialog}>
              <AutoAwesome />
            </Fab>
          </CardActions>
        </Box>
      )}
    </Box>
  );
}

export default BlankTreeMessage;
