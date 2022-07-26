const styles = {
  root: { height: "100%" },
  runtimeSelection: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    height: 35,
  },
  textField: {
    width: "100%",
    "& label.Mui-focused": {
      color: "custom.fossil",
    },
    "& .MuiInput-underline:before": {
      borderBottomColor: "custom.grey",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "custom.fossil",
    },
    "& .MuiInputBase-input": {
      color: "custom.grey",
    },
    label: {
      color: "custom.grey",
    },
  },
};

export default styles;
