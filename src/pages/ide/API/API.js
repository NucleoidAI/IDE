import "react-chat-widget/lib/styles.css";
import APIDialog from "../../../widgets/APIDialog";
import APISettings from "../../../widgets/APISettings";
import APITree from "../../../widgets/APITree";
import Editor from "../../../widgets/Editor";
import React from "react";
import config from "../../../config";
import styles from "./styles";
import { useContext } from "../../../context/context";
import { Card, Grid, Paper } from "@mui/material";
import { Widget as ChatWidget, addResponseMessage } from "react-chat-widget";

function API() {
  const [, dispatch] = useContext();
  return (
    <Grid container sx={styles.root} columns={config.layout.ide.total}>
      <APIDialog />
      <Grid
        item
        xs={config.layout.ide.tree.xs}
        sm={config.layout.ide.tree.sm}
        md={config.layout.ide.tree.md}
        lg={config.layout.ide.tree.lg}
        xl={config.layout.ide.tree.xl}
      >
        <APITree />
      </Grid>
      <Grid
        container
        item
        xs={config.layout.ide.tree.xs}
        sm={config.layout.ide.content.sm}
        md={config.layout.ide.content.md}
        lg={config.layout.ide.content.lg}
        xl={config.layout.ide.content.xl}
        sx={styles.content}
      >
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
      <ChatWidget
        title={"OpenAI"}
        subtitle={"AI-managed Low-code Framewok"}
        showTimeStamp={false}
        resizable={true}
        emojis={false}
        showCloseButton={true}
        handleNewUserMessage={(message) => {
          const resource = message.split('"')[1];

          setTimeout(() => {
            dispatch({ type: "CREATE_SAMPLE_CRUD", payload: { resource } });
            addResponseMessage(`"${resource}" resource is created.`);
          }, 1000);
        }}
      />
    </Grid>
  );
}

export default API;
