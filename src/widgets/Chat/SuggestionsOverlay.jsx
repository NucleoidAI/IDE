import { publish } from "@nucleoidai/react-event";

import { Box, Button, Stack, Typography } from "@mui/material";
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
            children: [
              {
                summary: "Finding Socrates",
                description: "Find human with name 'Socrates'",
              },
              {
                summary: "List of Mortals",
                description: "List all humans who are mortal",
              },
            ],
          },
          {
            summary: "Born of Plato",
            description: "Create a human with name 'Plato'",
            children: [
              {
                summary: "Finding Socrates",
                description: "Find human with name 'Socrates'",
              },
              {
                summary: "List of Mortals",
                description: "List all humans who are mortal",
              },
            ],
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
            children: [
              {
                summary: "Finding Socrates",
                description: "Find human with name 'Socrates'",
              },
              {
                summary: "List of Mortals",
                description: "List all humans who are mortal",
              },
            ],
          },
          {
            summary: "Mortality of Socrates",
            description: "Socrates is mortal",
            children: [
              {
                summary: "Finding Socrates",
                description: "Find human with name 'Socrates'",
              },
              {
                summary: "List of Mortals",
                description: "List all humans who are mortal",
              },
            ],
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
            children: [
              {
                summary: "Finding John Doe",
                description: "Find user with name 'John Doe'",
              },
              {
                summary: "List of Does",
                description: "List all users whose last name is 'Doe'",
              },
            ],
          },
          {
            summary: "Initials",
            description:
              "Initials of user is first letter of first name and last name",
            children: [
              {
                summary: "Finding John Doe",
                description: "Find user with name 'John Doe'",
              },
              {
                summary: "List of Does",
                description: "List all users whose last name is 'Doe'",
              },
            ],
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
            children: [
              {
                summary: "Finding John Doe",
                description: "Find user with name 'John Doe'",
              },
              {
                summary: "List of Does",
                description: "List all users whose last name is 'Doe'",
              },
            ],
          },
          {
            summary: "Initials",
            description:
              "Initials of user is first letter of first name and last name",
            children: [
              {
                summary: "Finding John Doe",
                description: "Find user with name 'John Doe'",
              },
              {
                summary: "List of Does",
                description: "List all users whose last name is 'Doe'",
              },
            ],
          },
        ],
      },
    ],
  },
];

const SuggestionsOverlay = ({ onSuggestionClick, loading, chat, error }) => {
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
      data-cy="suggestions-overlay"
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
          data-cy="suggestions-container"
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
              data-cy={`suggestion-button-${index}`}
              onClick={() => onSuggestionClick(suggestion)}
            >
              <Stack direction={"column"}>
                <Typography
                  sx={{ fontWeight: "bold" }}
                  data-cy="suggestion-summary"
                >
                  {suggestion.summary}
                </Typography>
                <Typography data-cy="suggestion-description">
                  {suggestion.description}
                </Typography>
              </Stack>
            </Button>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default SuggestionsOverlay;
