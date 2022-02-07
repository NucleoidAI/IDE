import APIDialog from "../../widgets/APIDialog";
import APISettings from "../../widgets/APISettings";
import APITree from "../../widgets/APITree";
import AddList from "../../components/AddList";
import Editor from "../../widgets/Editor";
import IDE from "../../layouts/IDE";
import React from "react";
import { Card, CardActions, CardContent, Grid, Paper } from "@mui/material";
// eslint-disable-next-line
import { Context } from "../../context";
import { useTheme } from "@mui/material/styles";

function API() {
  const dispatch = React.useContext(Context)[1];
  const theme = useTheme();

  const ratio = 0.65;
  const height = window.innerHeight - theme.spacing(1) * 2 - 1;

  function openApiDialog(item) {
    dispatch({
      type: "OPEN_API_DIALOG",
      payload: item.toUpperCase(),
    });
  }

  return (
    <IDE>
      <APIDialog />
      <Grid container spacing={1}>
        <Grid item xs={3}>
          <Card sx={{ height: height }}>
            <CardContent>
              <APITree />
            </CardContent>
            <CardActions>
              <AddList
                list={["Resource", "Method"]}
                clickEvent={openApiDialog}
              />
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={9}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Paper sx={{ height: height * ratio - theme.spacing(1) / 2 }}>
                <Editor name={"api"} api />
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Card
                sx={{
                  height: height * (1 - ratio) - theme.spacing(1) / 2,
                  padding: 1,
                }}
              >
                <APISettings />
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </IDE>
  );
}

export default API;
