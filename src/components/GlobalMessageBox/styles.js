import theme from "../../theme";

const styles = {
  root: {
    backgroundColor: theme.palette.custom.messageBG,
    color: "rgba(0, 0, 0, 0.87)",
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
    minWidth: "250px",
  },
  title: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    maxHeight: "25px",
  },
  titleText: { pl: 1.5, fontSize: "1rem", fontWeight: "bold" },
  content: { ml: 1.5, mr: 1.5 },
  footer: {
    maxHeight: "25px",
    minHeight: "25px",
    display: "flex",
    flexDirection: "column-reverse",
  },
};

export default styles;
