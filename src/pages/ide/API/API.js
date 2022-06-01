import APIDialog from "../../../widgets/APIDialog";
import APISettings from "../../../widgets/APISettings";
import APITree from "../../../widgets/APITree";
import AddIcon from "@mui/icons-material/Add";
import Editor from "../../../widgets/Editor";
import React from "react";
import actions from "../../../actions";
import styles from "./styles";
import { useContext } from "../../../Context/providers/contextProvider";
import { Card, CardActions, Fab, Grid, Paper } from "@mui/material";
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
    <Grid container sx={styles.root}>
      <APIDialog />
      <Grid item xs={3}>
        <Card sx={styles.apiTree}>
          <Grid sx={styles.apiTreeGrid}>
            <APITree />
          </Grid>
          <CardActions>
            <Fab size={"small"} onClick={handleResourceMenu}>
              <AddIcon />
            </Fab>
          </CardActions>
        </Card>
      </Grid>
      <Grid container item xs={9} sx={styles.content}>
        <Grid item xs={12} sx={styles.editorGrid}>
          <Paper sx={styles.editorPaper}>
            <Editor name={"api"} api />
          </Paper>
        </Grid>
        <Grid item xs={12} sx={styles.apiSettingsGrid}>
          <Card sx={{ height: "100%", padding: 1 }}>
            <APISettings />
          </Card>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default API;
