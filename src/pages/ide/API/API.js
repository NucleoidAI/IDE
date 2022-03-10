import APIDialog from "../../../widgets/APIDialog";
import APISettings from "../../../widgets/APISettings";
import APITree from "../../../widgets/APITree";
import AddIcon from "@mui/icons-material/Add";
import Editor from "../../../widgets/Editor";
import React from "react";
import actions from "../../../actions";
import styles from "./styles";
import { useContext } from "../../../context";
import {
  Card,
  CardActions,
  CardContent,
  Fab,
  Grid,
  Paper,
} from "@mui/material";
// eslint-disable-next-line

function API() {
  const [, dispatch] = useContext();

  const handleResourceMenu = (event, path) => {
    event.preventDefault();

    dispatch({
      type: actions.openResourceMenu,
      payload: {
        anchor: {
          mouseX: event.clientX,
          mouseY: event.clientY,
        },
      },
    });
  };

  return (
    <>
      <APIDialog />
      <Grid container spacing={1}>
        <Grid item xs={3}>
          <Card sx={styles.sidemenucard}>
            <CardContent>
              <APITree />
            </CardContent>
            <CardActions>
              <Fab size={"small"} onClick={handleResourceMenu}>
                <AddIcon />
              </Fab>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={9}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Paper sx={styles.editor}>
                <Editor name={"api"} api />
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Card sx={styles.settings}>
                <APISettings />
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default API;
