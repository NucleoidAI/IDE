const styles = {
  root: { width: 300, flexShrink: 0 },
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
  },
  listItemIcon: {
    color: "custom.grey",
  },
};

export default styles;
