import theme from "../../theme";

const styles = {
  root: {
    backgroundColor: theme.palette.custom.messageBG,
    color: "rgba(0, 0, 0, 0.87)",
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
    maxWidth: 450,
  },
  title: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleText: {
    pl: 2,
    fontSize: "1rem",
    fontWeight: "bold",
    minWidth: "36px",
  },
  content: { pr: 1.5, pl: 1.5 },
  footer: { minHeight: "25px" },
};

export default styles;
