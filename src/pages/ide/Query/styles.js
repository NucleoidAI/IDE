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
      position: "relative",
    };
  },
  playArrowIcon: {
    fill: "#212121",
  },
  jsonSwitch: {
    "z-index": 1,
    position: "absolute",
    right: 0,
    width: 100,
  },
};

export default styles;
