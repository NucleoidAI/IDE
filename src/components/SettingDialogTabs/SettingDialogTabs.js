import SettingDialogUrl from "../SettingDialogUrl";
import TabPanel from "../TabPanel";
import styles from "./styles";
import { Grid, Tab, Tabs } from "@mui/material";
import React, { forwardRef, useState } from "react";

const SettingDialogTabs = forwardRef((props, ref) => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function tabProps(index) {
    return {
      id: `vertical-tab-${index}`,
      "aria-controls": `vertical-tabpanel-${index}`,
    };
  }

  return (
    <Grid sx={styles.root}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        sx={styles.tabs}
      >
        <Tab sx={styles.tab} label="Urls" {...tabProps(0)} />
        <Tab sx={styles.tab} label="Theme" {...tabProps(1)} />
        <Tab sx={styles.tab} label="Language" {...tabProps(2)} />
        <Tab sx={styles.tab} label="Advenced" {...tabProps(3)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <SettingDialogUrl ref={ref} />
      </TabPanel>
    </Grid>
  );
});

export default SettingDialogTabs;
