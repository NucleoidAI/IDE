import AddList from "../../../components/AddList";
import Editor from "../../../widgets/Editor";
import FunctionDialog from "../../../widgets/FunctionDialog/FunctionDialog";
import FunctionTree from "../../../widgets/FunctionTree";
import IDE from "../../../layouts/IDE";
import styles from "./styles";
import { Card, CardActions, CardContent, Grid, Paper } from "@mui/material";
import { Context, useContext } from "../../../context";

function Functions() {
  const dispatch = useContext(Context)[1];

  function openFunctionDialog(item) {
    dispatch({
      type: "OPEN_FUNCTION_DIALOG",
      payload: item.toUpperCase(),
    });
  }

  return (
    <IDE>
      <Grid container spacing={1}>
        <Grid item xs={3}>
          <Card sx={styles.pageheight}>
            <FunctionDialog />
            <CardContent>
              <FunctionTree />
            </CardContent>
            <CardActions>
              <AddList
                clickEvent={openFunctionDialog}
                list={["Folder", "|", "Class", "Function"]}
              />
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={9}>
          <Paper sx={styles.pageheight}>
            <Editor name={"functions"} functions />
          </Paper>
        </Grid>
      </Grid>
    </IDE>
  );
}

export default Functions;
