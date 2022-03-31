import AddList from "../../../components/AddList";
import Editor from "../../../widgets/Editor";
import FunctionDialog from "../../../widgets/FunctionDialog/FunctionDialog";
import FunctionTree from "../../../widgets/FunctionTree";
import actions from "../../../actions";
import styles from "./styles";
import { useNucleoidStore } from "../../../Context/providers/NucleoidStoreProvider";
import { Card, CardActions, CardContent, Grid, Paper } from "@mui/material";

function Functions() {
  const [, dispatch] = useNucleoidStore();

  function openFunctionDialog(item) {
    dispatch({
      type: actions.openFunctionDialog,
      payload: item.toUpperCase(),
    });
  }

  return (
    <>
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
    </>
  );
}

export default Functions;
