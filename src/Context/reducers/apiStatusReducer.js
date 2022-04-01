function apiStatusReducer(state, { type, payload }) {
  switch (type) {
    case "SET_METRICS": {
      const tmpState = state;
      const status = payload.status.started;
      const metrics = payload.metrics;
      if (status) {
        tmpState.status = "connected";
        tmpState.metrics.free = formatBytes(metrics.free);
        tmpState.metrics.total = formatBytes(metrics.total);
        tmpState.metrics.animation = 0;
      } else {
        tmpState.status = "disconnected";
        tmpState.metrics.free = 1;
        tmpState.metrics.total = 99;
        tmpState.metrics.animation = 0;
      }
      return { ...tmpState };
    }

    case "SET_STATUS": {
      const tmpState = state;
      tmpState.status = payload;
      tmpState.metrics.animation = 0;
      return { ...tmpState };
    }

    default:
  }

  return state;
}

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm));
}

export { apiStatusReducer };
