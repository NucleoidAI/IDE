import React from "react";

import { Box, Button, Stack, Typography, useTheme } from "@mui/material";

const suggestions = [
  {
    summary: "Define a new rule",
    description: "Define a new rule for user authentication",
  },
  {
    summary: "Test the logic",
    description: "Test the logic for the shopping cart discount",
  },
];

const SuggestionsOverlay = ({ setInputValue }) => {
  const theme = useTheme();

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        position: "absolute",
        bottom: "10%",
        width: "100%",
        padding: "10px",
        zIndex: 1201,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          width: "70%",
          gap: "10px",
        }}
      >
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant="outlined"
            sx={{
              flexGrow: 1,
              minHeight: "100px",
              backgroundColor: theme.palette.background.default,
              borderColor: theme.palette.grey[600],
              "&:hover": {
                backgroundColor: theme.palette.grey[200],
                borderColor: theme.palette.primary.main,
              },
              textAlign: "left",
              justifyContent: "flex-start",
              borderRadius: "8px",
              textTransform: "none",
              fontSize: "0.875rem",
              fontWeight: "medium",
              width: "calc(50% - 30px)",
            }}
            onClick={() => handleSuggestionClick(suggestion)}
          >
            <Stack direction={"column"}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {suggestion.summary}
              </Typography>
              <Typography>{suggestion.description}</Typography>
            </Stack>
          </Button>
        ))}
      </Box>
    </Box>
  );
};

export default SuggestionsOverlay;
