const styles = {
  root: { flexShrink: 0 },
  drawer: {
    "& .MuiDrawer-paper": {
      boxSizing: "border-box",
      width: 300,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    },
  },
  listItem: {
    background: "#353e48",
    color: "rgba(255, 255, 255, 0.7)",
    "&:hover,&:focus": {
      color: "rgba(255, 255, 255, 1)",
    },
    "& .MuiTouchRipple-root": {
      backgroundColor: "rgba(255, 255, 255, 0.7)",
      opacity: 0,
      transition: "opacity .4s",
    },
    "&:active .MuiTouchRipple-root": {
      opacity: 0.6,
    },
  },
  listItemIconSmall: {
    color: "custom.grey",
    width: "100%",
    pl: 1,
    pr: 1,
  },
};

export default styles;
