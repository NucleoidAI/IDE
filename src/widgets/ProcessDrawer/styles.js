const height = 380;

const styles = {
  drawer: {
    "& .MuiDrawer-paper": {
      top: "10%",
      height,
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
};

export default styles;
