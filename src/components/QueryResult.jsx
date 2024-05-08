import "./QueryResult.css";

import ReactJsonView from "react-json-view";
import { useTheme } from "@mui/material";

function QueryResult({ json }) {
  const theme = useTheme();
  return (
    <ReactJsonView
      src={json}
      name={null}
      displayDataTypes={false}
      displayObjectSize={false}
      quotesOnKeys={false}
      style={{
        border: 0,
        overflowY: "scroll",
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.primary.contrastText,
      }}
      iconStyle={"circle"}
    />
  );
}

export default QueryResult;
