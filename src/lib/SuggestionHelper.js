const getSuggestions = (suggestionTree, chat) => {
  const userMessages = chat.messages.filter(
    (message) => message.role === "USER"
  );

  let currentLevel = suggestionTree;
  for (const message of userMessages) {
    const matchedSuggestion = currentLevel.find(
      (suggestion) => suggestion.summary === message.content
    );

    if (matchedSuggestion) {
      if (matchedSuggestion.children) {
        currentLevel = matchedSuggestion.children;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  return currentLevel;
};

export default getSuggestions;
