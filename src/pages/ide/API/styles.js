const ratio = 0.65;

const styles = {
  editor(theme) {
    return {
      height:
        (window.innerHeight - theme.spacing(1) * 2 - 1) * ratio -
        theme.spacing(1) / 2,
    };
  },
  sidemenucard(theme) {
    return { height: window.innerHeight - theme.spacing(1) * 2 - 1 };
  },
  settings(theme) {
    return {
      height:
        (window.innerHeight - theme.spacing(1) * 2 - 1) * (1 - ratio) -
        theme.spacing(1) / 2,
      padding: 1,
    };
  },
};

export default styles;
