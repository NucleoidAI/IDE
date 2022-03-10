const ratio = 0.6;
const height = 350;

const styles = {
  drawer(theme) {
    return {
      "& .MuiDrawer-paper": {
        top: (window.innerHeight * ratio) / 2 - height / 2 + theme.spacing(1),
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
    };
  },
  listitem(theme) {
    return {
      fill: theme.palette.custom.grey,
      marginTop: 1 / 2,
      marginBottom: 1 / 2,
    };
  },
};

export default styles;
