import SettingDialog from "../../widgets/SettingDialog/SettingDialog";
import SettingsIcon from "@mui/icons-material/Settings";
import styles from "./styles";
import { useRef } from "react";
import { Button, Grid } from "@mui/material";

function Settings() {
  const handleOpenRef = useRef();

  return (
    <>
      <Grid container sx={styles.root}>
        <Button onClick={() => handleOpenRef.current()} size="large">
          <SettingsIcon sx={styles.settingIcon} fontSize={"large"} />
        </Button>
        <SettingDialog ref={handleOpenRef} />
      </Grid>
    </>
  );
}

export default Settings;
