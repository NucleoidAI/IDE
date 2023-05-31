import AddList from "@nucleoidjs/components/AddList";
import Editor from "../../../widgets/Editor";
import FunctionDialog from "../../../widgets/FunctionDialog/FunctionDialog";
import FunctionTree from "../../../widgets/FunctionTree";
import Page from "../../../components/Page";
import config from "../../../config";
import styles from "./styles";
import { useContext } from "../../../context/context";
import { Card, CardActions, Grid, Paper } from "@mui/material";

function Functions() {
  const [, dispatch] = useContext();

  function openFunctionDialog(item) {
    dispatch({
      type: "OPEN_FUNCTION_DIALOG",
      payload: { type: item.toUpperCase() },
    });
  }

  return (
    <Page title={"Functions"}>
      <Grid container sx={styles.root} columns={config.layout.ide.total}>
        <Grid
          item
          xs={config.layout.ide.tree.xs}
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
                list={["Class", "Function"]}
              />
            </CardActions>
          </Card>
        </Grid>
        <Grid
          item
          xs={config.layout.ide.tree.xs}
          sm={config.layout.ide.content.sm}
          md={config.layout.ide.content.md}
          lg={config.layout.ide.content.lg}
          xl={config.layout.ide.content.xl}
          sx={styles.editorGrid}
        >
          <Paper sx={styles.editorPaper}>
            <Editor functions />
          </Paper>
        </Grid>
      </Grid>
    </Page>
  );
}

export default Functions;
