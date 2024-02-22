import Button from "@mui/material/Button";
import { CircularProgress } from "@mui/material";
import OpenAI from "../icons/OpenAI";
import React from "react";
import Settings from "../settings";
import actions from "../actions";
import service from "../service";
import { useContext } from "../context/context";

const OpenAIButton = () => {
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
        <Button
          data-cy="openAI-dialog-button"
          sx={{
            position: "relative",
            textTransform: "none",
            bottom: 20,
            left: 15,
          }}
          onClick={handleClickOpen}
          startIcon={<OpenAI />}
        >
          OpenAI
        </Button>
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

export default OpenAIButton;
