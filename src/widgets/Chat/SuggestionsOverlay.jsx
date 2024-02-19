import React from "react";

import { Box, Button, useTheme } from "@mui/material";

const suggestions = [
  "Define a new rule for user authentication",
  "Test the logic for the shopping cart discount",
  "Create a charter for managing state",
  "Brainstorm edge cases for the payment processing workflow",
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
              minHeight: "60px",
              backgroundColor: theme.palette.background.default,
              borderColor: theme.palette.grey[500],
              "&:hover": {
                backgroundColor: theme.palette.grey[200],
                borderColor: theme.palette.primary.main,
              },
              textAlign: "left",
              justifyContent: "flex-start",
              borderRadius: "10px",
              textTransform: "none",
              fontSize: "0.875rem",
              fontWeight: "medium",
              width: "calc(50% - 30px)",
            }}
            onClick={() => handleSuggestionClick(suggestion)}
          >
            {suggestion}
          </Button>
        ))}
      </Box>
    </Box>
  );
};

export default SuggestionsOverlay;
