import { createTheme } from "@mui/material";

let theme = createTheme({
  palette: {
    custom: {
      grey: "rgba(255, 255, 255, 0.7)",
    },
  },
  props: {
    MuiButton: {
      variant: "contained",
    },
  },
  transitions: {
    duration: {
      shortest: 1,
      shorter: 1,
      short: 1,
      standard: 1,
      complex: 1,
      enteringScreen: 1,
      leavingScreen: 1,
    },
  },
});

theme = {
  ...theme,
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#323a40",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        },
      },
    },
    MuiCardActions: {
      styleOverrides: {
        root: {
          justifyContent: "center",
        },
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(0,0,0,0.1)",
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "standard",
      },
    },
    MuiSelect: {
      defaultProps: {
        variant: "standard",
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          color: "black",
        },
      },
    },
  },
};

theme = {
  ...theme,
  custom: {
    schema: {
      width: 75,
    },
  },
};

theme = {
  ...theme,
  spacing: (factor) => 8 * factor, // Bootstrap strategy
};

export default theme;
