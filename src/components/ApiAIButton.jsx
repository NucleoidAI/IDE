import { AutoAwesome } from "@mui/icons-material";
import React from "react";
import Settings from "../settings";
import actions from "../actions";
import service from "../service";
import { useContext } from "../context/context";

import { CircularProgress, Fab } from "@mui/material";

const ApiAIButton = () => {
  const [, dispatch] = useContext();
  const [login, setLogin] = React.useState(false);
  const handleClickOpen = () => {
    if (!Settings.token()) {
      dispatch({
        type: actions.openAIDialog,
        payload: { page: "api" },
      });
    } else {
      setLogin(true);
      // TODO : replace refreshToken and accessToken with storage

      service
        .getProjects()
        .then(() => {
          dispatch({
            type: actions.openAIDialog,
            payload: { page: "api" },
          });
        })
        .finally(() => {
          setLogin(false);
        });
    }
  };

  return (
    <>
      {!login ? (
        <Fab size="medium" variant="button" onClick={handleClickOpen}>
          <AutoAwesome />
        </Fab>
      ) : (
        <CircularProgress
          size={25}
          sx={{
            position: "relative",
            textTransform: "none",
            bottom: 20,
            left: 50,
          }}
        />
      )}
    </>
  );
};

export default ApiAIButton;
