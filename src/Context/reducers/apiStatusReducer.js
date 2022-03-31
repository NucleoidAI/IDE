function apiStatusReducer(state, { type, payload }) {
  switch (type) {
    case "SELAM": {
      return "selam";
      break;
    }

    default:
  }

  return state;
}

export { apiStatusReducer };
