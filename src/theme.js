import { createTheme } from "@mui/material";

let theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#e0e0e0",
    },
    secondary: {
      main: "#e0e0e0",
    },
    dark: {
      main: "#e0e0e0",
    },
    background: {
      default: "#eaeff1",
    },
    text: {
      primary: "#000",
      secondary: "#e0e0e0",
      dark: "#e0e0e0",
    },
    pressed: {
      default: "#e0e0e0",
    },
    custom: {
      grey: "rgba(255, 255, 255, 0.7)",
    },
  },
  props: {
    MuiButton: {
      variant: "contained",
    },
  },
});

theme = {
  ...theme,
  components: {
    MuiDrawer: {
      styleOverrides: {
        // Name of the slot
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
  spacing: (factor) => 8 * factor, // (Bootstrap strategy)
};

export default theme;
