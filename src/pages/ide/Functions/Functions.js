import AddList from "../../../components/AddList";
import Editor from "../../../widgets/Editor";
import FunctionDialog from "../../../widgets/FunctionDialog/FunctionDialog";
import FunctionTree from "../../../widgets/FunctionTree";
import config from "../../../config";
import styles from "./styles";
import { useContext } from "../../../Context/providers/contextProvider";
import { Card, CardActions, Grid, Paper } from "@mui/material";

function Functions() {
  const [, dispatch] = useContext();

  function openFunctionDialog(item) {
    dispatch({
      type: "OPEN_FUNCTION_DIALOG",
      payload: item.toUpperCase(),
    });
  }

  return (
    <Grid container sx={styles.root} columns={config.layout.ide.total}>
      <Grid
        item
        sm={config.layout.ide.tree.sm}
        md={config.layout.ide.tree.md}
        lg={config.layout.ide.tree.lg}
        xl={config.layout.ide.tree.xl}
      >
        <Card sx={styles.functionTreeCard}>
          <FunctionDialog />
          <Grid sx={styles.functionTreeGrid}>
            <FunctionTree />
          </Grid>
          <CardActions>
            <AddList
              clickEvent={openFunctionDialog}
              list={["Folder", "|", "Class", "Function"]}
            />
          </CardActions>
        </Card>
      </Grid>
      <Grid
        item
        sm={config.layout.ide.content.sm}
        md={config.layout.ide.content.md}
        lg={config.layout.ide.content.lg}
        xl={config.layout.ide.content.xl}
        sx={styles.editorGrid}
      >
        <Paper sx={styles.editorPaper}>
          <Editor name={"functions"} functions />
        </Paper>
      </Grid>
    </Grid>
  );
}

export default Functions;
