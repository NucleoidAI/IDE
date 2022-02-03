import { createTheme } from "@mui/material";

let theme = createTheme({
  palette: {
    secondary: {
      main: "#fe6b8b",
    },
    background: {
      default: "#eaeff1",
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
    // Name of the component
    MuiButton: {
      styleOverrides: {
        // Name of the slot
        root: {
          // Some CSS
          fontSize: "1rem",
        },
      },
    },
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

export default theme;
