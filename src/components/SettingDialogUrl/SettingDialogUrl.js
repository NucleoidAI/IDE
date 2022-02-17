import TextField from "@mui/material/TextField";
import { forwardRef } from "react";
import styles from "./styles";

const SettingDialogUrl = forwardRef((props, ref) => {
  const url = ref.current;
  console.log(url);
  return (
    <>
      <TextField
        label="Nucleoid Runtime URL"
        defaultValue={url["terminal"]}
        sx={styles.textField}
        onChange={(e) => (url["terminal"] = e.target.value)}
      />
      <TextField
        label="OpenAPI URL"
        defaultValue={url["app"]}
        sx={styles.textField}
        onChange={(e) => (url["app"] = e.target.value)}
      />
    </>
  );
});

export default SettingDialogUrl;
