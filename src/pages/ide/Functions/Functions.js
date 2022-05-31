import AddList from "../../../components/AddList";
import Editor from "../../../widgets/Editor";
import FunctionDialog from "../../../widgets/FunctionDialog/FunctionDialog";
import FunctionTree from "../../../widgets/FunctionTree";
import actions from "../../../actions";
import styles from "./styles";
import { useContext } from "../../../Context/providers/contextProvider";
import { Card, CardActions, CardContent, Grid, Paper } from "@mui/material";

function Functions() {
  const [, dispatch] = useContext();

  function openFunctionDialog(item) {
    dispatch({
      type: actions.openFunctionDialog,
      payload: item.toUpperCase(),
    });
  }

  return (
    <Grid container sx={styles.root}>
      <Grid item xs={3}>
        <Card sx={styles.functionTreeCard}>
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
      <Grid item xs={9} sx={styles.editorGrid}>
        <Paper sx={styles.editorPaper}>
          <Editor name={"functions"} functions />
        </Paper>
      </Grid>
    </Grid>
  );
}

export default Functions;
