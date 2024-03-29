import { alpha } from "@mui/material/styles";
import { createTheme } from "@mui/material";

import { action, base, error, primary, success } from "./palette";

const micAnimation = {
  "& span": {
    display: "block",
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    margin: "auto",
    height: "32px",
    width: "32px",
    "&::before, &::after": {
      content: '""',
      display: "block",
      position: "absolute",
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      margin: "auto",
      height: "32px",
      width: "32px",
      border: "2px solid #FFF",
      borderRadius: "50%",
      opacity: 0,
      animation:
        "loader-6-1 1.5s cubic-bezier(0.075, 0.820, 0.165, 1.000) infinite",
    },
    "&::after": {
      animation:
        "loader-6-2 1.5s cubic-bezier(0.075, 0.820, 0.165, 1.000) .25s infinite",
    },
  },
};

const commonThemeProperties = {
  props: {
    MuiButton: {
      variant: "contained",
    },
  },
  components: {
    MuiDialog: {
      styleOverrides: {
        root: {
          "& .MuiDialog-paper": {
            borderRadius: "10px",
          },
        },
      },
    },
    MuiListItemIcon: {
      variants: [
        {
          props: { variant: "pageIcon" },
          style: {
            color: base.grey[400],
          },
        },
      ],
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

    MuiCircularProgress: {
      variants: [
        {
          props: { show: false },
          style: {
            display: "none",
          },
        },
      ],
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
    MuiListItem: {
      variants: [
        {
          props: { variant: "default" },
          style: {
            borderWidth: 1,
            borderStyle: "solid",
            borderRadius: "2px",
            borderColor: "transparent",
            "&:hover": {
              borderWidth: 1,
              borderStyle: "solid",
              borderRadius: "5px",
              borderColor: primary.main,
              backgroundColor: alpha(primary.main, action.hoverOpacity),
            },
          },
        },
        {
          props: { variant: "current" },
          borderWidth: 1,
          borderStyle: "solid",
          borderRadius: "2px",
          style: {
            borderRadius: "5px",
            backgroundColor: alpha(action.highlight, action.hoverOpacity),
          },
        },
        {
          props: { variant: "select" },
          borderWidth: 1,
          borderStyle: "solid",
          borderRadius: "2px",
          style: {
            borderRadius: "5px",
            borderColor: primary.main,
            backgroundColor: alpha(action.highlight, 0.6),
          },
        },
        {
          props: { variant: "delete" },
          borderWidth: 1,
          borderStyle: "solid",
          borderRadius: "2px",
          style: {
            borderStyle: "solid",
            borderWidth: 1,
            borderRadius: "5px",
            borderColor: error.main,
            backgroundColor: alpha(error.main, action.hoverOpacity),
          },
        },
      ],
    },
    MuiSvgIcon: {
      variants: [
        {
          props: { variant: "pageIcon" },
          style: {
            color: base.grey[400],
          },
        },
      ],
    },
  },
  custom: {
    chat: {
      inputBorderRadius: "10px",
    },
    schema: {
      width: 75,
    },
  },
  spacing: (factor) => 8 * factor,
};

const lightTheme = createTheme({
  palette: {
    primary: {
      main: "#747474",
    },
    secondary: {
      main: "#f4f4f4",
    },
    error: { main: "#d32f2f", dark: "#c62828", light: "#ef5350" },
    doneIcon: alpha(success.main, 0.5),
    cancelIcon: alpha(error.main, 0.5),
    highlight: "#007867",
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
  ...commonThemeProperties.props,
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
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: "#343a43",
          },
        },
      },
    },

    MuiFab: {
      variants: [
        {
          props: { variant: "button" },
          style: (props) => ({
            color: base.grey[900],
            display: props.hide || props.loading ? "none" : "flex",
            ...(props.type === "mic" && props.activate ? micAnimation : {}),
          }),
        },
        {
          props: { variant: "transparent" },
          style: {
            backgroundColor: alpha(base.grey[300], 0.8),
            color: base.grey[900],
            "&:hover": {
              backgroundColor: alpha(base.grey[700], 0.8),
              color: base.grey[200],
            },
            "&:disabled": {
              color: base.grey[700],
            },
          },
        },
      ],
      styleOverrides: {
        root: {
          backgroundColor: base.grey[300],
          color: base.grey[900],
          "&:hover": {
            backgroundColor: base.grey[700],
            color: base.grey[200],
          },
          "&:disabled": {
            color: base.grey[700],
          },
        },
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#343a43",
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

    MuiLinearProgress: {
      styleOverrides: {
        root: {
          background: "#c9c9c9",
          color: "#959595",
        },
      },
    },
    ...commonThemeProperties.components,
  },
  custom: {
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
    ...commonThemeProperties.custom,
  },
  spacing: (factor) => 8 * factor,
});

const darkTheme = createTheme({
  palette: {
    primary: {
      main: base.primary.dark,
    },
    secondary: {
      main: base.secondary.dark,
    },
    custom: {
      error: { main: "#d32f2f", dark: "#c62828", light: "#ef5350" },
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
    doneIcon: alpha(success.main, 0.5),
    cancelIcon: alpha(error.main, 0.5),
    highlight: "#007867",
    chat: {
      inputBorderRadius: "15px",
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
      variants: [
        {
          props: { variant: "transparent" },
          style: {
            backgroundColor: `transparent !important`,
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
      ],
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

    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: base.grey[900],
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

    MuiButton: {
      styleOverrides: {
        root: {
          color: "white",
        },
      },
    },
    MuiInputBase: {
      variants: [
        {
          props: { variant: "chat" },
          style: {
            color: base.grey[400],
            margin: 5,
            borderRadius: 10,
            "& .MuiInputBase-input.Mui-disabled": {
              WebkitTextFillColor: alpha(base.grey[400], 0.5),
            },
          },
        },
      ],
      styleOverrides: {
        root: {
          color: base.grey[200],
          "&.Mui-disabled": {
            color: base.grey[500],
          },
          "&:before": {
            borderBottom: `1px solid ${base.grey[600]}`,
          },
          "&:hover:not(.Mui-disabled):before": {
            borderBottom: `2px solid ${base.grey[400]}`,
          },
          "&.Mui-focused:after": {
            borderBottom: `2px solid ${base.primary.dark}`,
          },
        },
        input: {
          "&::placeholder": {
            color: base.grey[500],
            opacity: 1,
          },
        },
      },
    },

    MuiSvgIcon: {
      variants: [
        {
          props: { variant: "pageIcon" },
          style: {
            color: base.grey[400],
          },
        },
      ],
    },

    MuiFab: {
      variants: [
        {
          props: { variant: "button" },
          style: (props) => ({
            color: base.grey[400],
            display: props.hide || props.loading ? "none" : "flex",
            ...(props.type === "mic" && props.activate ? micAnimation : {}),
          }),
        },
        {
          props: { variant: "transparent" },
          style: {
            backgroundColor: alpha(base.grey[900], 0.8),
            color: base.grey[400],
            "&:hover": {
              backgroundColor: alpha(base.grey[400], 0.8),
              color: base.grey[900],
            },
            "&.Mui-disabled": {
              backgroundColor: base.grey[900],
              color: base.grey[700],
            },
          },
        },
      ],
      styleOverrides: {
        root: {
          backgroundColor: base.grey[900],
          color: base.grey[400],
          "&:hover": {
            backgroundColor: base.grey[400],
            color: base.grey[900],
          },
          "&.Mui-disabled": {
            backgroundColor: base.grey[900],
            color: base.grey[700],
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

    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: base.grey[500],
          "&.Mui-checked": {
            color: base.primary.dark,
          },
          "&.Mui-disabled": {
            color: base.grey[700],
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: base.grey[500],
          "&:hover": {
            backgroundColor: alpha(base.grey[500], 0.1),
          },
          "&.Mui-disabled": {
            color: base.grey[700],
          },
        },
      },
    },
    ...commonThemeProperties.components,
  },
  custom: {
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
    ...commonThemeProperties.custom,
  },
  spacing: (factor) => 8 * factor,
});

const theme = lightTheme;
export { lightTheme, darkTheme };
export default theme;
