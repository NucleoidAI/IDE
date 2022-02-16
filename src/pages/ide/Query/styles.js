const ratio = 0.5;

const styles = {
  editor(theme) {
    return {
      height:
        (window.innerHeight - theme.spacing(1) * 2 - 1) * ratio -
        theme.spacing(1) / 2,
    };
  },
  run(theme) {
    return {
      position: "relative",
      bottom: 40 + theme.spacing(1),
      right: theme.spacing(1),
      justifyContent: "flex-end",
      alignItems: "center",
    };
  },
  results(theme) {
    return {
      height:
        (window.innerHeight - theme.spacing(1) * 2 - 1) * (1 - ratio) -
        theme.spacing(1) / 2,
      justifyContent: "flex-start",
      paddingLeft: theme.spacing(1) * 2,
    };
  },
  playArrowIcon: {
    fill: "#212121",
  },
};

export default styles;
