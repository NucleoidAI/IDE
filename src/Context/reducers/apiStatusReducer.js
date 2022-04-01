function apiStatusReducer(state, { type, payload }) {
  switch (type) {
    case "SET_METRICS":
      console.log("SET_METRICS");
      break;
    case "SET_STATUS": {
      const tmpState = state;
      tmpState.status = payload;
      tmpState.metrics.free = Math.random() % 100;
      tmpState.metrics.total = Math.random() % 100;
      tmpState.metrics.animation = false;
      return { ...tmpState };
    }

    default:
  }

  return state;
}

export { apiStatusReducer };
