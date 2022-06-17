const styles = {
  root: {
    flexGrow: 1,
    display: "flex",
    height: 400,
  },
  tabs: {
    borderRight: 1,
    borderColor: "divider",
    "& .MuiTabs-indicator": {
      backgroundColor: "#c3c5c8",
      height: 3,
    },
    "& .MuiTab-root.Mui-selected": {
      color: "#c3c5c8",
    },
  },
  tab: {
    "& label": { color: "#c3c5c8" },
  },
};

export default styles;
