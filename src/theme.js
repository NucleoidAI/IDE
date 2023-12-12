import { createTheme } from "@mui/material";
import { storage } from "@nucleoidjs/webstorage";

import { useEffect, useState } from "react";

let lightTheme = createTheme({
  palette: {
    primary: {
      main: "#747474",
    },
    secondary: {
      main: "#f4f4f4",
    },
    custom: {
      grey: "rgba(255, 255, 255, 0.7)",
      fossil: "#747474",
      darkDialogBg: "rgba(0,0,0,0.5)",
      darkDialogPanel: "#1c1c1c",
      darkDialog: "#424242",
      apiTreeRightClick: "rgba(0, 0, 0, 0.2)",
      drawerBG: "#353e48",
      textGray: "#c3c5c8",
      messageBG: "#f5f5f9",
    },
  },
  props: {
    MuiButton: {
      variant: "contained",
    },
  },
});

lightTheme = {
  ...lightTheme,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
            backgroundColor: "#fff",
            width: 6,
            height: 6,
          },
          "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
            borderRadius: 10,
            backgroundColor: "#959595",
            minHeight: 24,
            border: "3px",
          },
          "&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus":
            {
              backgroundColor: "#c9c9c9",
            },
          "&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active":
            {
              backgroundColor: "#c9c9c9",
            },
          "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover":
            {
              backgroundColor: "#c9c9c9",
            },
          "&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner": {
            backgroundColor: "#2b2b2b",
          },
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          "& .MuiDataGrid-columnHeader:focus-within, & .MuiDataGrid-cell:focus-within":
            {
              outline: "none",
            },
        },
      },
    },
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
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          background: "#c9c9c9",
          color: "#959595",
        },
      },
    },
  },
};

lightTheme = {
  ...lightTheme,
  custom: {
    schema: {
      width: 75,
    },
  },
};

lightTheme = {
  ...lightTheme,
  spacing: (factor) => 8 * factor, // Bootstrap strategy
};

let darkTheme = createTheme({
  palette: {
    primary: {
      main: "#bdbdbd",
    },
    secondary: {
      main: "#424242",
    },
    custom: {
      grey: "rgba(200, 200, 200, 0.7)",
      fossil: "#bdbdbd",
      darkDialogBg: "rgba(255,255,255,0.1)",
      darkDialogPanel: "#333333",
      darkDialog: "#616161",
      apiTreeRightClick: "rgba(255, 255, 255, 0.2)",
      drawerBG: "#252931",
      textGray: "#e0e0e0",
      messageBG: "#2c2c2c",
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
    text: {
      primary: "#ffffff",
      secondary: "#b3b3b3",
    },
  },
});

darkTheme = {
  ...darkTheme,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#121212",
          color: "#ffffff",
          "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
            backgroundColor: "#2c2c2c",
            width: 6,
            height: 6,
          },
          "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
            borderRadius: 10,
            backgroundColor: "#616161",
            minHeight: 24,
            border: "3px",
          },
          "&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus":
            {
              backgroundColor: "#757575",
            },
          "&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active":
            {
              backgroundColor: "#757575",
            },
          "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover":
            {
              backgroundColor: "#757575",
            },
          "&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner": {
            backgroundColor: "#1e1e1e",
          },
        },
      },
    },

    MuiListItemButton: {
      styleOverrides: {
        root: {
          backgroundColor: "#1C1C1C !important",
          color: "#e0e0e0",
          "&:hover": {
            backgroundColor: "#333333",
          },

          "&.Mui-selected, &.Mui-selected:hover": {
            backgroundColor: "#424242",
            color: "#ffffff",
          },
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          "& .MuiDataGrid-columnHeader:focus-within, & .MuiDataGrid-cell:focus-within":
            {
              outline: "none",
            },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#1C1C1C",
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
          backgroundColor: "rgba(0,0,0,0.5)",
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
          color: "white",
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          backgroundColor: "#333333",
          color: "#ffffff",
          "&:hover": {
            backgroundColor: "#484848",
          },

          boxShadow: "none",

          "&.Mui-disabled": {
            backgroundColor: "#555555",
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          background: "#c9c9c9",
          color: "#959595",
        },
      },
    },
  },
};

darkTheme = {
  ...darkTheme,
  custom: {
    schema: {
      width: 75,
    },
  },
};

darkTheme = {
  ...darkTheme,
  spacing: (factor) => 8 * factor, // Bootstrap strategy
};

const theme = lightTheme;
export { lightTheme, darkTheme };
export default theme;
