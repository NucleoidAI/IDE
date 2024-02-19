import { Box } from "@mui/material";
import PopChat from "../../widgets/PopChat";
import EducationDrawer from "../../components/EducationDrawer/EducationDrawer";
import GlobalSnackMessage from "../../components/GlobalSnackMessage";
import GraphDialog from "../../components/GraphDialog/GraphDialog";
import Menu from "../../widgets/Menu";
import Onboard from "../../components/Onboard";
import { Outlet } from "react-router-dom"; // eslint-disable-line
import ProcessDrawer from "../../widgets/ProcessDrawer/ProcessDrawer";
import React from "react";
import Settings from "../../settings";
import SwaggerDialog from "../../components/SwaggerDialog";
import routes from "../../routes";
import styles from "./styles";

function IDE() {
  return (
    <Box sx={styles.root}>
      <Menu list={routes} title="IDE" />
      <EducationDrawer />
      <Box sx={styles.content}>
        <Outlet />
      </Box>
      {Settings.landing().level < 5 && <Onboard />}
      <ProcessDrawer />
      <SwaggerDialog />
      <GlobalSnackMessage />
      <PopChat />
      <GraphDialog />
    </Box>
  );
}

export default IDE;
