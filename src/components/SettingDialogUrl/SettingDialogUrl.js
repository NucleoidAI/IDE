import TextField from "@mui/material/TextField";
import { forwardRef } from "react";
import styles from "./styles";

const SettingDialogUrl = forwardRef((props, ref) => {
  const urls = ref.current;

  return (
    <>
      <TextField
        label="Nucleoid Runtime URL"
        defaultValue={urls["nucleoid"]}
        sx={styles.textField}
        onChange={(e) => (urls["nucleoid"] = e.target.value)}
      />
      <TextField
        label="OpenAPI URL"
        defaultValue={urls["openApi"]}
        sx={styles.textField}
        onChange={(e) => (urls["openApi"] = e.target.value)}
      />
    </>
  );
});

export default SettingDialogUrl;
