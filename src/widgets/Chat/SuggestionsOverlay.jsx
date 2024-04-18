import { publish } from "@nucleoidai/react-event";

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
    description: "Define an user with first name and last name",
    children: [
      {
        summary: "Definition of  Full Name",
        description: "Full name of user is first name and last name",
        children: [
          {
            summary: "Legend of John Doe",
            description: "Create user with name 'John Doe'",
          },
          {
            summary: "Initials",
            description:
              "Initials of user is first letter of first name and last name",
          },
        ],
      },
      {
        summary: "Legend of John Doe",
        description: "Create user with name 'John Doe'",
        children: [
          {
            summary: "Definition of Full Name",
            description: "Full name of user is first name and last name",
          },
          {
            summary: "Initials",
            description:
              "Initials of user is first letter of first name and last name",
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
          publish("SUGGESTIONS_OVERLAY", { active: false });
          return;
        }
      } else {
        setSuggestions(null);
        publish("SUGGESTIONS_OVERLAY", { active: false });
        return;
      }
    }

    setSuggestions(index);
    publish("SUGGESTIONS_OVERLAY", { active: true });
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
              variant="suggestion"
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
