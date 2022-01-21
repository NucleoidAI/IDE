import APITree from "../widgets/APITree";
import Editor from "../widgets/Editor";
import FunctionTree from "../components/FunctionTree";
import Logo from "../components/Logo";
import ParamView from "../components/ParamView";
import React from "react";
import Schema from "../components/Schema";
import { Grid, Paper } from "@material-ui/core";

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
  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      style={{ minHeight: "100vh" }}
    >
      <Logo title="Dev" />
      <br />
      <Paper style={style}>
        <APITree apis={apis} />
      </Paper>
      <br />
      <Paper style={style}>
        <Editor name={"dev"} />
      </Paper>
      <br />
      <Paper style={style}>
        <FunctionTree functions={functions} />
      </Paper>
      <br />
      <Paper style={style}>
        <Schema
          schema={{
            type: "object",
            properties: {
              id: {
                type: "integer",
              },
              text: {
                type: "string",
              },
            },
          }}
        />
      </Paper>
      <br />
      <Paper style={style}>
        <ParamView params={params} />
      </Paper>
      <br />
    </Grid>
  );
}

export default Dev;
