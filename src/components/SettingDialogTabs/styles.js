const styles = {
  root: {
    flexGrow: 1,
    display: "flex",
    height: 400,
  },
  tabs: {
    borderRight: 1,
    borderColor: "divider",
    color: "secondary",
    //textColor: "secondary",
  },
  tab: {
    ".Mui-selected": {
      bgcolor: "red",
    },
    "&:hover": {
      bgcolor: "rgba(255,255,255,0.1)",
    },
  },
};

export default styles;
