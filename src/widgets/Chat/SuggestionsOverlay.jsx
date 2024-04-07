import { Box, Button, Stack, Typography, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";

const initialSuggestions = [
  {
    summary: "Option 1",
    description: "Description for Option 1",
    children: [
      {
        summary: "Option 1.1",
        description: "Description for Option 1.1",
        children: [
          {
            summary: "Option 1.1.1",
            description: "Description for Option 1.1.1",
          },
          {
            summary: "Option 1.1.2",
            description: "Description for Option 1.1.2",
          },
        ],
      },
      {
        summary: "Option 1.2",
        description: "Description for Option 1.2",
        children: [
          {
            summary: "Option 1.2.1",
            description: "Description for Option 1.2.1",
          },
          {
            summary: "Option 1.2.2",
            description: "Description for Option 1.2.2",
          },
        ],
      },
    ],
  },
  {
    summary: "Option 2",
    description: "Description for Option 2",
    children: [
      {
        summary: "Option 2.1",
        description: "Description for Option 2.1",
        children: [
          {
            summary: "Option 2.1.1",
            description: "Description for Option 2.1.1",
          },
          {
            summary: "Option 2.1.2",
            description: "Description for Option 2.1.2",
          },
        ],
      },
      {
        summary: "Option 2.2",
        description: "Description for Option 2.2",
        children: [
          {
            summary: "Option 2.2.1",
            description: "Description for Option 2.2.1",
          },
          {
            summary: "Option 2.2.2",
            description: "Description for Option 2.2.2",
          },
        ],
      },
    ],
  },
];

const SuggestionsOverlay = ({ onSuggestionClick, loading, chat }) => {
  const theme = useTheme();
  const [suggestions, setSuggestions] = useState(null);

  useEffect(() => {
    const userMessages = chat.messages.filter(
      (message) => message.role === "USER"
    );

    let index = initialSuggestions;

    for (const message of userMessages) {
      const matchedSuggestion = index.find(
        (suggestion) => suggestion.summary === message.content
      );

      if (matchedSuggestion) {
        if (matchedSuggestion.children) {
          index = matchedSuggestion.children;
        } else {
          setSuggestions(null);
          return;
        }
      } else {
        setSuggestions(null);
        return;
      }
    }

    setSuggestions(index);
  }, [chat]);

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
      }}
    >
      {!loading && suggestions && (
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
              onClick={() => onSuggestionClick(suggestion)}
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
      )}
    </Box>
  );
};

export default SuggestionsOverlay;
