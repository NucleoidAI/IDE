const styles = {
  root: { width: "100%", height: "100%" },
  editorGrid: { height: "50%" },
  editorPaper: { height: "100%" },
  runButton(theme) {
    return {
      position: "relative",
      bottom: 40 + theme.spacing(1),
      right: theme.spacing(1),
      justifyContent: "flex-end",
      alignItems: "center",
    };
  },
  contentGrid: { pt: 1, height: "50%" },
  loadingCard: { height: "100%" },
  contentCard: { height: "100%", padding: 1 },
  playArrowIcon: {
    fill: "#212121",
  },
  jsonSwitch: {
    "z-index": 1,
    position: "absolute",
    right: 15,
    width: 100,
  },
};

export default styles;
