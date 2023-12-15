import { base } from "./palette";
import { createTheme } from "@mui/material";

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
    apiTreeItem: {
      fontSize: 12,
      color: "#666",
      fontWeight: "bold",
      backgroundColor: "#fdfdfd",
      border: `1px solid #c3c5c8`,
      width: 44,
      borderRadius: 8,
      mt: 1 / 4,
      mb: 1 / 4,
      boxShadow: "1px 1px #b8b8b8",
    },
    drawer: {
      "& .MuiDrawer-paper": {
        top: "10%",
        height: 380,
        borderTopLeftRadius: "5px",
        borderBottomLeftRadius: "5px",
        background: "#353e48",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        paddingTop: 1,
        paddingBottom: 1,
      },
    },
    drawerSmall: {
      "& .MuiDrawer-paper": {
        top: "10%",
        height: 338,
        borderTopLeftRadius: "5px",
        borderBottomLeftRadius: "5px",
        background: "#353e48",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        paddingTop: 1,
        paddingBottom: 1,
      },
    },
  },
};

lightTheme = {
  ...lightTheme,
  spacing: (factor) => 8 * factor,
};

let darkTheme = createTheme({
  palette: {
    primary: {
      main: base.primary.dark,
    },
    secondary: {
      main: base.secondary.dark,
    },
    custom: {
      grey: base.grey[500],
      fossil: base.grey[500],
      darkDialogBg: "rgba(0,0,0,0.5)",
      darkDialogPanel: base.grey[800],
      darkDialog: base.grey[800],
      apiTreeRightClick: base.common.white,
      drawerBG: base.grey[900],
      textGray: base.grey[500],
      messageBG: base.grey[700],
    },
    background: {
      default: base.grey[900],
      paper: base.grey[800],
    },
    text: {
      primary: base.common.white,
      secondary: base.grey[500],
    },
  },
});

darkTheme = {
  ...darkTheme,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: base.grey[900],
          color: base.common.white,
          "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
            backgroundColor: base.grey[700],
            width: 6,
            height: 6,
          },
          "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
            borderRadius: 10,
            backgroundColor: base.grey[600],
            minHeight: 24,
            border: "3px",
          },
          "&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus":
            {
              backgroundColor: base.grey[500],
            },
          "&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active":
            {
              backgroundColor: base.grey[500],
            },
          "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover":
            {
              backgroundColor: base.grey[500],
            },
          "&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner": {
            backgroundColor: base.grey[800],
          },
        },
      },
    },

    MuiListItemButton: {
      styleOverrides: {
        root: {
          backgroundColor: `${base.grey[900]} !important`,
          color: base.grey[500],
          "&:hover": {
            backgroundColor: base.grey[800],
          },

          "&.Mui-selected, &.Mui-selected:hover": {
            backgroundColor: base.secondary.main,
            color: base.common.white,
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
          backgroundColor: base.grey[900],
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
          color: "white",
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          backgroundColor: base.grey[800],
          color: base.common.white,
          "&:hover": {
            backgroundColor: base.grey[700],
          },
          boxShadow: "none",
          "&.Mui-disabled": {
            backgroundColor: base.grey[600],
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          background: base.grey[300],
          color: base.grey[400],
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
    apiTreeItem: {
      fontSize: 12,
      color: base.grey[400],
      fontWeight: "bold",
      backgroundColor: base.grey[900],
      border: `1px solid ${base.grey[800]}`,
      width: 44,
      borderRadius: 8,
      mt: 1 / 4,
      mb: 1 / 4,
      boxShadow: `1px 1px ${base.grey[700]}`,
    },
    drawer: {
      "& .MuiDrawer-paper": {
        top: "10%",
        height: 380,
        borderTopLeftRadius: "5px",
        borderBottomLeftRadius: "5px",
        background: base.grey[900],
        border: `1px solid ${base.grey[600]}`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        paddingTop: 1,
        paddingBottom: 1,
      },
    },
    drawerSmall: {
      "& .MuiDrawer-paper": {
        top: "10%",
        height: 338,
        borderTopLeftRadius: "5px",
        borderBottomLeftRadius: "5px",
        background: base.grey[900],
        border: `1px solid ${base.grey[600]}`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        paddingTop: 1,
        paddingBottom: 1,
      },
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
