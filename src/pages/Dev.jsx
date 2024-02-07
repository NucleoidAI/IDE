import APISettings from "../widgets/APISettings";
import APITree from "../widgets/APITree";
import FunctionTree from "../widgets/FunctionTree";
import Logo from "../components/Logo";
import ParamView from "../components/ParamView";
import { publish } from "@nucleoidjs/react-event";
import { Grid, Paper } from "@mui/material";
import React, { useEffect } from "react";

const apis = [
  {
    path: "/",
    methods: ["GET"],
  },
  {
    path: "/devices",
    methods: ["GET", "POST"],
  },
  {
    path: "/questions",
    methods: ["GET", "POST", "DELETE", "PUT"],
  },
  {
    path: "/questions/reviews",
    methods: ["POST"],
  },
];

const functions = [
  {
    path: "/",
    name: "getInfo",
    params: [],
    type: "function",
  },
  {
    path: "/users",
    name: "getUser",
    params: ["user"],
    type: "function",
  },
  {
    path: "/users/classes",
    name: "User",
    type: "class",
    params: ["email", "password"],
  },
];

const params = [
  {
    name: "order",
    in: "query",
    type: "string",
    required: true,
    description: "filter by order",
  },
  {
    name: "item",
    in: "query",
    type: "integer",
    required: false,
    description: "filter by item",
  },
];

const style = { height: 300, width: 300 };

function Dev() {
  useEffect(() => {
    setTimeout(() => {
      publish("EDITOR_LOADING_COMPLETED", {});
    }, 0);
  }, []);

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      style={{ minHeight: "100vh" }}
    >
      <Paper style={style}>
        <Logo />
      </Paper>
      <br />
      <Paper style={style}>
        <APISettings />
      </Paper>
      <br />
      <Paper style={style}>
        <FunctionTree functions={functions} />
      </Paper>
      <br />
      <Paper style={style}>
        <ParamView params={params} />
      </Paper>
      <br />
      <Paper style={style}>
        <APITree apis={apis} />
      </Paper>
    </Grid>
  );
}

export default Dev;
