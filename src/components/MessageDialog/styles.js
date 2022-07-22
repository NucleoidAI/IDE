import theme from "../../theme";

const styles = {
  root: {
    backgroundColor: theme.palette.custom.messageBG,
    color: "rgba(0, 0, 0, 0.87)",
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
  },
  titleContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleText: { pl: 2.5, fontSize: "1rem", fontWeight: "bold" },
  content: {
    ml: 2.5,
    mr: 2.5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    maxHeight: "25px",
    minHeight: "25px",
    display: "flex",
    flexDirection: "column-reverse",
  },
};

export default styles;
