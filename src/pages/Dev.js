import APISettings from "../widgets/APISettings";
import APITree from "../widgets/APITree";
import AddList from "../components/AddList";
import Button from "@mui/material/Button";
import Editor from "../widgets/Editor";
import FunctionTree from "../widgets/FunctionTree";
import Logo from "../components/Logo";
import ParamView from "../components/ParamView";
import Security from "../components/Security";
import SummaryForm from "../components/SummaryForm";
import service from "../service";
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
  const ref = React.useRef([]);

  useEffect(() => {
    service.query();
  }, []);

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      style={{ minHeight: "100vh" }}
    >
      <Logo title="Dev" />
      <br />

      <h1>Components</h1>
      <br />

      <Paper style={style}>
        <FunctionTree functions={functions} />
      </Paper>
      <br />

      <Paper style={style}>
        <ParamView params={params} />
      </Paper>
      <br />

      <Paper style={style}>.</Paper>
      <br />

      <Paper style={style}>
        <Security />
      </Paper>
      <br />
      <Paper style={style}>
        <SummaryForm summaryText="a" descriptionText="b" ref={ref} />
      </Paper>
      <br />
      <Paper style={style}>
        <AddList list={["Resource", "Method"]} />
      </Paper>
      <br />

      <h1>Widgets</h1>
      <br />

      <Paper style={style}>
        <APITree apis={apis} />
      </Paper>
      <br />

      <Paper style={{ width: 800, height: 300 }}>
        <APISettings />
      </Paper>
      <br />

      <Paper style={style}>
        <Editor name={"api"} api />
      </Paper>
      <br />
      <Paper
        sx={{
          bgcolor: "background.default",
          width: "800px",
          height: "400px",
          borderRadius: "2",
        }}
      ></Paper>
      <br />
      <Paper>
        <Button>font-size: 1rem</Button>
      </Paper>
    </Grid>
  );
}

export default Dev;
