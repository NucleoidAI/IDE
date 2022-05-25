function layoutReducer(state, { type, payload }) {
  switch (type) {
    case "SET_STATUS": {
      const { status, metrics, openapi } = payload;
      const tmpState = state;

      tmpState.status = status;
      tmpState.openapi = openapi;
      tmpState.metrics.free = formatBytes(metrics.free);
      tmpState.metrics.total = formatBytes(metrics.total);
      tmpState.metrics.animation = 0;

      return { ...tmpState };
    }

    case "SANDBOX": {
      const { status, dialogStatus } = payload;
      const tmpState = state;

      if (status !== undefined && status !== null) {
        tmpState.sandbox = status;
      }

      if (dialogStatus !== undefined && dialogStatus !== null) {
        tmpState.sandboxDialog = dialogStatus;
      }

      return { ...tmpState };
    }
    case "SWAGGER_DIALOG": {
      const { dialogStatus } = payload;
      const tmpState = state;

      if (dialogStatus !== undefined && dialogStatus !== null) {
        tmpState.swagger = dialogStatus;
      }

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

export { layoutReducer };
