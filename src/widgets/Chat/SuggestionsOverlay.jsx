import { Box, Button, Stack, Typography, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";

const initialSuggestions = [
  {
    summary: "Socrates Syllogism",
    description: "Define human with a name",
    children: [
      {
        summary: "Mortality of Humans",
        description: "All humans are mortal",
        children: [
          {
            summary: "Born of Socrates",
            description: "Create a human with name 'Socrates'",
          },
          {
            summary: "Born of Plato",
            description: "Create a human with name 'Plato'",
          },
        ],
      },
      {
        summary: "Born of Socrates",
        description: "Create a human with name 'Socrates'",
        children: [
          {
            summary: "Mortality of Humans",
            description: "All humans are mortal",
          },
          {
            summary: "Mortality of Socrates",
            description: "Socrates is mortal",
          },
        ],
      },
    ],
  },
  {
    summary: "User Flow",
    description: "Define user with first name and last name",
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

const SuggestionsOverlay = ({ onSuggestionClick, loading, chat, error }) => {
  const theme = useTheme();
  const [suggestions, setSuggestions] = useState(null);

  useEffect(() => {
    const userMessages = chat.messages.filter(
      (message) => message.role === "USER"
    );

    let index = initialSuggestions;

    for (const message of userMessages) {
      const matchedSuggestion = index.find(
        (suggestion) => suggestion.description === message.content
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

  if (error.status && error.chatId === chat.id) {
    return null;
  }

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
                minHeight: "80px",
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
                <Typography sx={{ fontWeight: "bold" }}>
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
