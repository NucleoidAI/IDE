import Logo from "../Logo";
import React from "react";
import SchoolIcon from "@mui/icons-material/School";
import service from "../../service";
import { useEvent } from "@nucleoidai/react-event";
import { Box, Drawer, List, ListItem, ListItemButton } from "@mui/material";

const Educations = React.memo(({ educations }) => {
  return (
    <Box
      variant="permanent"
      sx={{
        mt: 2,
        width: 400,
        "& .MuiDrawer-paper": {
          width: 400,
          bgcolor: "red",
        },
      }}
      role="presentation"
    >
      <Box
        sx={{
          width: "100%",
          p: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
        }}
      >
        <Box display="flex" alignItems="center">
          <SchoolIcon fontSize="large" sx={{ color: "custom.grey" }} />
          &nbsp;&nbsp;
          <Logo title={"Education"} beta={false} />
        </Box>
      </Box>
      <List>
        {educations.map((item, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton>
              {item.type === "twitch" && (
                <iframe
                  src={item.url}
                  height="300"
                  width="400"
                  title={index}
                  allowFullScreen
                ></iframe>
              )}
              {item.type === "youtube" && (
                <iframe
                  width="400"
                  height="300"
                  src={item.url}
                  title={index}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
});

const EducationDrawer = () => {
  const [event, publish] = useEvent("EDUCATION_DRAWER_OPENED", false);
  const [educations, setEducations] = React.useState([]);

  React.useEffect(() => {
    service.getConfig().then((result) => {
      setEducations([...result.data.education]);
    });
  }, []);

  const handleClose = () => {
    publish("EDUCATION_DRAWER_OPENED", false);
  };

  return (
    <Box component="nav">
      <React.Fragment key={"right"}>
        <Drawer
          open={event}
          variant="temporary"
          anchor={"right"}
          onClose={handleClose}
        >
          <Educations educations={educations} />
        </Drawer>
      </React.Fragment>
    </Box>
  );
};

export default EducationDrawer;
