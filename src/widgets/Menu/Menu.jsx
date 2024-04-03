import Drawer from "@mui/material/Drawer";
import GraphButton from "../../components/GraphButton/GraphButton";
import LgDrawerStyled from "../../components/LgDrawerStyled";
import { Link } from "react-router-dom"; // eslint-disable-line
import Logo from "../../components/Logo";
import OpenSwaggerDialog from "../../components/OpenSwaggerDialog";
import ProjectSelect from "../../components/ProjectSelect";
import ProjectSelectSmall from "../../components/ProjectSelectSmall/ProjectSelectSmall";
import React from "react";
import Settings from "../../components/Settings";
import SmallLogo from "../../components/SmallLogo";
import Status from "../Status";
import { drawerWidth } from "../../config";
import settings from "../../settings";
import styles from "./styles";
import { useEvent } from "@nucleoidai/react-event";
import { useTheme } from "@mui/material/styles";

import { ArrowForwardIos, DensityMedium } from "@mui/icons-material/";
import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  useMediaQuery,
} from "@mui/material";

const withFilter = (Component) => {
  return (props) => {
    let list;
    const { query } = props;
    if (!settings.plugin()) {
      list = props.list[0].pages.filter(
        (item) => item.link !== "/dashboard" && item.link !== "/businessflow"
      );
    } else {
      list = [...props.list];
    }

    return <Component {...{ title: "IDE", list, query }} />;
  };
};

//TODO Split this page as components and styles
function Menu(props) {
  const [openMd, setOpenMd] = React.useState(false);
  const [openLg, setOpenLg] = React.useState(true);
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down("lg"));

  const handleClose = () => {
    setOpenMd(false);
  };

  const MenuLinkWithFilter = () => withFilter(MenuLinks)(props);
  const SmallMenuLinkWithFilter = () => withFilter(SmallMenuLinks)(props);

  return (
    <Box component="nav" sx={{ flexShrink: { md: 0 } }}>
      {matchDownMD ? (
        <>
          {!openMd && (
            <Drawer
              variant="permanent"
              sx={{
                width: 75,
                "& .MuiDrawer-paper": {
                  width: 75,
                },
              }}
            >
              <List>
                <ListItem onClick={() => setOpenMd(true)}>
                  <SmallLogo />
                </ListItem>
                <br />
                <SmallMenuLinkWithFilter />
              </List>
              <ProjectSelectSmall />
              <GraphButton />
              <Box sx={{ height: "100%" }} />
              <OpenSwaggerDialog small />
              <Settings size={"large"} />
              <Button sx={{ pb: 3 }} onClick={() => setOpenMd(true)}>
                <ArrowForwardIos
                  fontSize="small"
                  sx={{ fill: theme.palette.custom.grey }}
                />
              </Button>
            </Drawer>
          )}
          <Drawer
            open={openMd}
            onClose={handleClose}
            ModalProps={{ keepMounted: true }}
            variant="temporary"
            sx={{
              display: { xs: "block", lg: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
                borderRight: `1px solid ${theme.palette.divider}`,
                backgroundImage: "none",
                boxShadow: "inherit",
              },
            }}
          >
            <List>
              <ListItem>
                <Logo title={props.title} />
                <IconButton
                  variant={"contained"}
                  onClick={() => setOpenMd(false)}
                >
                  <DensityMedium
                    fontSize="medium"
                    sx={{ fill: theme.palette.custom.grey }}
                  />
                </IconButton>
              </ListItem>
              <br />
              <MenuLinkWithFilter />
            </List>
            <ProjectSelect />
            <GraphButton />
            <Status />
            <OpenSwaggerDialog />
            <Settings size={"large"} />
          </Drawer>
        </>
      ) : (
        <>
          {!openLg && (
            <Drawer
              variant="permanent"
              sx={{
                width: 75,
                "& .MuiDrawer-paper": {
                  width: 75,
                },
              }}
            >
              <List>
                <ListItem onClick={() => setOpenLg(true)}>
                  <SmallLogo />
                </ListItem>
                <br />
                <SmallMenuLinkWithFilter />
              </List>
              <ProjectSelectSmall />
              <GraphButton />
              <Box sx={{ height: "100%" }} />
              <OpenSwaggerDialog small />
              <Settings size={"large"} />
              <Button sx={{ pb: 3 }} onClick={() => setOpenLg(true)}>
                <ArrowForwardIos
                  fontSize="small"
                  sx={{
                    fill: theme.palette.custom.grey,
                  }}
                />
              </Button>
            </Drawer>
          )}
          <LgDrawerStyled variant="permanent" open={openLg}>
            <List>
              <ListItem>
                <Logo title={props.title} />
                <IconButton
                  variant={"contained"}
                  onClick={() => setOpenLg(false)}
                >
                  <DensityMedium
                    fontSize="medium"
                    sx={{ fill: theme.palette.custom.grey }}
                  />
                </IconButton>
              </ListItem>
              <br />
              <MenuLinkWithFilter />
            </List>
            <ProjectSelect />
            <GraphButton />
            <Status />
            <OpenSwaggerDialog />
            <Settings size={"large"} />
          </LgDrawerStyled>
        </>
      )}
    </Box>
  );
}

const MenuLinks = (props) => {
  const [runtimeConnection] = useEvent("RUNTIME_CONNECTION", {
    status: false,
    metrics: {
      total: 100,
      free: 50,
    },
  });

  const { query } = props;

  return (
    <>
      {props.list.map(({ title, link, anchor, icon }) => {
        return (
          <React.Fragment key={title}>
            <ListItemButton
              disabled={
                runtimeConnection.status === false &&
                (title === "Query" || title === "Logs")
              }
              sx={styles.listItem}
              component={Link}
              to={`../${link}/${query}`}
              state={{ anchor }}
              relative="path"
            >
              <ListItemIcon variant="pageIcon">{icon}</ListItemIcon>
              <ListItemText primary={title} />
            </ListItemButton>
          </React.Fragment>
        );
      })}
    </>
  );
};

const SmallMenuLinks = (props) => {
  return (
    <>
      {props.list.map((item, key) => (
        <MenuItem {...item} query={props.query} key={key} />
      ))}
    </>
  );
};

const MenuItem = ({ title, link, anchor, icon, query }) => {
  const [runtimeConnection] = useEvent("RUNTIME_CONNECTION", {
    status: false,
    metrics: {
      total: 100,
      free: 50,
    },
  });
  return (
    <ListItemButton
      disabled={
        runtimeConnection.status === false &&
        (title === "Query" || title === "Logs")
      }
      key={title}
      component={Link}
      to={`../${link}/${query}`}
      state={{ anchor }}
      relative="path"
    >
      <Tooltip placement="right" title={title}>
        <Box sx={styles.listItemIconSmall}>{icon}</Box>
      </Tooltip>
    </ListItemButton>
  );
};

export default Menu;
